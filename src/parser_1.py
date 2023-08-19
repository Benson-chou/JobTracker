import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
import requests
from bs4 import BeautifulSoup
import re
import spacy
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import email_credentials
import schedule
import time

# Connect to database
cred = credentials.Certificate("./src/firebase_setup/jobtracker-944a3-firebase-adminsdk-b71lt-f4f0b843d5.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def find_role(content, role):
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(content)
    lemmatized_phrase = " ".join([token.lemma_ for token in nlp(role)])
    pattern = rf'\b{re.escape(lemmatized_phrase)}\b'
    matches = re.finditer(pattern, content, re.IGNORECASE)

    result = [match.group() for match in matches] != []
    return result

def parse_website(jobURL, role):
    # Get the html string from the website
    response = requests.get(jobURL)

    # If the response is successful, then we parse the html string and return if role
    # is found in the html string
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        content = soup.get_text(separator=' ')
        return find_role(content, role)
    else: 
        print("Failed to get the html string")
        return False

def send_email(email, jobs):
    receiver_email = email
    subject = "Updates on your job search"
    message_body = "<h2> Here are the jobs that have been updated: </h2> <br>"
    for job in jobs: 
        message_body += f"<a href='{job['link']}'>{job['role']} at {job['name']} </a> <br>"
    
    # Construct the email
    msg = MIMEMultipart()
    msg['From'] = email_credentials.sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject
    msg.attach(MIMEText(message_body, 'html'))

    try: 
        smtp_server = "smtp.gmail.com"
        port = 587 # Port for TLS
        smtp_username = email_credentials.sender_email
        smtp_password = email_credentials.sender_password

        with smtplib.SMTP(smtp_server, port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.sendmail(email_credentials.sender_email, receiver_email, msg.as_string())
        print("Successfully sent email")
    except Exception as e:
        print("Error sending email:", e)
    return

def get_jobs():
    results = {}
    # Connects to the requests collection
    request_ref= db.collection('requests')
    # Gets all the documents for the collection
    request_docs = request_ref.stream()
    jobs_ref = db.collection('jobDescrip')

    # Loop through each document of the requests collection
    for request in request_docs: 
        email = request.to_dict()['UserID']
        jobURL = request.to_dict()['JobID']
        role = request.to_dict()['role']
        if request.to_dict()['UserID'] not in results:
            results[email] = []
        # Find the docs in jobDescrip
        jobs = jobs_ref.where(filter=FieldFilter('link', '==', jobURL)).where(filter=FieldFilter('role', '==', role)).stream()
        for job in jobs: 
            if job.to_dict()['description'] == True:
                results[email].append(job.to_dict())
            else:
                if parse_website(jobURL, role):
                    results[email].append(job.to_dict())
                    job.reference.update({'description': True})

    # Loop through the results dictionary and send an email to each of the users
    for email, jobs in results.items():
        send_email(email, jobs)
    return

# Schedule the job to run every day at 9:00 AM
schedule.every().day.at("09:00").do(get_jobs)

while True: 
    schedule.run_pending()
    time.sleep(1)
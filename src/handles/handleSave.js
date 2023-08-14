import { addDoc, collection, getDocs, where, query} from "@firebase/firestore"
import { db } from "../firebase_setup/firebase"
 
const handleSave = async (url, name, email) => {
    // Check if url is already in jobDescrip table
    const jobs = collection(db, "jobDescrip") // Firebase creates this automatically
    const q = query(jobs, where("link", "==", url))
    const job_docs = await getDocs(q)
    let job_data = {}
    if (job_docs.empty) {
        job_data = {
            link: url, 
            name: name,
            description: false, 
            date: null
        }
        try {
            addDoc(jobs, job_data)
        } catch(err) {
            console.log(err)
        }
    } else {
        // Soon to be implemented: update the date
    }

    // Check if email is already in users table
    const users = collection(db, "userInfo")
    const requests = collection(db, "requests")
    const q2 = query(users, where("email", "==", email))
    const q3 = query(requests, where("UserID", "==", email), 
                                 where("JobID", "==", url))
    const user_docs = await getDocs(q2)
    const requst_docs = await getDocs(q3)
    let user_data = {}
    let request_data = {}
    if (user_docs.empty) {
        user_data = {
            email: email
        }
        request_data = {
            UserID: email, 
            JobID: url
        }
        try {
            addDoc(users, user_data)
            addDoc(requests, request_data)
        } catch(err) {
            console.log(err)
        }
    }else{
        if (requst_docs.empty) {
            request_data = {
                UserID: email, 
                JobID: url
            }
            try {
                addDoc(requests, request_data)
            } catch(err) {
                console.log(err)
            }
        }
    }

    
    
}
 
export default handleSave
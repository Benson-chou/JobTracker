import '../App.css';
import React, { useState, useRef, useEffect } from 'react';
import CompanyList from '../CompanyList'
import handleSave from '../handles/handleSave'
import handleClear from '../handles/handleClear'
import { v4 as uuidv4 } from "uuid"
import { UserAuth } from '../context/AuthContext'
import {collection, getDocs, query, where} from 'firebase/firestore'
import { db } from "../firebase_setup/firebase"

function Listpage() {
  const {user, logOut} = UserAuth()

  const [companies, setcompanies] = useState([])
  const companyNameRef = useRef()
  const [editMode, setEditMode] = useState(false)

  // Set companies to companies from database
  useEffect(()=>{
    if (user){
        const requests = collection(db, "requests")
        const jobs = collection(db, "jobDescrip")

        const fetchData = async () => {
            const querySnapshot = await getDocs(query(requests, where("UserID", "==", user.email)))
            querySnapshot.forEach(async docSnapshot => {
                const jobUrl = docSnapshot.data().JobID
                const jobUrlQuery = query(jobs, where("link", "==", jobUrl))
                const jobUrlSnapshot = await getDocs(jobUrlQuery)

            jobUrlSnapshot.forEach(async jobDocSnapshot =>{
                var id = uuidv4()
                setcompanies(prevcompanies => {
                    return [...prevcompanies, {id: id, url: jobDocSnapshot.data().link, name: jobDocSnapshot.data().name, complete: jobDocSnapshot.data().description, clear: false}]
                })
            })
            })
        }
        fetchData()
    }
  }, [user])

  // Enter edit mode and 
  function handleEditClick(){
    setEditMode(!editMode);

    // Clear all "clear" values to be false
    const updatedCompanies = companies.map(company => ({
      ...company,
      clear: false
    }));
    setcompanies(updatedCompanies);
  }

  function toggleCompany(id) {
    const newcompanies = [...companies]
    const company = newcompanies.find(company => company.id === id)
    company.clear = !company.clear
    setcompanies(newcompanies)
  }

  function isValidLink(link) {
    // Regular expression to check URL format
    const urlPattern = new RegExp(
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\/\S*)?$/
    );
  
    return urlPattern.test(link)
  }

  // Get the name of the company from the URL
  function getWordAfterWWW(url) {
    const regex = /www\.(\w+)/i;
    const match = url.match(regex);
    const backup = url.split('//')[1].split('.')[0];
    return match ? match[1] : backup;
  }

  // Add a company to the list
  function handleAddCompany(e) {
    const url = companyNameRef.current.value.trim()
    if (url === '') return
    if (!isValidLink(url)) {
      companyNameRef.current.value = null
      return window.alert("Please enter a valid URL")
  }
    const name = getWordAfterWWW(url)
    var id = uuidv4()
    setcompanies(prevcompanies => {
      return [...prevcompanies, {id: id, url: url, name: name, complete: false, clear: false}]
    })
    
    handleSave(url, name, user.email)
    companyNameRef.current.value = null
  }
  
  // Clear complete companies, close edit Mode and clear mode.
  function handleClearcompanies() {
    const newcompanies = companies.filter(company => !company.clear)
    const removecompanies = companies.filter(company => company.clear)
    setcompanies(newcompanies)
    removecompanies.forEach(company => {
      handleClear(user.email, company.url)
    })
    setEditMode(false)
  }
  
  const handleSignOut = async () => {
    try {
        await logOut()
    } catch (error) {
        console.log(error)
    }
    }

    return (
    <>
      <p> Hello, {user?.displayName}</p>
      <CompanyList companies={companies} toggleCompany={toggleCompany} editMode={editMode}/>
      <input ref={companyNameRef} type="text" placeholder='Insert Job URL'/>
      <button onClick={handleAddCompany}>Add Company</button>
      <button onClick={handleEditClick}>
        {editMode ? 'Save' : 'Edit'}
      </button>
      {editMode && <button onClick={handleClearcompanies}>Clear Complete</button>}
      <br></br><button onClick={handleSignOut}> LogOut</button>
    </>
    );
}

export default Listpage;
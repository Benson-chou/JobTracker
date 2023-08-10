import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import CompanyList from './CompanyList'
import handleSave from './handles/handleSave'
import handleClear from './handles/handleClear'
import { v4 as uuidv4 } from "uuid"
// import email from './background'

// const uuidv4 = require('uuid');

const LOCAL_STORAGE_KEY = 'companyApp.companies'
function App() {
  if (JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) === null) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]))
  }
  const [companies, setcompanies] = useState(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)))
  const companyNameRef = useRef()
  const [editMode, setEditMode] = useState(false)

  // chrome.identity.getProfileUserInfo(function(userInfo) { email = userInfo.email; });
  // console.log(email);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(companies))
  }, [companies])

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
    return match ? match[1] : url;
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
    handleSave(id, url, name)
    companyNameRef.current.value = null
  }
  
  // Clear complete companies, close edit Mode and clear mode.
  function handleClearcompanies() {
    const newcompanies = companies.filter(company => !company.clear)
    const removecompanies = companies.filter(company => company.clear)
    setcompanies(newcompanies)
    removecompanies.forEach(company => {
      handleClear(company.id)
    })
    setEditMode(false)
  }
  
    return (
    <>
      <CompanyList companies={companies} toggleCompany={toggleCompany} editMode={editMode}/>
      <input ref={companyNameRef} type="text" />
      <button onClick={handleAddCompany}>Add Company</button>
      <button onClick={handleEditClick}>
        {editMode ? 'Save' : 'Edit'}
      </button>
      {editMode && <button onClick={handleClearcompanies}>Clear Complete</button>}
    </>
    );
}

export default App;
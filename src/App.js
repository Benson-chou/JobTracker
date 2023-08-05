import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import CompanyList from './CompanyList'
import { v4 as uuidv4 } from "uuid";
// const uuidv4 = require('uuid');

const LOCAL_STORAGE_KEY = 'companyApp.companies'
function App() {
  if (JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) === null) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]))
  }
  const [companies, setcompanies] = useState(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)))
  const companyNameRef = useRef()

  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(companies))
  }, [companies])

  function toggleCompany(id) {
    const newcompanies = [...companies]
    const company = newcompanies.find(company => company.id === id)
    company.complete = !company.complete
    setcompanies(newcompanies)
  }

  function isValidLink(link) {
    // Regular expression to check URL format
    const urlPattern = new RegExp(
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\/\S*)?$/
    );
  
    return urlPattern.test(link)
  }

  function getWordAfterWWW(url) {
    const regex = /www\.(\w+)/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  function handleAddCompany(e) {
    const url = companyNameRef.current.value
    if (url === '') return
    if (!isValidLink(url)) {
      companyNameRef.current.value = null
      return window.alert("Please enter a valid URL")
  
  }
    const name = getWordAfterWWW(url)
    setcompanies(prevcompanies => {
      return [...prevcompanies, {id: uuidv4(), url: url, name: name, complete: false}]
    })
    companyNameRef.current.value = null
  }

  function handleClearcompanies() {
    const newcompanies = companies.filter(company => !company.complete)
    setcompanies(newcompanies)
  }
  // console.log(companies)
    return (
      <>
      <CompanyList companies={companies} toggleCompany={toggleCompany} />
      <input ref={companyNameRef} type="text" />
      <button onClick={handleAddCompany}>Add Company</button>
      <button onClick={handleClearcompanies}>Clear Complete</button>
    </>
    );
}

export default App;
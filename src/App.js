import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import TodoList from './TodoList'
import { v4 as uuidv4 } from "uuid";
// const uuidv4 = require('uuid');

const LOCAL_STORAGE_KEY = 'todoApp.todos'
function App() {
  if (JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) === null) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]))
  }
  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)))
  const todoNameRef = useRef()

  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function toggleTodo(id) {
    const newTodos = [...todos]
    const todo = newTodos.find(todo => todo.id === id)
    todo.complete = !todo.complete
    setTodos(newTodos)
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

  function handleAddTodo(e) {
    const url = todoNameRef.current.value
    if (url === '') return
    if (!isValidLink(url)) {
      todoNameRef.current.value = null
      return window.alert("Please enter a valid URL")
  
  }
    const name = getWordAfterWWW(url)
    setTodos(prevTodos => {
      return [...prevTodos, {id: uuidv4(), url: url, name: name, complete: false}]
    })
    todoNameRef.current.value = null
  }

  function handleClearTodos() {
    const newTodos = todos.filter(todo => !todo.complete)
    setTodos(newTodos)
  }
  // console.log(todos)
    return (
      <>
      <TodoList todos={todos} toggleTodo={toggleTodo} />
      <input ref={todoNameRef} type="text" />
      <button onClick={handleAddTodo}>Add Todo</button>
      <button onClick={handleClearTodos}>Clear Complete</button>
    </>
    );
}

export default App;
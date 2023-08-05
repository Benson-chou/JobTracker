import React from 'react'

export default function Todo({todo, toggleTodo}) {
    function handleTodoClick() {
        toggleTodo(todo.id)
      }

    return (
    <div>
        <label>
            <input type="checkbox" checked={todo.complete} onChange={handleTodoClick}  />
            <a href = {todo.url}>{todo.name}</a> 
        </label>
        
    </div>
    
  )
}

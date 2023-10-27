import React from 'react'
import Todo from "../styles/Todo.css"
import iconCheck from "../images/icon-check.svg"
import iconCross from "../images/icon-cross.svg"

const TodoList = () => {
  return (
    <div className='todo-container'>
        <form action="">
            <div className="input-container"> 
                <input className="todo-input" type="text" placeholder='Create a new todo...'/>
                <img className="icon-cross" src={iconCross} alt="" />
            </div>
            <img className="icon-check" src={iconCheck} alt="" />
        </form>
    </div>
  )
}

export default TodoList
import React from 'react'
import '../styles/Theme.css';
import "../styles/Todo.css"
import iconCheck from "../images/icon-check.svg"
import iconCross from "../images/icon-cross.svg"
import { useState, useEffect } from 'react';

const TodoList = () => {

  const [tasks, setTasks] = useState([]);

  useEffect(()=> {
    const getTasks = async  () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer)
    }
    getTasks();
  },[])

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();
    console.log(data)
    return data;
  };

  return (
    <div className='todo-container'>
        <form action="">
            <div className="input-container"> 
                <input className="todo-input" type="text" placeholder='Create a new todo...'/>
            </div>
        </form>

      
        {tasks.map((task) => (
          <div className="tasks-container" key={task.id}>
            <img className="icon-check" src={iconCheck} alt="" />
            <p className="task">{task.task}</p>
            <img className="icon-cross" src={iconCross} alt="" />
          </div>
        ))}
      
    </div>
  )
}

export default TodoList
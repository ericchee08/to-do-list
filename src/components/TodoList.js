import React from 'react'
import '../styles/Theme.css';
import "../styles/Todo.css"
import iconCheck from "../images/icon-check.svg"
import iconCross from "../images/icon-cross.svg"
import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../Contexts/ThemeContext';

const TodoList = () => {

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(''); 
  const {theme} = useContext(ThemeContext);

  useEffect(()=> {
    const getTasks = async () => {
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

  //calls the POST endpoint
  const addTask = async (newTask) => {
    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    const data = await res.json();

    setTasks([...tasks, data]);
  };

  //records the input change value 
  const handleTaskInputChange = (event) => {
    setNewTask(event.target.value);
  };

  //on submit pass the newTask variable set in handleTaskInputchange to addTask()
  const handleSubmit = (event) => {
    event.preventDefault();
    if (newTask.trim() === '') {
      return; 
    }
    const newTaskObject = { task: newTask };
    addTask(newTaskObject);
    setNewTask(''); 
  };

  return (
    <div className='todo-container' id={theme}>
        <form onSubmit={handleSubmit}>
            <div className="input-container"> 
                <input className="todo-input" type="text" placeholder='Create a new todo...' value={newTask} onChange={handleTaskInputChange}/>
            </div>
        </form>

        {tasks.map((task, index) => (
          <div className={`tasks-container ${index === 0 ? 'first-task' : ''}`} key={task.id}>
            <img className="icon-check" src={iconCheck} alt="" />
            <p className="task">{task.task}</p>
            <img className="icon-cross" src={iconCross} alt="" />
          </div>
        ))}
      
    </div>
  )
}

export default TodoList
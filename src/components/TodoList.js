import React from 'react'
import '../styles/Theme.css';
import "../styles/Todo.css"
import iconCheck from "../images/icon-check.svg"
import iconCross from "../images/icon-cross.svg"
import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../Contexts/ThemeContext';
import { DragDropContext, Draggable, Droppable} from '@hello-pangea/dnd';

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

  const deleteTask = async (taskId) => {
    const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (res.status === 200) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    } else {
      console.error('Failed to delete the task');
    }
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

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  }
  
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className='todo-container' id={theme}>
          <form onSubmit={handleSubmit}>
              <div className="input-container"> 
                <input className="todo-input" type="text" placeholder='Create a new todo...' value={newTask} onChange={handleTaskInputChange}/>
              </div>
          </form>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => {
                return ( 
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div className={`tasks-container ${index === 0 ? 'first-task' : ''}`} key={task.id}>
                          <img className="icon-check" src={iconCheck} alt="" />
                          <p className="task">{task.task}</p>
                          <img className="icon-cross" src={iconCross} alt="" onClick={() => deleteTask(task.id)}/>
                        </div>
                      </li>
                    )}
                  </Draggable>
                )	
              })}
            </ul>
          )}
        </Droppable>
        
      </div>
    </DragDropContext>
  )
}

export default TodoList
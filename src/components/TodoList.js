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
  const [filter, setFilter] = useState(localStorage.getItem('todoFilter') || 'all');
  const {theme} = useContext(ThemeContext);


  useEffect(()=> {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      const sortedTasks = tasksFromServer.sort((a, b) => a.order_item - b.order_item);

      setTasks(sortedTasks)
    }
    getTasks();
  },[])

  useEffect(() => {
    localStorage.setItem('todoFilter', filter);
  }, [filter]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') {
      return task.active_item === 0;
    } else if (filter === 'completed') {
      return task.active_item === 1;
    } else {
      return true;
    }
  });

  const handleFilterClick = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const fetchTasks = async () => {
    const apiKey = `${process.env.REACT_APP_API_KEY}`; 
    
    const res = await fetch(`${process.env.REACT_APP_API_URL}`, {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': 'https://ec-todolist.netlify.app/'
      },
    });
  
    const data = await res.json();
    const todos = data.todos;
    return todos;
  };

  const fetchTask = async (taskId) => {
    const apiKey = `${process.env.REACT_APP_API_KEY}`; 

    const res = await fetch(`${process.env.REACT_APP_API_URL}/todo/${taskId}`, {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  }

  const deleteTask = async (taskId) => {
    const apiKey = `${process.env.REACT_APP_API_KEY}`; 

    await fetch(`${process.env.REACT_APP_API_URL}/todo/${taskId}`, {
      method: 'DELETE',
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    const tasksFromServer = await fetchTasks();
    const sortedTasks = tasksFromServer.sort((a, b) => a.order_item - b.order_item);
    setTasks(sortedTasks);
  };

  const clearCompleted = async () => {
    const apiKey = `${process.env.REACT_APP_API_KEY}`; 

    await fetch(`${process.env.REACT_APP_API_URL}/todos/deleteActiveItems`,{
      method: 'DELETE',
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
  });
    const tasksFromServer = await fetchTasks();
    const sortedTasks = tasksFromServer.sort((a, b) => a.order_item - b.order_item);
    setTasks(sortedTasks);
  }

  const addTask = async (newTask) => {
    const tasksFromServer = await fetchTasks();
    const minOrderItem = Math.min(...tasksFromServer.map(task => task.order_item), 0);
    const order_item = minOrderItem -1;
    const newTaskObject = { ...newTask, order_item };

    const apiKey = `${process.env.REACT_APP_API_KEY}`; 
  
    await fetch(`${process.env.REACT_APP_API_URL}/todo`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-type": "application/json",
      },
      body: JSON.stringify(newTaskObject),
    });
  
    const updatedTasks = await fetchTasks();
  
    const sortedTasks = updatedTasks.sort((a, b) => a.order_item - b.order_item);
    setTasks(sortedTasks);
  };

  const updateStatus = async (updateTask) => {
    const apiKey = `${process.env.REACT_APP_API_KEY}`; 

    await fetch(`${process.env.REACT_APP_API_URL}/todo/updateStatus`, {
      method: "PUT",
      headers: {
        "x-api-key": apiKey,
        "Content-type": "application/json",
      },
      body: JSON.stringify(updateTask),
    });
    const tasksFromServer = await fetchTasks();
    const sortedTasks = tasksFromServer.sort((a, b) => a.order_item - b.order_item);
    setTasks(sortedTasks);
  }

  const updatePosition = async (updateTask) => {
    const apiKey = `${process.env.REACT_APP_API_KEY}`; 

    await fetch(`${process.env.REACT_APP_API_URL}/todo/updatePosition`, {
      method: "PUT",
      headers: {
        "x-api-key": apiKey,
        "Content-type": "application/json",
      },
      body: JSON.stringify(updateTask),
    });
    const tasksFromServer = await fetchTasks();
    const sortedTasks = tasksFromServer.sort((a, b) => a.order_item - b.order_item);
    setTasks(sortedTasks);
  }
  
  const setCheckStatus = async (taskId) => {
    const taskToCheckStatus = await fetchTask(taskId);
    const status = taskToCheckStatus.active_item === 0 ? 1 : 0
    const updTask = { ...taskToCheckStatus, active_item: status };
    console.log(updTask)
    updateStatus(updTask)
  }

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
    const newTaskObject = { todo_item: newTask, active_item: 0 };
    addTask(newTaskObject);
    setNewTask(''); 
  };
  
  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);

    const updatedTasks = items.map((task, index) => ({
      ...task,
      order_item: index + 1, 
    }));
    updatePosition(updatedTasks)
  }

  function numberOfItemsLeft(tasks) {
    const inactiveTasks = tasks.filter(task => task.active_item === 0);
    const numberOfInactiveTasks = inactiveTasks.length;
    return numberOfInactiveTasks
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
            <div {...provided.droppableProps} ref={provided.innerRef} >
              {filteredTasks.map((task, index) => {
                return ( 
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                        <div className={`tasks-container ${index === 0 ? 'first-task' : ''}`} key={task.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div className='task-and-check-container'>
                              <div className={task.active_item === 0 ? "icon-check-inactive" : "icon-check-active"} onClick={() => setCheckStatus(task.id)}>
                                <img className="icon-check" src={iconCheck} alt="" />
                              </div>
                              <p className={`task ${task.active_item === 1 ? 'task-crossed-out' : ''}`}>{task.todo_item}</p>
                          </div>
                          <img className="icon-cross" src={iconCross} alt="" onClick={() => deleteTask(task.id)}/>
                        </div>
                    )}
                  </Draggable>
                )	
              })}
							{provided.placeholder}
                <div className="task-footer-container">
                  <div className="number-of-items">{numberOfItemsLeft(tasks)} items left</div>
                  <div className="task-status">
                    <div className="all" onClick={() => handleFilterClick('all')}>
                      All
                    </div>
                    <div className="active" onClick={() => handleFilterClick('active')}>
                      Active
                    </div>
                    <div className="completed" onClick={() => handleFilterClick('completed')}>
                      Completed
                    </div>
                  </div>
                  <div className="clear-completed" onClick={() => clearCompleted()}>Clear Completed</div>
                </div>
                <div className="footer">Drag and drop to reorder list</div>
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  )
}

export default TodoList
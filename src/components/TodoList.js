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
      setTasks(tasksFromServer)
    }
    getTasks();
  },[])

  useEffect(() => {
    localStorage.setItem('todoFilter', filter);
  }, [filter]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') {
      return task.active === 0;
    } else if (filter === 'completed') {
      return task.active === 1;
    } else {
      return true;
    }
  });

  const handleFilterClick = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const fetchTasks = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/Task/GetAll`);
    const data = await res.json();
    // console.log(data)
    return data;
  };

  const fetchTask = async (taskId) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/Task/GetSingle?taskId=${taskId}`)
    const data = await res.json();
    return data;
  }

  const deleteTask = async (taskId) => {
    await fetch(`${process.env.REACT_APP_API_URL}/Task/${taskId}`, {
      method: 'DELETE'
    });

    const tasksFromServer = await fetchTasks();
    setTasks(tasksFromServer);
  };

  const clearCompleted = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/Task/ClearCompleted`,{
    method: 'DELETE'
  });
    const tasksFromServer = await fetchTasks();
    setTasks(tasksFromServer);
  }

  const addTask = async (newTask) => {
    await fetch(`${process.env.REACT_APP_API_URL}/Task`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    const tasksFromServer = await fetchTasks();
    setTasks(tasksFromServer);
  };

  const updateTask = async (updateTask) => {
    await fetch(`${process.env.REACT_APP_API_URL}/Task`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updateTask),
    });
    const tasksFromServer = await fetchTasks();
    setTasks(tasksFromServer);
  }
  
  const setCheckStatus = async (taskId) => {
    const taskToCheckStatus = await fetchTask(taskId);
    const status = taskToCheckStatus.active === 0 ? 1 : 0;

    const updTask = { ...taskToCheckStatus, active: status };
    updateTask(updTask)
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
    const newTaskObject = { task: newTask, active: 0 };
    addTask(newTaskObject);
    setNewTask(''); 
  };

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
    console.log(items)
  }

  function numberOfItemsLeft(tasks) {
    const inactiveTasks = tasks.filter(task => task.active === 0);
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
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                        <div className={`tasks-container ${index === 0 ? 'first-task' : ''}`} key={task.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div className='task-and-check-container'>
                              <div className={task.active === 0 ? "icon-check-inactive" : "icon-check-active"} onClick={() => setCheckStatus(task.id)}>
                                <img className="icon-check" src={iconCheck} alt="" />
                              </div>
                              <p className="task">{task.task}</p>
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
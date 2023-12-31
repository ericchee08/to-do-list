import './styles/Theme.css';
import './styles/MobileTheme.css';
import './styles/Mobile.css';
import { useState, useEffect } from "react";
import iconMoon from "./images/icon-moon.svg";
import iconSun from "./images/icon-sun.svg";
import TodoList from './Components/TodoList';
import { ThemeContext } from './Contexts/ThemeContext';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.style.backgroundColor = theme === "dark" ? "hsl(235, 21%, 11%)" : "hsl(236, 33%, 92%)";
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app" id={`app${theme}`}>
        <div className="container" >
          <div className="header">
              <div className='title'>TODO</div>
              <div className='theme-toggle' onClick={toggleTheme}><img className="illustration-signup-desktop" src={theme === "light" ? iconMoon : iconSun} alt="" /></div>
          </div>
          <TodoList></TodoList>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;

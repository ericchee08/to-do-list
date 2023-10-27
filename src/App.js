import './styles/Theme.css';
import './styles/MobileTheme.css';
import './styles/Mobile.css';
import { createContext, useState, useEffect } from "react";
import iconMoon from "./images/icon-moon.svg";
import iconSun from "./images/icon-sun.svg";
import TodoList from './components/TodoList';

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.style.backgroundColor = theme === "dark" ? "hsl(235, 21%, 11%)" : "hsl(0, 0%, 98%)";
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app" id={theme}>
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

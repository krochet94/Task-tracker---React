import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from "./components/Tasks";
import About from "./components/About";
import AddTask from "./components/AddTask";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const serverAdd = "http://localhost:5000/tasks";

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch(serverAdd);
      const data = await res.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  //Update reminder
  const updateReminder = async (id) => {
    const res = await fetch(serverAdd + `/${id}`);
    const data = await res.json();
    return data;
  };

  //Delete Task
  const deleteTask = async (id) => {
    await fetch(serverAdd + `/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((tasks) => tasks.id !== id));
  };

  //Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await updateReminder(id);
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const res = await fetch(serverAdd + `/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updTask),
    });
    const data = await res.json();
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  // Add Task
  const addTask = async (task) => {
    const res = await fetch(serverAdd, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();
    setTasks([...tasks, data]);

    /* const id = Math.floor(Math.random() * 100000) + 1;
    const newTask = { id, ...task };
    setTasks([...tasks, newTask]); */
  };

  return (
    <Router>
      <div className="container">
        <Header
          onClick={() => {
            setShowAddTask(!showAddTask);
          }}
          showAdd={showAddTask}
        />
        <Routes>
          <Route
            path="/"
            exact
            element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                  />
                ) : (
                  "No tasks yet, please add some."
                )}
              </>
            }
          />
        <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

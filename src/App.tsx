import { useState, useEffect } from "react";
import { v4 as uuidV4 } from "uuid";
import "./styles.css";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  edit: boolean;
  timestamp: number;
}

function App() {
  const [input, setInput] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // get savedTasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("taskStorage");
    return savedTasks ? setTasks(JSON.parse(savedTasks)) : setTasks([]);
  }, []);

  // save changes to tasks to localStorage
  useEffect(() => {
    localStorage.setItem("taskStorage", JSON.stringify(tasks));
  }, [tasks]);

  // checkbox marks task completed
  const handleCheck = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // controlled input for "Add new task"
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // if input is not empty create new task object and set to tasks and empty input
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (input) {
      const newTask = {
        id: uuidV4(),
        title: input,
        completed: false,
        edit: false,
        timestamp: Date.now()
      };
      setTasks([...tasks, newTask]);
      setInput("");
    }
  };

  // delete task with id that matches id, e.g. it's filtered out
  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  // edit button toggles the edit property
  const toggleEdit = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, edit: !task.edit } : task
    );
    setTasks(updatedTasks);
  };

  // saves the uncontrolled input to the object that matches the id and toggles edit
  const saveEdit = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const updated = (e.currentTarget.elements[0] as HTMLInputElement).value;
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, title: updated, edit: !task.edit } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="content">
      <h1>Lister</h1>
      <form>
        <label className="inputlabel" htmlFor="input">
          Add new task
        </label>
        <input
          className="taskInput"
          name="input"
          type="text"
          value={input}
          onChange={(e) => handleChange(e)}
        />
        <button className="btn add" onClick={handleSubmit}>
          Add
        </button>
      </form>
      <div>
        <h2>
          {new Date().toLocaleString("default", { weekday: "long" })}'s Tasks'
        </h2>
      </div>
      <div className="wrapper">
        {tasks.length === 0 && <h3>All Done:)</h3>}
        {tasks
          // the + before a/b-completed converts boolean to number
          ?.sort((a, b) => +a.timestamp - +b.timestamp)
          .sort((a, b) => +a.completed - +b.completed)
          .map((task) => (
            <div key={Math.random() * Date.now()}>
              <div className={task.completed ? "rowDone" : "row"} key={task.id}>
                <div className="title">{task.title + " "}</div>
                <div>
                  {task.completed ? (
                    <span className="done">COMPLETE</span>
                  ) : null}
                  {!task.completed && (
                    <>
                      <button
                        className="btn"
                        onClick={() => toggleEdit(task.id)}
                      >
                        EDIT
                      </button>
                      <button
                        className="btn delete"
                        onClick={() => deleteTask(task.id)}
                      >
                        DELETE
                      </button>
                    </>
                  )}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleCheck(task.id)}
                  />
                </div>
              </div>
              {task.edit ? (
                <div className="edit">
                  <form onSubmit={(e) => saveEdit(e, task.id)}>
                    <input
                      name="editTask"
                      type="text"
                      defaultValue={task.title}
                    />
                    <button className="btn" type="submit">
                      save
                    </button>
                    <button className="btn" onClick={() => toggleEdit(task.id)}>
                      cancel
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;

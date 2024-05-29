import { ChangeEvent, FC, useState, useRef, useEffect } from "react";
import { ITask } from "./Interfaces";
import { TodoTask } from "./components/TodoTask";
import "./App.css";

const getDate = (): string => {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; // months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  const pMonth = month.toString().padStart(2, "0");
  const pDay = day.toString().padStart(2, "0");
  const newPaddedDate = `${pMonth}-${pDay}-${year}`;
  return newPaddedDate;
};

const App: FC = () => {
  const [task, setTask] = useState<string>("");
  const [deadline, setDeadline] = useState<number>(0);
  const [todoList, setTodoList] = useState<ITask[]>(
    JSON.parse(localStorage.getItem("todoList") || "{}")
  );
  const [todaysFullDate, setTodaysFullDate] = useState<string>(getDate());
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  useEffect(() => {
    setTodaysFullDate(getDate());
    updateDeadlines();
  }, []);

  const calculateTotalDaysDifference = (
    taskDate: string,
    todaysDate: string
  ): number => {
    const taskDateDate = new Date(taskDate);
    const todaysDateDate = new Date(todaysDate);
    const taskDateTimeStamp = taskDateDate.getTime();
    const todaysDateTimeStamp = todaysDateDate.getTime();

    const calc = new Date(todaysDateTimeStamp - taskDateTimeStamp);

    const calcFormatTemp =
      calc.getDate() + "-" + (calc.getMonth() + 1) + "-" + calc.getFullYear();
    const calcFormat = calcFormatTemp.split("-");

    const day: number = Number(calcFormat[0]);
    const month: number = Number(calcFormat[1]);
    const year: number = Number(calcFormat[2]);

    const daysPassed = Number(Math.abs(day) - 1);
    const monthsPassed = Number(Math.abs(month) - 1);
    const yearsPassed = Number(Math.abs(year) - 1970);

    const totalDays = yearsPassed * 365 + monthsPassed * 30.417 + daysPassed;
    return Math.round(totalDays);
  };

  const updateDeadlines = (): void => {
    todoList.forEach((todo) => {
      const daysSinceTaskAdded = calculateTotalDaysDifference(
        todo.dateAdded,
        todaysFullDate
      );

      const newDeadline = todo.originalDeadline - daysSinceTaskAdded;
      todo.deadline = newDeadline;
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.name === "task") {
      setTask(event.target.value);
    } else {
      setDeadline(Number(event.target.value));
    }
  };

  const addTask = (): void => {
    const dateTaskAdded = getDate();
    const newTask = {
      taskName: task,
      deadline: deadline,
      originalDeadline: deadline,
      dateAdded: dateTaskAdded,
    };
    setTodoList([...todoList, newTask]);
    setTask("");
    setDeadline(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const completeTask = (taskNameToDelete: string): void => {
    setTodoList(
      todoList.filter((task) => {
        return task.taskName != taskNameToDelete;
      })
    );
  };

  return (
    <div className="App">
      <div className="header">
        <div className="input-container">
          <input
            className="text-input inputs"
            ref={inputRef}
            type="text"
            name="task"
            value={task}
            placeholder="Task... "
            onChange={handleChange}
          />
          <input
            className="days-input inputs"
            type="number"
            name="deadline"
            value={deadline}
            placeholder="Deadline (in days)..."
            onChange={handleChange}
          />
        </div>
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="todo-list">
        <div className="todo-list-headers">
          <h2 className="todo-header">Task</h2>
          <h2 className="todo-header">Days to Complete</h2>
          <h2 className="todo-header right-side-grid">Delete</h2>
        </div>
        {todoList.map((task: ITask, key: number) => {
          return <TodoTask key={key} task={task} completeTask={completeTask} />;
        })}
      </div>
    </div>
  );
};

export default App;

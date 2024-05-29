import { ITask } from "../Interfaces";

interface Props {
  task: ITask;
  completeTask(taskNameToDelete: string): void;
}

export const TodoTask = ({ task, completeTask }: Props) => {
  return (
    <div className="task" id="task">
      <span className="task-span">{task.taskName}</span>
      <span className="task-span">{task.deadline}</span>
      <button
        className="delete"
        onClick={() => {
          completeTask(task.taskName);
        }}
      >
        X
      </button>
    </div>
  );
};

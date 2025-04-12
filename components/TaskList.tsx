"use client"

interface Task {
  id: number;
  text: string;
  subject: 'Physics' | 'Chemistry' | 'Maths' | '' | 'Unassigned';
  completed: boolean;
}

interface TaskListProps {
  displayedTasks: Task[];
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ displayedTasks, toggleTask, deleteTask }) => {
  return (
    <div>
      <h2 className="text-xl mb-4">
        Tasks {displayedTasks.length > 0 && displayedTasks[0].subject ? `(${displayedTasks[0].subject})` : '(All)'}
      </h2>
      <div className="max-h-60 overflow-y-auto space-y-2">
        {displayedTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No tasks yet</p>
        ) : (
          displayedTasks.map(task => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="h-5 w-5 flex-shrink-0"
                />
                <span className={`truncate ${task.completed ? 'line-through text-gray-400' : ''}`}>
                  {task.text}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs px-2 py-1 bg-gray-600 rounded-full">
                  {task.subject}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-400 ml-1"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;

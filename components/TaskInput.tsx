"use client"

interface TaskInputProps {
  newTask: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  addTask: () => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ newTask, handleInputChange, handleKeyPress, addTask }) => {
  return (
    <div className="flex mb-4">
      <input
        type="text"
        className="flex-1 px-4 py-2 bg-gray-700 rounded-l-lg focus:outline-none"
        placeholder="Add a task"
        value={newTask}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <button
        className="bg-blue-600 text-white px-4 rounded-r-lg"
        onClick={addTask}
      >
        +
      </button>
    </div>
  );
};

export default TaskInput;

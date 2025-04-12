"use client"
import { useState, useEffect, KeyboardEvent, ChangeEvent } from 'react';

// Define types
type SubjectType = 'Physics' | 'Chemistry' | 'Maths' | '';
type TimerType = 'pomodoro' | 'ultradian';

interface Task {
  id: number;
  text: string;
  subject: SubjectType | 'Unassigned';
  completed: boolean;
}

export default function PomodoroApp() {
  // Timer states
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // Default 25 min
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timerType, setTimerType] = useState<TimerType>('pomodoro'); // 'pomodoro' or 'ultradian'
  const [currentSubject, setCurrentSubject] = useState<SubjectType>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toggle timer
  const toggleTimer = (): void => {
    if (!currentSubject && !isActive) {
      alert('Please select a subject first');
      return;
    }
    setIsActive(!isActive);
  };

  // Reset timer
  const resetTimer = (): void => {
    setIsActive(false);
    setTimeLeft(timerType === 'pomodoro' ? 25 * 60 : 90 * 60);
  };

  // Change timer type
  const changeTimerType = (type: TimerType): void => {
    setTimerType(type);
    setIsActive(false);
    setTimeLeft(type === 'pomodoro' ? 25 * 60 : 90 * 60);
  };

  // Toggle subject selection
  const toggleSubject = (subject: SubjectType): void => {
    if (currentSubject === subject) {
      setCurrentSubject('');
    } else {
      setCurrentSubject(subject);
    }
  };

  // Add new task
  const addTask = (): void => {
    if (newTask.trim() === '') return;

    const task: Task = {
      id: Date.now(),
      text: newTask,
      subject: currentSubject || 'Unassigned',
      completed: false
    };

    setTasks([...tasks, task]);
    setNewTask('');
  };

  // Toggle task completion
  const toggleTask = (id: number): void => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Delete task
  const deleteTask = (id: number): void => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewTask(e.target.value);
  };

  // Handle key press for task input
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Filter tasks based on current subject
  useEffect(() => {
    if (!currentSubject) {
      // Show all tasks when no subject is selected
      setDisplayedTasks(tasks);
    } else {
      // Show only tasks for the selected subject
      setDisplayedTasks(tasks.filter(task => task.subject === currentSubject));
    }
  }, [tasks, currentSubject]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      alert('Time is up!');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const subjects: SubjectType[] = ['Physics', 'Chemistry', 'Maths'];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-md p-6 rounded-xl bg-gray-800 shadow-lg">
        {/* Subject Selection */}
        <div className="mb-6">
          <h2 className="text-xl text-center mb-4">Subject</h2>
          <div className="flex justify-between gap-2">
            {subjects.map(subject => (
              <button
                key={subject}
                className={`flex-1 py-2 rounded-lg ${currentSubject === subject
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                onClick={() => toggleSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Timer Type Selection */}
        <div className="mb-6">
          <div className="flex justify-between gap-2 mb-4">
            <button
              className={`flex-1 py-2 rounded-lg ${timerType === 'pomodoro'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600'
                }`}
              onClick={() => changeTimerType('pomodoro')}
            >
              Pomodoro (25m)
            </button>
            <button
              className={`flex-1 py-2 rounded-lg ${timerType === 'ultradian'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600'
                }`}
              onClick={() => changeTimerType('ultradian')}
            >
              Ultradian (90m)
            </button>
          </div>
        </div>

        {/* Timer Display */}
        <div className="mb-6">
          <div className="rounded-full border-4 border-gray-700 h-48 w-48 flex items-center justify-center mx-auto">
            <h1 className="text-5xl font-bold">{formatTime(timeLeft)}</h1>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-between gap-4 mb-8">
          <button
            className={`flex-1 py-3 rounded-lg ${isActive ? 'bg-red-600' : 'bg-blue-600'
              } text-white font-semibold text-lg`}
            onClick={toggleTimer}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            className="flex-1 py-3 rounded-lg bg-gray-700 text-white font-semibold text-lg"
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>

        {/* Tasks Section */}
        <div>
          <h2 className="text-xl mb-4">
            Tasks {currentSubject ? `(${currentSubject})` : '(All)'}
          </h2>

          {/* Add Task Form */}
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

          {/* Task List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {displayedTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tasks yet</p>
            ) : (
              displayedTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="h-5 w-5"
                    />
                    <span className={task.completed ? 'line-through text-gray-400' : ''}>
                      {task.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-600 rounded-full">
                      {task.subject}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

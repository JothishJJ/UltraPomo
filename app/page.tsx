"use client"
import { useState, useEffect, KeyboardEvent, ChangeEvent, useCallback } from 'react';
import Timer from "@/components/Timer"
import TaskList from '@/components/TaskList';
import TaskInput from '@/components/TaskInput';
import Settings from '@/components/Settings';

// Define types
type SubjectType = 'Physics' | 'Chemistry' | 'Maths' | '';
type TimerType = 'pomodoro' | 'ultradian' | 'custom';

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);

  const [timerType, setTimerType] = useState<TimerType>(() => {
        if (typeof window !== "undefined") {
      return (localStorage.getItem('timerType') as TimerType) || 'pomodoro';
    }
    return 'pomodoro';
  });

  const [customMinutes, setCustomMinutes] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem('customMinutes');
      return stored ? parseInt(stored, 10) : 30;
    }
    return 30;
  });

  const [currentSubject, setCurrentSubject] = useState<SubjectType>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem('currentSubject') as SubjectType) || '';
    }
    return '';
  });

  // UI state
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const enterFullscreen = useCallback(() => {
    const docElement = document.documentElement;
    if (docElement.requestFullscreen) {
      docElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error(err));
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error(err));
    }
  }, []);

  const toggleTimer = (): void => {
    if (!isActive) {
      enterFullscreen();
      setIsActive(true);
    } else {
      exitFullscreen();
      setIsActive(false);
    }
  };

  const resetTimer = (): void => {
    setIsActive(false);
    exitFullscreen();
    if (timerType === 'pomodoro') {
      setTimeLeft(25 * 60);
    } else if (timerType === 'ultradian') {
      setTimeLeft(90 * 60);
    } else {
      setTimeLeft(customMinutes * 60);
    }
  };

  const changeTimerType = (type: TimerType): void => {
    setTimerType(type);
    setIsActive(false);
    if (type === 'pomodoro') {
      setTimeLeft(25 * 60);
    } else if (type === 'ultradian') {
      setTimeLeft(90 * 60);
    } else {
      setTimeLeft(customMinutes * 60);
    }

    useEffect(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem('timerType', type);
      }
    }, [type])
  };

  const toggleSubject = (subject: SubjectType): void => {
    if (currentSubject === subject) {
      setCurrentSubject('');
    } else {
      setCurrentSubject(subject);
    }
  };

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

  const toggleTask = (id: number): void => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewTask(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsActive(false);
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown as any);
    return () => document.removeEventListener('keydown', handleKeyDown as any);
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
        setIsActive(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullscreen]);

  useEffect(() => {
    if (!currentSubject) {
      setDisplayedTasks(tasks);
    } else {
      setDisplayedTasks(tasks.filter(task => task.subject === currentSubject));
    }
  }, [tasks, currentSubject]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      exitFullscreen();
      alert('Time is up!');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, exitFullscreen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('timerType', timerType);
    }
  }, [timerType]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('customMinutes', customMinutes.toString());
    }
  }, [customMinutes]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('currentSubject', currentSubject);
    }
  }, [currentSubject]);

  const subjects: SubjectType[] = ['Physics', 'Chemistry', 'Maths'];

  if (isFullscreen && isActive) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 sm:p-6">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl sm:text-2xl mb-4 text-center">
            {currentSubject || 'Unassigned'} - {timerType === 'pomodoro' ? 'Pomodoro' : timerType === 'ultradian' ? 'Ultradian Sprint' : 'Custom'}
          </h2>
          <div className="rounded-full border-8 border-gray-700 h-64 w-64 sm:h-80 sm:w-80 flex items-center justify-center mb-6 sm:mb-8">
            <h1 className="text-6xl sm:text-8xl font-bold">{formatTime(timeLeft)}</h1>
          </div>

          <button
            className="bg-red-600 text-white text-lg sm:text-xl font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-lg mb-8 sm:mb-10"
            onClick={toggleTimer}
          >
            Pause
          </button>
        </div>

        <div className="w-full max-w-md sm:max-w-2xl mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl mb-4 text-center sm:text-left">
            Tasks {currentSubject ? `(${currentSubject})` : '(All)'}
          </h2>

          <div className="max-h-48 sm:max-h-64 overflow-y-auto space-y-3">
            {displayedTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tasks yet</p>
            ) : (
              displayedTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="h-5 w-5 sm:h-6 sm:w-6"
                    />
                    <span className={task.completed ? 'line-through text-gray-400 text-lg sm:text-xl' : 'text-lg sm:text-xl'}>
                      {task.text}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-gray-700 rounded-full">
                    {task.subject}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-4 sm:mt-6 text-gray-400">
            Press ESC or Pause to exit fullscreen mode
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6">
      <div className="w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-xl bg-gray-800 shadow-lg">
        <Settings
          showSettings={showSettings}
          subjects={subjects}
          currentSubject={currentSubject}
          timerType={timerType}
          customMinutes={customMinutes}
          setShowSettings={setShowSettings}
          toggleSubject={toggleSubject}
          changeTimerType={changeTimerType}
          setCustomMinutes={setCustomMinutes}
          setTimeLeft={setTimeLeft}
        />

        <Timer
          timeLeft={timeLeft}
          isActive={isActive}
          formatTime={formatTime}
          toggleTimer={toggleTimer}
          resetTimer={resetTimer}
        />

        <TaskInput
          newTask={newTask}
          handleInputChange={handleInputChange}
          handleKeyPress={handleKeyPress}
          addTask={addTask}
        />

        <TaskList
          displayedTasks={displayedTasks}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />
      </div>
    </div>
  );
}

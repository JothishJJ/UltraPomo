"use client"

interface TimerProps {
  timeLeft: number;
  isActive: boolean;
  formatTime: (seconds: number) => string;
  toggleTimer: () => void;
  resetTimer: () => void;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, isActive, formatTime, toggleTimer, resetTimer }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <div className="rounded-full border-4 border-gray-700 h-56 w-56 flex items-center justify-center mb-4">
        <h1 className="text-6xl font-bold">{formatTime(timeLeft)}</h1>
      </div>
      <div className="flex w-full gap-4">
        <button
          className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg"
          onClick={toggleTimer}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          className="w-20 py-3 rounded-lg bg-gray-700 text-white font-semibold text-lg"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;

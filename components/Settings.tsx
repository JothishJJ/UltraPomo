"use client"

import { useEffect, useState } from "react";

type SubjectType = 'Physics' | 'Chemistry' | 'Maths' | '';
type TimerType = 'pomodoro' | 'ultradian' | 'custom';

interface SettingsProps {
  showSettings: boolean;
  subjects: SubjectType[];
  currentSubject: SubjectType;
  timerType: TimerType;
  customMinutes: number;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSubject: (subject: SubjectType) => void;
  changeTimerType: (type: TimerType) => void;
  setCustomMinutes: React.Dispatch<React.SetStateAction<number>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

const Settings: React.FC<SettingsProps> = ({
  showSettings,
  subjects,
  currentSubject,
  timerType,
  customMinutes,
  setShowSettings,
  toggleSubject,
  changeTimerType,
  setCustomMinutes,
  setTimeLeft,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures this component only renders on the client
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on the server
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {currentSubject || 'Select Subject'}
        </h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-400 hover:text-white"
        >
          ⚙️ {showSettings ? 'Hide Settings' : 'Settings'}
        </button>
      </div>

      {showSettings && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <div className="mb-4">
            <h3 className="text-sm text-gray-400 mb-2">Subject</h3>
            <div className="flex justify-between gap-2">
              {subjects.map(subject => (
                <button
                  key={subject}
                  className={`flex-1 py-2 rounded-lg text-sm ${currentSubject === subject
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  onClick={() => toggleSubject(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-400 mb-2">Timer Type</h3>
            <div className="flex justify-between gap-2">
              <button
                className={`flex-1 py-2 rounded-lg text-sm ${timerType === 'pomodoro'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                onClick={() => changeTimerType('pomodoro')}
              >
                Pomodoro (25m)
              </button>
              <button
                className={`flex-1 py-2 rounded-lg text-sm ${timerType === 'ultradian'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                onClick={() => changeTimerType('ultradian')}
              >
                Ultradian (90m)
              </button>
              <button
                className={`flex-1 py-2 rounded-lg text-sm ${timerType === 'custom'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                onClick={() => changeTimerType('custom')}
              >
                Custom
              </button>
            </div>

            {timerType === 'custom' && (
              <div className="mt-4">
                <label className="block text-sm text-gray-300 mb-1">Custom Time (minutes)</label>
                <input
                  type="number"
                  min={1}
                  className="w-full p-2 rounded bg-gray-600 text-white"
                  value={customMinutes}
                  onChange={(e) => {
                    const minutes = Math.max(1, parseInt(e.target.value) || 1);
                    setCustomMinutes(minutes);
                    setTimeLeft(minutes * 60);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;

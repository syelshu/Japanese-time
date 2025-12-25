
import React from 'react';

interface ClockProps {
  hour: number;
  minute: number;
}

const Clock: React.FC<ClockProps> = ({ hour, minute }) => {
  // Calculate rotations
  const minuteRotation = minute * 6; // 360 / 60
  const hourRotation = (hour % 12) * 30 + minute * 0.5; // 360 / 12 + 30 / 60 per minute

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
        {/* Outer Ring */}
        <circle cx="100" cy="100" r="95" fill="white" stroke="#3b82f6" strokeWidth="6" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="#e0f2fe" strokeWidth="2" />

        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i + 1) * 30;
          const x1 = 100 + 75 * Math.sin((angle * Math.PI) / 180);
          const y1 = 100 - 75 * Math.cos((angle * Math.PI) / 180);
          return (
            <text
              key={i}
              x={x1}
              y={y1}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-lg font-bold fill-slate-700 select-none"
              style={{ fontSize: '14px' }}
            >
              {i + 1}
            </text>
          );
        })}

        {/* Minute ticks */}
        {[...Array(60)].map((_, i) => {
          if (i % 5 === 0) return null;
          const angle = i * 6;
          const x1 = 100 + 88 * Math.sin((angle * Math.PI) / 180);
          const y1 = 100 - 88 * Math.cos((angle * Math.PI) / 180);
          const x2 = 100 + 92 * Math.sin((angle * Math.PI) / 180);
          const y2 = 100 - 92 * Math.cos((angle * Math.PI) / 180);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#94a3b8"
              strokeWidth="1"
            />
          );
        })}

        {/* Hour Hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="55"
          stroke="#1e293b"
          strokeWidth="6"
          strokeLinecap="round"
          transform={`rotate(${hourRotation}, 100, 100)`}
          className="transition-transform duration-500 ease-out"
        />

        {/* Minute Hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="35"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${minuteRotation}, 100, 100)`}
          className="transition-transform duration-500 ease-out"
        />

        {/* Center Pin */}
        <circle cx="100" cy="100" r="4" fill="#1e293b" />
        <circle cx="100" cy="100" r="2" fill="#3b82f6" />
      </svg>
    </div>
  );
};

export default Clock;

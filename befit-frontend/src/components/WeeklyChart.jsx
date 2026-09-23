import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'rgba(18, 18, 28, 0.95)',
          border: '1px solid var(--border-glass)',
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '4px' }}>
          {label}
        </p>
        <p style={{ color: 'var(--accent-lime)', fontWeight: 600, fontSize: '0.9rem' }}>
          {payload[0].value} kcal burned
        </p>
        {payload[1] && (
          <p style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.85rem' }}>
            {payload[1].value} minutes active
          </p>
        )}
      </div>
    );
  }
  return null;
};

const WeeklyChart = ({ activities = [] }) => {
  // Generate the last 7 days array
  const getLast7DaysData = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayKey = d.toISOString().split('T')[0];
      const dayLabel = i === 0 ? 'Today' : dayNames[d.getDay()];

      // Aggregate activities on this day
      let calories = 0;
      let duration = 0;

      activities.forEach((act) => {
        if (act.startTime && act.startTime.startsWith(dayKey)) {
          calories += Number(act.caloriesBurned) || 0;
          duration += Number(act.duration) || 0;
        }
      });

      days.push({
        day: dayLabel,
        calories,
        duration,
      });
    }

    return days;
  };

  const data = getLast7DaysData();

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="calorieGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ADFF2F" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#ADFF2F" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="var(--text-muted)"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="calories"
            stroke="#ADFF2F"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#calorieGradient)"
          />
          <Area
            type="monotone"
            dataKey="duration"
            stroke="#00E5FF"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#durationGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;

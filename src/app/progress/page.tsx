"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const sample = [
  { d: 'Mon', mood: 6, stress: 5 },
  { d: 'Tue', mood: 5, stress: 6 },
  { d: 'Wed', mood: 7, stress: 4 },
  { d: 'Thu', mood: 6, stress: 5 },
  { d: 'Fri', mood: 8, stress: 3 },
  { d: 'Sat', mood: 7, stress: 4 },
  { d: 'Sun', mood: 6, stress: 5 },
];

export default function ProgressPage() {
  const primary = getComputedStyle(typeof window !== 'undefined' ? document.documentElement : ({} as HTMLElement)).getPropertyValue('--primary') || '#4A6C6F';
  const accent = getComputedStyle(typeof window !== 'undefined' ? document.documentElement : ({} as HTMLElement)).getPropertyValue('--accent') || '#98473E';

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold mb-2">Progress</h1>
      <p className="text-muted-foreground mb-6">Track mood and stress trends over time.</p>

      <div className="bg-card border rounded-lg p-4">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sample} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="d" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke={primary.trim()} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="stress" stroke={accent.trim()} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

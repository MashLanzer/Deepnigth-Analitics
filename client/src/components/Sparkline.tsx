import React from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface Point { x: string; y: number }

interface Props {
  data: Point[] | Array<{ x: string; y: number }>;
  color?: string;
  height?: number;
}

export default function Sparkline({ data, color = 'hsl(var(--primary))', height = 36 }: Props) {
  if (!data || (Array.isArray(data) && data.length === 0)) return <div style={{ height }} />;

  return (
    <div style={{ width: '100%', height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data as any} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Line type="monotone" dataKey="y" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

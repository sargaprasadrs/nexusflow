import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export interface LiveChartPoint {
  ts: string;
  value: number;
}

// Live telemetry chart (Week 3) - Recharts line chart fed by the WebSocket stream.
export default function LiveChart({ data, field }: { data: LiveChartPoint[]; field: string }) {
  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <XAxis dataKey="ts" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" name={field} stroke="#4f8cff" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

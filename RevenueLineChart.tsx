import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ComposedChart,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

interface Props {
  data: Array<{
    dateLabel: string;
    revenue: number;
    users: number;
    sessions: number;
  }>;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 p-3 min-w-[180px]">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-gray-600 dark:text-gray-300">{entry.name}</span>
          </div>
          <span className="text-xs font-bold text-gray-900 dark:text-white">
            {entry.name === 'Revenue' ? `$${(entry.value / 1000).toFixed(1)}K` : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RevenueLineChart({ data }: Props) {
  const { dark } = useTheme();
  const gridColor = dark ? '#374151' : '#f3f4f6';
  const textColor = dark ? '#9ca3af' : '#6b7280';

  // Show every Nth label to avoid crowding
  const step = Math.max(1, Math.floor(data.length / 8));

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl ring-1 ring-gray-200/80 dark:ring-gray-700/50 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Revenue & Traffic Trends</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Daily performance over selected period</p>
        </div>
      </div>
      <div className="h-[300px] lg:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={false}
              interval={step - 1}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingBottom: '8px' }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              fill="url(#revenueGrad)"
              strokeWidth={2.5}
              name="Revenue"
              animationDuration={1200}
              animationEasing="ease-in-out"
              dot={false}
              activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="sessions"
              stroke="#06b6d4"
              strokeWidth={2}
              name="Sessions"
              dot={false}
              animationDuration={1400}
              animationEasing="ease-in-out"
              activeDot={{ r: 4, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="users"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="6 3"
              name="Users"
              dot={false}
              animationDuration={1600}
              animationEasing="ease-in-out"
              activeDot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

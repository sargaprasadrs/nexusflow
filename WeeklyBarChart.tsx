import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

interface Props {
  data: Array<{
    week: string;
    revenue: number;
    users: number;
    sessions: number;
  }>;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 p-3 min-w-[170px]">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Week of {label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
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

export default function WeeklyBarChart({ data }: Props) {
  const { dark } = useTheme();
  const gridColor = dark ? '#374151' : '#f3f4f6';
  const textColor = dark ? '#9ca3af' : '#6b7280';

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl ring-1 ring-gray-200/80 dark:ring-gray-700/50 p-4 lg:p-6">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Weekly Performance</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Revenue & users by week</p>
      </div>
      <div className="h-[300px] lg:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="rect"
              iconSize={10}
              wrapperStyle={{ fontSize: '12px', paddingBottom: '8px' }}
            />
            <Bar
              dataKey="revenue"
              fill="#6366f1"
              name="Revenue"
              radius={[6, 6, 0, 0]}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="sessions"
              fill="#06b6d4"
              name="Sessions"
              radius={[6, 6, 0, 0]}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

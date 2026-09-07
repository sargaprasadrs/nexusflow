import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

interface Props {
  data: Array<{
    dateLabel: string;
    conversion: number;
    bounceRate: number;
  }>;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 p-3 min-w-[160px]">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-gray-600 dark:text-gray-300">{entry.name}</span>
          </div>
          <span className="text-xs font-bold text-gray-900 dark:text-white">{entry.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

export default function ConversionChart({ data }: Props) {
  const { dark } = useTheme();
  const gridColor = dark ? '#374151' : '#f3f4f6';
  const textColor = dark ? '#9ca3af' : '#6b7280';
  const step = Math.max(1, Math.floor(data.length / 8));

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl ring-1 ring-gray-200/80 dark:ring-gray-700/50 p-4 lg:p-6">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Conversion & Bounce Rate</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Daily rates over time</p>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="bounceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
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
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="conversion"
              stroke="#8b5cf6"
              fill="url(#convGrad)"
              strokeWidth={2}
              name="Conversion"
              animationDuration={1000}
              dot={false}
              activeDot={{ r: 4, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="bounceRate"
              stroke="#f43f5e"
              fill="url(#bounceGrad)"
              strokeWidth={2}
              name="Bounce Rate"
              animationDuration={1200}
              dot={false}
              activeDot={{ r: 4, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

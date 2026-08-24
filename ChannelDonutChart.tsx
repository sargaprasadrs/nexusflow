import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useState } from 'react';

interface ChannelData {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: ChannelData[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.payload.color }} />
        <span className="text-xs font-semibold text-gray-900 dark:text-white">{d.name}</span>
      </div>
      <p className="text-sm font-bold text-gray-900 dark:text-white">{d.value.toLocaleString()} sessions</p>
    </div>
  );
}

export default function ChannelDonutChart({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl ring-1 ring-gray-200/80 dark:ring-gray-700/50 p-4 lg:p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Traffic Sources</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Distribution by channel</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative h-[220px] w-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                animationDuration={1200}
                animationEasing="ease-out"
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === i ? 1 : 0.4}
                    style={{ transition: 'opacity 200ms ease, transform 200ms ease' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {(total / 1000).toFixed(1)}K
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              Total
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full max-w-[280px]">
          {data.map((item, i) => (
            <div
              key={item.name}
              className={`flex items-center gap-2 py-1 px-1 rounded transition-opacity duration-200 ${
                activeIndex !== null && activeIndex !== i ? 'opacity-40' : ''
              }`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] text-gray-600 dark:text-gray-400 truncate">{item.name}</span>
              <span className="text-[11px] font-semibold text-gray-900 dark:text-white ml-auto">
                {((item.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

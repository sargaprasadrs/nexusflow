import { TrendingUp, TrendingDown, DollarSign, Users, Target, Activity, ArrowDownRight, Eye } from 'lucide-react';

interface KPI {
  title: string;
  value: number;
  format: string;
  change: number;
  icon: string;
  color: string;
  invertTrend?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'dollar-sign': DollarSign,
  users: Users,
  target: Target,
  activity: Activity,
  'arrow-down-right': ArrowDownRight,
  eye: Eye,
};

const colorMap: Record<string, { bg: string; icon: string; ring: string }> = {
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-200 dark:ring-emerald-700/50',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
    ring: 'ring-blue-200 dark:ring-blue-700/50',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    icon: 'text-violet-600 dark:text-violet-400',
    ring: 'ring-violet-200 dark:ring-violet-700/50',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    icon: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-200 dark:ring-amber-700/50',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    icon: 'text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-200 dark:ring-rose-700/50',
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    icon: 'text-cyan-600 dark:text-cyan-400',
    ring: 'ring-cyan-200 dark:ring-cyan-700/50',
  },
};

function formatValue(value: number, fmt: string): string {
  if (fmt === 'currency') {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  }
  if (fmt === 'percent') return `${value.toFixed(1)}%`;
  if (fmt === 'number') {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  }
  return String(value);
}

export default function KPICards({ kpis }: { kpis: KPI[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
      {kpis.map((kpi) => {
        const Icon = iconMap[kpi.icon] || Activity;
        const colors = colorMap[kpi.color] || colorMap.blue;
        const isPositive = kpi.invertTrend ? kpi.change < 0 : kpi.change > 0;

        return (
          <div
            key={kpi.title}
            className="group relative bg-white dark:bg-gray-800/50 rounded-2xl p-4 lg:p-5 ring-1 ring-gray-200/80 dark:ring-gray-700/50 hover:ring-gray-300 dark:hover:ring-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${colors.bg} ring-1 ${colors.ring} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <Icon className={`w-4 h-4 ${colors.icon}`} />
              </div>
              <div
                className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  isPositive
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(kpi.change).toFixed(1)}%
              </div>
            </div>
            <p className="text-[22px] lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {formatValue(kpi.value, kpi.format)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
              {kpi.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}

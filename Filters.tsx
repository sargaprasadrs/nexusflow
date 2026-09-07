import { Calendar, ChevronDown, Filter } from 'lucide-react';
import { subDays, format } from 'date-fns';
import { type Segment, type DateRange, datePresets } from '../data/sampleData';

interface FiltersProps {
  dateRange: DateRange;
  segment: Segment;
  onDateRangeChange: (range: DateRange) => void;
  onSegmentChange: (segment: Segment) => void;
}

const segments: { value: Segment; label: string }[] = [
  { value: 'all', label: 'All Segments' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'smb', label: 'SMB' },
  { value: 'startup', label: 'Startup' },
];

export default function Filters({ dateRange, segment, onDateRangeChange, onSegmentChange }: FiltersProps) {
  const activeDays = Math.round((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Filter className="w-4 h-4" />
        <span className="font-medium hidden sm:inline">Filters</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {datePresets.map((preset) => (
          <button
            key={preset.days}
            onClick={() =>
              onDateRangeChange({
                start: subDays(new Date(), preset.days),
                end: new Date(),
              })
            }
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              activeDays === preset.days
                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-300 dark:ring-indigo-600'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700" />

      <div className="relative">
        <select
          value={segment}
          onChange={(e) => onSegmentChange(e.target.value as Segment)}
          className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0 ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
        >
          {segments.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 ml-auto">
        <Calendar className="w-3.5 h-3.5" />
        <span>
          {format(dateRange.start, 'MMM dd')} – {format(dateRange.end, 'MMM dd, yyyy')}
        </span>
      </div>
    </div>
  );
}

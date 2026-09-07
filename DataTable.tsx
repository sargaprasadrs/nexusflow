import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TableRow } from '../data/sampleData';

interface Props {
  data: TableRow[];
}

type SortKey = keyof TableRow;
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 8;

export default function DataTable({ data }: Props) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('visitors');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.page.toLowerCase().includes(q));
    }
    result = [...result].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return result;
  }, [data, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(0);
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-indigo-500" />
    ) : (
      <ArrowDown className="w-3 h-3 text-indigo-500" />
    );
  };

  const trendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-rose-500" />;
    return <Minus className="w-3.5 h-3.5 text-gray-400" />;
  };

  const columns: { key: SortKey; label: string; align?: string; hideOnMobile?: boolean }[] = [
    { key: 'page', label: 'Page' },
    { key: 'visitors', label: 'Visitors' },
    { key: 'pageViews', label: 'Views', hideOnMobile: true },
    { key: 'bounceRate', label: 'Bounce', hideOnMobile: true },
    { key: 'avgDuration', label: 'Duration', hideOnMobile: true },
    { key: 'conversion', label: 'CVR' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'trend', label: 'Trend' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl ring-1 ring-gray-200/80 dark:ring-gray-700/50 overflow-hidden">
      <div className="p-4 lg:p-6 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Page Performance</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {filtered.length} pages · Sorted by {String(sortKey)}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/50 ring-1 ring-gray-200 dark:ring-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-900/30">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-3 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors select-none ${
                    col.hideOnMobile ? 'hidden lg:table-cell' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
            {paged.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900 dark:text-white text-xs">{row.page}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300">
                  {row.visitors.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                  {row.pageViews.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                  <span className={row.bounceRate > 50 ? 'text-rose-500' : row.bounceRate < 35 ? 'text-emerald-500' : ''}>
                    {row.bounceRate}%
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                  {row.avgDuration}
                </td>
                <td className="px-4 py-3 text-xs">
                  <span className={`font-semibold ${row.conversion > 5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {row.conversion}%
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-medium text-gray-900 dark:text-white">
                  ${row.revenue.toLocaleString()}
                </td>
                <td className="px-4 py-3">{trendIcon(row.trend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-t border-gray-100 dark:border-gray-700/50">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-7 text-xs rounded-lg font-medium transition-all ${
                  page === i
                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

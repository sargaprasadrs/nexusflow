import { useState, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Filters from './components/Filters';
import KPICards from './components/KPICards';
import RevenueLineChart from './components/RevenueLineChart';
import WeeklyBarChart from './components/WeeklyBarChart';
import ChannelDonutChart from './components/ChannelDonutChart';
import ConversionChart from './components/ConversionChart';
import DataTable from './components/DataTable';
import {
  type Segment,
  type DateRange,
  getDefaultDateRange,
  generateKPIs,
  generateDailyData,
  generateBarData,
  generateChannelData,
  generateTableData,
} from './data/sampleData';

function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange);
  const [segment, setSegment] = useState<Segment>('all');

  const kpis = useMemo(() => generateKPIs(dateRange, segment), [dateRange, segment]);
  const dailyData = useMemo(() => generateDailyData(dateRange, segment), [dateRange, segment]);
  const barData = useMemo(() => generateBarData(dateRange, segment), [dateRange, segment]);
  const channelData = useMemo(() => generateChannelData(segment), [segment]);
  const tableData = useMemo(() => generateTableData(segment), [segment]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Filters */}
        <Filters
          dateRange={dateRange}
          segment={segment}
          onDateRangeChange={setDateRange}
          onSegmentChange={setSegment}
        />

        {/* KPI Cards */}
        <KPICards kpis={kpis} />

        {/* Revenue Line Chart - Full Width */}
        <RevenueLineChart data={dailyData} />

        {/* Bar Chart + Donut Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2">
            <WeeklyBarChart data={barData} />
          </div>
          <ChannelDonutChart data={channelData} />
        </div>

        {/* Conversion Chart */}
        <ConversionChart data={dailyData} />

        {/* Data Table */}
        <DataTable data={tableData} />

        {/* Footer */}
        <footer className="text-center py-6 text-xs text-gray-400 dark:text-gray-600">
          <p>NexusFlow Analytics Dashboard · Built with React & Recharts</p>
          <p className="mt-1">Data refreshes in real-time based on selected filters</p>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

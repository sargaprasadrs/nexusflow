import { format, subDays, eachDayOfInterval } from 'date-fns';

export type Segment = 'all' | 'enterprise' | 'smb' | 'startup';
export type DateRange = { start: Date; end: Date };

const segmentMultipliers: Record<string, { revenue: number; users: number; sessions: number; conversion: number }> = {
  all: { revenue: 1, users: 1, sessions: 1, conversion: 1 },
  enterprise: { revenue: 1.8, users: 0.3, sessions: 0.4, conversion: 1.4 },
  smb: { revenue: 0.6, users: 0.45, sessions: 0.35, conversion: 1.1 },
  startup: { revenue: 0.25, users: 0.35, sessions: 0.3, conversion: 0.85 },
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateDailyData(dateRange: DateRange, segment: Segment) {
  const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
  const mult = segmentMultipliers[segment];

  return days.map((day, i) => {
    const seed = day.getTime() / 86400000;
    const dayOfWeek = day.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1;
    const trendFactor = 1 + (i / days.length) * 0.15;
    const seasonality = Math.sin((i / 30) * Math.PI * 2) * 0.1 + 1;

    const baseRevenue = (12000 + seededRandom(seed) * 8000) * weekendFactor * trendFactor * seasonality * mult.revenue;
    const baseUsers = Math.round((800 + seededRandom(seed + 1) * 600) * weekendFactor * trendFactor * mult.users);
    const baseSessions = Math.round((2200 + seededRandom(seed + 2) * 1800) * weekendFactor * trendFactor * mult.sessions);
    const baseConversion = (2.5 + seededRandom(seed + 3) * 3.5) * mult.conversion;
    const bounceRate = 35 + seededRandom(seed + 4) * 25;
    const avgSessionDuration = 120 + seededRandom(seed + 5) * 240;

    return {
      date: format(day, 'yyyy-MM-dd'),
      dateLabel: format(day, 'MMM dd'),
      revenue: Math.round(baseRevenue * 100) / 100,
      users: baseUsers,
      sessions: baseSessions,
      conversion: Math.round(baseConversion * 100) / 100,
      bounceRate: Math.round(bounceRate * 100) / 100,
      avgSessionDuration: Math.round(avgSessionDuration),
      pageViews: Math.round(baseSessions * (2.5 + seededRandom(seed + 6) * 2)),
    };
  });
}

export function generateKPIs(dateRange: DateRange, segment: Segment) {
  const data = generateDailyData(dateRange, segment);
  const dayCount = data.length;
  const halfPoint = Math.floor(dayCount / 2);
  const firstHalf = data.slice(0, halfPoint);
  // second half used for trend comparison

  const calcAvg = (arr: typeof data, key: keyof typeof data[0]) =>
    arr.reduce((sum, d) => sum + (d[key] as number), 0) / arr.length;
  const calcSum = (arr: typeof data, key: keyof typeof data[0]) =>
    arr.reduce((sum, d) => sum + (d[key] as number), 0);

  const totalRevenue = calcSum(data, 'revenue');
  const prevRevenue = calcSum(firstHalf, 'revenue') * 2;
  const totalUsers = calcSum(data, 'users');
  const prevUsers = calcSum(firstHalf, 'users') * 2;
  const avgConversion = calcAvg(data, 'conversion');
  const prevConversion = calcAvg(firstHalf, 'conversion');
  const totalSessions = calcSum(data, 'sessions');
  const prevSessions = calcSum(firstHalf, 'sessions') * 2;
  const avgBounce = calcAvg(data, 'bounceRate');
  const prevBounce = calcAvg(firstHalf, 'bounceRate');
  const totalPageViews = calcSum(data, 'pageViews');
  const prevPageViews = calcSum(firstHalf, 'pageViews') * 2;

  return [
    {
      title: 'Total Revenue',
      value: totalRevenue,
      format: 'currency',
      change: ((totalRevenue - prevRevenue) / prevRevenue) * 100,
      icon: 'dollar-sign',
      color: 'emerald',
    },
    {
      title: 'Active Users',
      value: totalUsers,
      format: 'number',
      change: ((totalUsers - prevUsers) / prevUsers) * 100,
      icon: 'users',
      color: 'blue',
    },
    {
      title: 'Conversion Rate',
      value: avgConversion,
      format: 'percent',
      change: ((avgConversion - prevConversion) / prevConversion) * 100,
      icon: 'target',
      color: 'violet',
    },
    {
      title: 'Total Sessions',
      value: totalSessions,
      format: 'number',
      change: ((totalSessions - prevSessions) / prevSessions) * 100,
      icon: 'activity',
      color: 'amber',
    },
    {
      title: 'Bounce Rate',
      value: avgBounce,
      format: 'percent',
      change: ((avgBounce - prevBounce) / prevBounce) * 100,
      icon: 'arrow-down-right',
      color: 'rose',
      invertTrend: true,
    },
    {
      title: 'Page Views',
      value: totalPageViews,
      format: 'number',
      change: ((totalPageViews - prevPageViews) / prevPageViews) * 100,
      icon: 'eye',
      color: 'cyan',
    },
  ];
}

export function generateChannelData(segment: Segment) {
  const mult = segmentMultipliers[segment];
  return [
    { name: 'Organic Search', value: Math.round(4200 * mult.sessions), color: '#6366f1' },
    { name: 'Direct', value: Math.round(2800 * mult.sessions), color: '#06b6d4' },
    { name: 'Social Media', value: Math.round(1900 * mult.sessions), color: '#f59e0b' },
    { name: 'Email', value: Math.round(1500 * mult.sessions), color: '#10b981' },
    { name: 'Referral', value: Math.round(1100 * mult.sessions), color: '#f43f5e' },
    { name: 'Paid Ads', value: Math.round(900 * mult.sessions), color: '#8b5cf6' },
  ];
}

export function generateBarData(dateRange: DateRange, segment: Segment) {
  const data = generateDailyData(dateRange, segment);
  const weeklyData: { week: string; revenue: number; users: number; sessions: number }[] = [];

  for (let i = 0; i < data.length; i += 7) {
    const weekSlice = data.slice(i, i + 7);
    if (weekSlice.length < 3) continue;
    weeklyData.push({
      week: `${weekSlice[0].dateLabel}`,
      revenue: Math.round(weekSlice.reduce((s, d) => s + d.revenue, 0)),
      users: weekSlice.reduce((s, d) => s + d.users, 0),
      sessions: weekSlice.reduce((s, d) => s + d.sessions, 0),
    });
  }

  return weeklyData;
}

export interface TableRow {
  id: number;
  page: string;
  visitors: number;
  pageViews: number;
  bounceRate: number;
  avgDuration: string;
  conversion: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
}

const pages = [
  '/home', '/pricing', '/features', '/blog', '/docs',
  '/about', '/contact', '/signup', '/login', '/dashboard',
  '/api-reference', '/changelog', '/integrations', '/tutorials',
  '/case-studies', '/support', '/careers', '/partners',
  '/security', '/enterprise', '/demo', '/webinar',
  '/whitepaper', '/newsletter', '/community',
];

export function generateTableData(segment: Segment): TableRow[] {
  const mult = segmentMultipliers[segment];
  return pages.map((page, i) => {
    const seed = i * 137;
    const visitors = Math.round((500 + seededRandom(seed) * 4500) * mult.users);
    const pageViews = Math.round(visitors * (1.5 + seededRandom(seed + 1) * 2.5));
    const bounceRate = Math.round((25 + seededRandom(seed + 2) * 45) * 100) / 100;
    const duration = Math.round(30 + seededRandom(seed + 3) * 330);
    const conversion = Math.round((1 + seededRandom(seed + 4) * 8) * mult.conversion * 100) / 100;
    const revenue = Math.round(visitors * conversion * 0.5 * mult.revenue * 100) / 100;
    const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
    const trend = trends[Math.floor(seededRandom(seed + 5) * 3)];

    return {
      id: i + 1,
      page,
      visitors,
      pageViews,
      bounceRate,
      avgDuration: `${Math.floor(duration / 60)}m ${duration % 60}s`,
      conversion,
      revenue,
      trend,
    };
  });
}

export function getDefaultDateRange(): DateRange {
  return {
    start: subDays(new Date(), 30),
    end: new Date(),
  };
}

export const datePresets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 60 days', days: 60 },
  { label: 'Last 90 days', days: 90 },
];

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';


const MOCK_STATS = {
  totalProducts: 24,
  totalUsers: 142,
  categoriesBreakdown: [
    { category: 'watches', count: 8 },
    { category: 'watches/luxury', count: 5 },
    { category: 'fountainPens', count: 4 },
    { category: 'quillPens', count: 3 },
    { category: 'compasses', count: 2 },
    { category: 'inkwells', count: 2 },
  ],
  recentUsers: [
    { date: '2024-03-01', count: 3 },
    { date: '2024-03-05', count: 7 },
    { date: '2024-03-10', count: 5 },
    { date: '2024-03-14', count: 12 },
    { date: '2024-03-18', count: 8 },
    { date: '2024-03-20', count: 15 },
  ],
};

export default function Analytics() {
  const { admin } = useAuth();
  const isDemo = admin?.role === 'demo';
  const [stats, setStats] = useState<typeof MOCK_STATS | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      setStats(MOCK_STATS);
      setLoading(false);
      return;
    }
    setStats(MOCK_STATS);
    setLoading(false);
  }, []);

  if (loading) return <div className="text-zinc-400 py-8 text-center">Loading...</div>;
  if (!stats) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-6 py-5">
          <p className="text-xs text-zinc-400 mb-1">Total Products</p>
          <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">{stats.totalProducts}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-6 py-5">
          <p className="text-xs text-zinc-400 mb-1">Total Users</p>
          <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Categories Bar Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-sm font-medium mb-4">Products by Category</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stats.categoriesBreakdown} barSize={32}>
            <XAxis dataKey="category" tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Categories Pie Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-sm font-medium mb-4">Category Distribution</h2>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={stats.categoriesBreakdown}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={3}
            >
              {stats.categoriesBreakdown.map((_, index) => (
                <Cell
                  key={index}
                  fill={[
                    '#f97316', '#3b82f6', '#10b981', '#8b5cf6',
                    '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'
                  ][index % 8]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '13px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Users Line Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-sm font-medium mb-4">New Users (Last 30 days)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={stats.recentUsers}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="date" tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
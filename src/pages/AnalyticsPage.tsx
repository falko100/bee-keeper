import { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useHives } from '../hooks/useHives';
import { useInspections } from '../hooks/useInspections';
import { formatDateShort } from '../lib/utils';
import EmptyState from '../components/ui/EmptyState';

const COLORS = ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];
const TEMP_COLORS: Record<string, string> = { Calm: '#10b981', Nervous: '#f59e0b', Aggressive: '#ef4444' };

export default function AnalyticsPage() {
  const { hives } = useHives();
  const { inspections } = useInspections();
  const [selectedHiveId, setSelectedHiveId] = useState<string>('all');

  const filtered = useMemo(() => {
    const base = selectedHiveId === 'all' ? inspections : inspections.filter(i => i.hiveId === selectedHiveId);
    return [...base].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [inspections, selectedHiveId]);

  const healthTrendData = useMemo(() =>
    filtered.map(i => ({
      date: formatDateShort(i.date),
      score: i.healthScore,
      hive: hives.find(h => h.id === i.hiveId)?.name || 'Unknown',
    })),
    [filtered, hives]
  );

  const honeyData = useMemo(() => {
    const counts: Record<string, number> = { Abundant: 0, Adequate: 0, Low: 0, Empty: 0 };
    filtered.forEach(i => counts[i.honeyStores]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const temperamentData = useMemo(() => {
    const counts: Record<string, number> = { Calm: 0, Nervous: 0, Aggressive: 0 };
    filtered.forEach(i => counts[i.temperament]++);
    return Object.entries(counts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const pestData = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach(i => i.pestsAndDiseases.forEach(p => { counts[p] = (counts[p] || 0) + 1; }));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  }, [filtered]);

  if (inspections.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
        <EmptyState
          icon={<BarChart3 size={48} />}
          title="No data yet"
          description="Complete some hive inspections to see analytics and trends."
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <select
          value={selectedHiveId}
          onChange={e => setSelectedHiveId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
        >
          <option value="all">All Hives</option>
          {hives.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Health Score Trend</h3>
          {healthTrendData.length < 2 ? (
            <p className="text-sm text-gray-500 py-8 text-center">Need at least 2 inspections for trends</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={healthTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Honey Stores Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Honey Stores Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={honeyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Temperament Pie */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Temperament Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={temperamentData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {temperamentData.map(entry => (
                  <Cell key={entry.name} fill={TEMP_COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pest Frequency */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Pest & Disease Frequency</h3>
          {pestData.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No pests or diseases reported</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pestData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

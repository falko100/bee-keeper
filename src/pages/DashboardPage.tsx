import { Link } from 'react-router-dom';
import { Warehouse, ClipboardList, CalendarCheck, Lightbulb, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { useHives } from '../hooks/useHives';
import { useInspections } from '../hooks/useInspections';
import { useTasks } from '../hooks/useTasks';
import { SEASONAL_TIPS } from '../lib/tips-data';
import { formatDate, daysFromNow, getHealthColor, getHealthLabel, cn } from '../lib/utils';
import Badge from '../components/ui/Badge';
import { TIP_CATEGORIES } from '../lib/constants';

export default function DashboardPage() {
  const { hives } = useHives();
  const { inspections, getLatestInspection } = useInspections();
  const { getUpcomingTasks } = useTasks();

  const upcomingTasks = getUpcomingTasks().slice(0, 5);
  const currentMonth = new Date().getMonth() + 1;
  const currentTips = SEASONAL_TIPS.filter(t => t.month === currentMonth).slice(0, 2);

  const recentInspections = [...inspections]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const avgHealth = hives.length > 0
    ? Math.round(hives.reduce((sum, h) => {
        const latest = getLatestInspection(h.id);
        return sum + (latest?.healthScore || 0);
      }, 0) / Math.max(hives.filter(h => getLatestInspection(h.id)).length, 1))
    : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome to your apiary overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Warehouse size={16} />
            <span className="text-xs font-medium">Total Hives</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{hives.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <ClipboardList size={16} />
            <span className="text-xs font-medium">Inspections</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{inspections.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">Avg Health</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgHealth > 0 ? `${avgHealth}/10` : '--'}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <CalendarCheck size={16} />
            <span className="text-xs font-medium">Pending Tasks</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{getUpcomingTasks().length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hive Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Hives</h2>
            <Link to="/hives" className="text-xs text-amber-600 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          {hives.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 mb-3">No hives yet</p>
              <Link to="/hives" className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700">
                <Plus size={16} /> Add Hive
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {hives.slice(0, 5).map(hive => {
                const latest = getLatestInspection(hive.id);
                return (
                  <Link key={hive.id} to={`/hives/${hive.id}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{hive.name}</p>
                      <p className="text-xs text-gray-500">{hive.type}{hive.location ? ` - ${hive.location}` : ''}</p>
                    </div>
                    {latest && (
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${getHealthColor(latest.healthScore)}`}>
                        {latest.healthScore}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Upcoming Tasks</h2>
            <Link to="/planning" className="text-xs text-amber-600 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 mb-3">No upcoming tasks</p>
              <Link to="/planning" className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700">
                <Plus size={16} /> Add Task
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map(task => {
                const days = daysFromNow(task.dueDate);
                return (
                  <div key={task.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">Due {formatDate(task.dueDate)}</p>
                    </div>
                    {days < 0 && <Badge className="bg-red-100 text-red-700">Overdue</Badge>}
                    {days === 0 && <Badge className="bg-amber-100 text-amber-700">Today</Badge>}
                    {days > 0 && days <= 3 && <Badge className="bg-yellow-100 text-yellow-700">{days}d</Badge>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Inspections */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Recent Inspections</h2>
          </div>
          {recentInspections.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No inspections yet</p>
          ) : (
            <div className="space-y-2">
              {recentInspections.map(insp => {
                const hive = hives.find(h => h.id === insp.hiveId);
                return (
                  <Link key={insp.id} to={`/hives/${insp.hiveId}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{hive?.name || 'Unknown Hive'}</p>
                      <p className="text-xs text-gray-500">{formatDate(insp.date)} - {getHealthLabel(insp.healthScore)}</p>
                    </div>
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${getHealthColor(insp.healthScore)}`}>
                      {insp.healthScore}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Current Tips */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-500" /> This Month's Tips
            </h2>
            <Link to="/tips" className="text-xs text-amber-600 hover:underline flex items-center gap-1">All tips <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {currentTips.map(tip => {
              const cat = TIP_CATEGORIES.find(c => c.value === tip.category);
              return (
                <div key={tip.id} className="p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{tip.title}</h4>
                    {cat && <Badge className={cat.color}>{cat.label}</Badge>}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{tip.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

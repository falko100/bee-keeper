import { useState } from 'react';
import { Plus, CalendarCheck, CheckCircle2, Circle, Trash2, Edit2 } from 'lucide-react';
import { useTasks, type TaskInput } from '../hooks/useTasks';
import { useHives } from '../hooks/useHives';
import type { Task, RecurringType } from '../lib/types';
import { RECURRING_OPTIONS } from '../lib/constants';
import { formatDate, daysFromNow, cn } from '../lib/utils';
import { toISODateString } from '../lib/utils';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import ConfirmDialog from '../components/ui/ConfirmDialog';

function TaskForm({ open, onClose, onSubmit, task, hives }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskInput) => void;
  task?: Task | null;
  hives: { id: string; name: string }[];
}) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [hiveId, setHiveId] = useState<string>(task?.hiveId || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || toISODateString());
  const [recurring, setRecurring] = useState<RecurringType>(task?.recurring || 'none');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), hiveId: hiveId || null, dueDate, recurring });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit Task' : 'Add Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="e.g., Check varroa levels" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hive (optional)</label>
            <select value={hiveId} onChange={e => setHiveId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none">
              <option value="">General</option>
              {hives.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Repeat</label>
          <select value={recurring} onChange={e => setRecurring(e.target.value as RecurringType)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none">
            {RECURRING_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700">{task ? 'Save' : 'Add Task'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function PlanningPage() {
  const { tasks, addTask, updateTask, completeTask, deleteTask } = useTasks();
  const { hives } = useHives();
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tab, setTab] = useState<'pending' | 'completed'>('pending');

  const pendingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const completedTasks = tasks.filter(t => t.completed);
  const displayTasks = tab === 'pending' ? pendingTasks : completedTasks;

  const getDueBadge = (dueDate: string) => {
    const days = daysFromNow(dueDate);
    if (days < 0) return <Badge className="bg-red-100 text-red-700">Overdue</Badge>;
    if (days === 0) return <Badge className="bg-amber-100 text-amber-700">Today</Badge>;
    if (days <= 3) return <Badge className="bg-yellow-100 text-yellow-700">Soon</Badge>;
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planning</h1>
          <p className="text-sm text-gray-500 mt-1">{pendingTasks.length} pending task{pendingTasks.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setEditTask(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700">
          <Plus size={18} /> Add Task
        </button>
      </div>

      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        <button onClick={() => setTab('pending')} className={cn('px-4 py-1.5 text-sm font-medium rounded-md', tab === 'pending' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500')}>
          Pending ({pendingTasks.length})
        </button>
        <button onClick={() => setTab('completed')} className={cn('px-4 py-1.5 text-sm font-medium rounded-md', tab === 'completed' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500')}>
          Completed ({completedTasks.length})
        </button>
      </div>

      {displayTasks.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck size={48} />}
          title={tab === 'pending' ? 'No pending tasks' : 'No completed tasks'}
          description={tab === 'pending' ? 'Add tasks to plan your beekeeping activities.' : 'Completed tasks will appear here.'}
          action={tab === 'pending' ? (
            <button onClick={() => { setEditTask(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700">
              <Plus size={18} /> Add Task
            </button>
          ) : undefined}
        />
      ) : (
        <div className="space-y-2">
          {displayTasks.map(task => {
            const hiveName = task.hiveId ? hives.find(h => h.id === task.hiveId)?.name : null;
            return (
              <div key={task.id} className={cn('bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3', task.completed && 'opacity-60')}>
                <button
                  onClick={() => task.completed ? updateTask(task.id, { completed: false }) : completeTask(task.id)}
                  className="mt-0.5 flex-shrink-0"
                >
                  {task.completed ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} className="text-gray-300 hover:text-amber-500" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn('font-medium text-gray-900', task.completed && 'line-through')}>{task.title}</span>
                    {!task.completed && getDueBadge(task.dueDate)}
                    {task.recurring !== 'none' && <Badge className="bg-blue-50 text-blue-700">{RECURRING_OPTIONS.find(r => r.value === task.recurring)?.label}</Badge>}
                  </div>
                  {task.description && <p className="text-sm text-gray-500 mt-0.5">{task.description}</p>}
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>Due {formatDate(task.dueDate)}</span>
                    {hiveName && <span>Hive: {hiveName}</span>}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => { setEditTask(task); setShowForm(true); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => setDeleteId(task.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TaskForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditTask(null); }}
        onSubmit={data => {
          if (editTask) {
            updateTask(editTask.id, data);
          } else {
            addTask(data);
          }
        }}
        task={editTask}
        hives={hives}
      />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteTask(deleteId); }}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}

import { useAppContext } from '../context/AppContext';
import type { Task, RecurringType } from '../lib/types';
import { generateId } from '../lib/utils';

export interface TaskInput {
  hiveId: string | null;
  title: string;
  description: string;
  dueDate: string;
  recurring: RecurringType;
}

function getNextDueDate(currentDue: string, recurring: RecurringType): string {
  const date = new Date(currentDue);
  switch (recurring) {
    case 'weekly': date.setDate(date.getDate() + 7); break;
    case 'biweekly': date.setDate(date.getDate() + 14); break;
    case 'monthly': date.setMonth(date.getMonth() + 1); break;
    default: return currentDue;
  }
  return date.toISOString().split('T')[0];
}

export function useTasks() {
  const { state, dispatch } = useAppContext();

  const addTask = (data: TaskInput) => {
    const task: Task = {
      id: generateId(),
      ...data,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TASK', payload: task });
    return task;
  };

  const updateTask = (id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    const existing = state.tasks.find(t => t.id === id);
    if (!existing) return;
    dispatch({ type: 'UPDATE_TASK', payload: { ...existing, ...data } });
  };

  const completeTask = (id: string) => {
    const existing = state.tasks.find(t => t.id === id);
    if (!existing) return;
    dispatch({ type: 'UPDATE_TASK', payload: { ...existing, completed: true } });
    if (existing.recurring !== 'none') {
      const nextDue = getNextDueDate(existing.dueDate, existing.recurring);
      addTask({
        hiveId: existing.hiveId,
        title: existing.title,
        description: existing.description,
        dueDate: nextDue,
        recurring: existing.recurring,
      });
    }
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const getTasksForHive = (hiveId: string) =>
    state.tasks.filter(t => t.hiveId === hiveId);

  const getUpcomingTasks = () =>
    state.tasks
      .filter(t => !t.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return {
    tasks: state.tasks,
    addTask,
    updateTask,
    completeTask,
    deleteTask,
    getTasksForHive,
    getUpcomingTasks,
  };
}

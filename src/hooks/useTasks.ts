import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Task, RecurringType } from '../lib/types';

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

function mapRow(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    hiveId: (row.hive_id as string) || null,
    title: row.title as string,
    description: (row.description as string) || '',
    dueDate: row.due_date as string,
    completed: row.completed as boolean,
    recurring: row.recurring as RecurringType,
    createdAt: row.created_at as string,
  };
}

export function useTasks() {
  const { state, dispatch } = useAppContext();
  const { user } = useAuth();

  const addTask = async (data: TaskInput) => {
    if (!user) return null;
    const { data: row, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        hive_id: data.hiveId,
        title: data.title,
        description: data.description,
        due_date: data.dueDate,
        recurring: data.recurring,
      })
      .select()
      .single();

    if (error || !row) return null;
    const task = mapRow(row);
    dispatch({ type: 'ADD_TASK', payload: task });
    return task;
  };

  const updateTask = async (id: string, data: Partial<Omit<Task, 'id' | 'createdAt' | 'userId'>>) => {
    const dbData: Record<string, unknown> = {};
    if (data.title !== undefined) dbData.title = data.title;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.hiveId !== undefined) dbData.hive_id = data.hiveId;
    if (data.dueDate !== undefined) dbData.due_date = data.dueDate;
    if (data.recurring !== undefined) dbData.recurring = data.recurring;
    if (data.completed !== undefined) dbData.completed = data.completed;

    const { data: row, error } = await supabase
      .from('tasks')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error || !row) return;
    dispatch({ type: 'UPDATE_TASK', payload: mapRow(row) });
  };

  const completeTask = async (id: string) => {
    const existing = state.tasks.find(t => t.id === id);
    if (!existing) return;
    await updateTask(id, { completed: true });
    if (existing.recurring !== 'none') {
      const nextDue = getNextDueDate(existing.dueDate, existing.recurring);
      await addTask({
        hiveId: existing.hiveId,
        title: existing.title,
        description: existing.description,
        dueDate: nextDue,
        recurring: existing.recurring,
      });
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) dispatch({ type: 'DELETE_TASK', payload: id });
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

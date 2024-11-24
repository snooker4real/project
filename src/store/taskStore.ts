import { create } from 'zustand';
import { Task, Status, Priority, Column } from '../types/task';
import { isSameDay } from 'date-fns';

interface TaskState {
  tasks: Task[];
  columns: Column[];
  searchTerm: string;
  filters: {
    status: Status | 'all';
    priority: Priority | 'all';
    dueDate: Date | null;
  };
  filteredTasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: TaskState['filters']) => void;
  addColumn: (title: string) => void;
  updateColumn: (id: string, title: string) => void;
  deleteColumn: (id: string) => void;
  reorderColumns: (columns: Column[]) => void;
}

const defaultColumns: Column[] = [
  { id: 'todo', title: 'To Do', order: 0 },
  { id: 'in-progress', title: 'In Progress', order: 1 },
  { id: 'review', title: 'Review', order: 2 },
  { id: 'done', title: 'Done', order: 3 },
];

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  columns: defaultColumns,
  searchTerm: '',
  filters: {
    status: 'all',
    priority: 'all',
    dueDate: null,
  },
  filteredTasks: [],
  addTask: (task) =>
    set((state) => {
      const newTask = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      return {
        tasks: [...state.tasks, newTask],
        filteredTasks: filterTasks([...state.tasks, newTask], state.searchTerm, state.filters),
      };
    }),
  updateTask: (id, updates) =>
    set((state) => {
      const updatedTasks = state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      );
      return {
        tasks: updatedTasks,
        filteredTasks: filterTasks(updatedTasks, state.searchTerm, state.filters),
      };
    }),
  deleteTask: (id) =>
    set((state) => {
      const updatedTasks = state.tasks.filter((task) => task.id !== id);
      return {
        tasks: updatedTasks,
        filteredTasks: filterTasks(updatedTasks, state.searchTerm, state.filters),
      };
    }),
  moveTask: (taskId, newStatus) =>
    set((state) => {
      const updatedTasks = state.tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      return {
        tasks: updatedTasks,
        filteredTasks: filterTasks(updatedTasks, state.searchTerm, state.filters),
      };
    }),
  setSearchTerm: (term) =>
    set((state) => ({
      searchTerm: term,
      filteredTasks: filterTasks(state.tasks, term, state.filters),
    })),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: newFilters,
      filteredTasks: filterTasks(state.tasks, state.searchTerm, newFilters),
    })),
  addColumn: (title) =>
    set((state) => {
      const newColumn: Column = {
        id: crypto.randomUUID(),
        title,
        order: state.columns.length,
      };
      return { columns: [...state.columns, newColumn] };
    }),
  updateColumn: (id, title) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === id ? { ...col, title } : col
      ),
    })),
  deleteColumn: (id) =>
    set((state) => {
      // Move tasks from deleted column to first available column
      const remainingColumns = state.columns.filter((col) => col.id !== id);
      if (remainingColumns.length === 0) return state;

      const defaultColumnId = remainingColumns[0].id;
      const updatedTasks = state.tasks.map((task) =>
        task.status === id ? { ...task, status: defaultColumnId } : task
      );

      return {
        columns: remainingColumns,
        tasks: updatedTasks,
        filteredTasks: filterTasks(updatedTasks, state.searchTerm, state.filters),
      };
    }),
  reorderColumns: (columns) =>
    set({ columns }),
}));

function filterTasks(
  tasks: Task[],
  searchTerm: string,
  filters: TaskState['filters']
): Task[] {
  return tasks.filter((task) => {
    const matchesSearch = searchTerm
      ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesDueDate = !filters.dueDate
      ? true
      : task.dueDate && isSameDay(task.dueDate, filters.dueDate);

    return matchesSearch && matchesStatus && matchesPriority && matchesDueDate;
  });
}
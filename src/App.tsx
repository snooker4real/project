import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { Layout, Plus } from 'lucide-react';
import { TaskColumn } from './components/TaskColumn';
import { TaskForm } from './components/TaskForm';
import { CalendarView } from './components/CalendarView';
import { SearchAndFilters } from './components/SearchAndFilters';
import { useTaskStore } from './store/taskStore';
import { useState } from 'react';

export default function App() {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const moveTask = useTaskStore((state) => state.moveTask);
  const columns = useTaskStore((state) => state.columns);
  const addColumn = useTaskStore((state) => state.addColumn);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      moveTask(active.id as string, over.id as string);
    }
  };

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle.trim());
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <Layout className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Task Board</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchAndFilters />
        
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {columns
              .sort((a, b) => a.order - b.order)
              .map((column) => (
                <TaskColumn
                  key={column.id}
                  status={column.id}
                  title={column.title}
                />
              ))}
            
            {isAddingColumn ? (
              <form
                onSubmit={handleAddColumn}
                className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
              >
                <input
                  type="text"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Enter column title"
                  className="w-full p-2 border rounded mb-2"
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingColumn(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Column
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="flex-shrink-0 w-80 h-[50px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 flex items-center justify-center text-gray-500 hover:text-gray-600"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Column
              </button>
            )}
          </div>
        </DndContext>

        <CalendarView />
      </main>

      <TaskForm />
    </div>
  );
}
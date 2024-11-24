import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ArrowDownUp, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Status } from '../types/task';
import { TaskCard } from './TaskCard';
import { useTaskStore } from '../store/taskStore';
import { cn } from '../lib/utils';

interface TaskColumnProps {
  status: Status;
  title: string;
}

type SortType = 'priority' | 'dueDate' | 'none';

const priorityOrder = { high: 0, medium: 1, low: 2 };

export function TaskColumn({ status, title }: TaskColumnProps) {
  const [sortType, setSortType] = useState<SortType>('none');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const menuRef = useRef<HTMLDivElement>(null);
  const updateColumn = useTaskStore((state) => state.updateColumn);
  const deleteColumn = useTaskStore((state) => state.deleteColumn);

  const filteredTasks = useTaskStore((state) => 
    state.filteredTasks
      .filter((task) => task.status === status)
      .sort((a, b) => {
        if (sortType === 'priority') {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (sortType === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        }
        return 0;
      })
  );

  const { setNodeRef } = useDroppable({ id: status });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSort = () => {
    setSortType((current) => {
      if (current === 'none') return 'priority';
      if (current === 'priority') return 'dueDate';
      return 'none';
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      updateColumn(status, editedTitle.trim());
      setIsEditing(false);
    }
  };

  const handleDeleteColumn = () => {
    if (window.confirm('Are you sure you want to delete this column? All tasks will be moved to the first available column.')) {
      deleteColumn(status);
    }
  };

  return (
    <div className="flex flex-col w-80 bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex-1 mr-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-1 border rounded"
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
          </form>
        ) : (
          <h2 className="text-lg font-semibold">{title}</h2>
        )}
        
        <div className="flex items-center space-x-1">
          <button
            onClick={toggleSort}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            title={`Sort by: ${sortType === 'none' ? 'None' : sortType === 'priority' ? 'Priority' : 'Due Date'}`}
          >
            <ArrowDownUp size={16} className={sortType !== 'none' ? 'text-blue-600' : 'text-gray-400'} />
          </button>
          
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <MoreVertical size={16} className="text-gray-400" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit2 size={14} className="mr-2" />
                  Edit Column
                </button>
                <button
                  onClick={handleDeleteColumn}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete Column
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div
        ref={setNodeRef}
        className="flex-1 min-h-[200px] space-y-3"
      >
        <SortableContext items={filteredTasks} strategy={verticalListSortingStrategy}>
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No tasks yet
          </div>
        )}
      </div>
    </div>
  );
}
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlertCircle, Calendar, Trash2, Edit2 } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { Task } from '../types/task';
import { cn } from '../lib/utils';
import { useTaskStore } from '../store/taskStore';
import { useState } from 'react';
import { TaskForm } from './TaskForm';

interface TaskCardProps {
  task: Task;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const priorityIcons = {
  low: '●',
  medium: '●●',
  high: '●●●',
};

export function TaskCard({ task }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = task.dueDate && isPast(task.dueDate) && task.status !== 'done';
  const isDueToday = task.dueDate && isToday(task.dueDate);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "bg-white p-4 rounded-lg shadow-sm cursor-move hover:shadow-md transition-all",
          "border-l-4",
          isOverdue ? "border-red-500" : priorityColors[task.priority].split(' ')[2],
          task.status === 'done' && "opacity-75"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs font-medium",
                priorityColors[task.priority].split(' ')[1]
              )}>
                {priorityIcons[task.priority]}
              </span>
              <h3 className={cn(
                "font-medium text-gray-900",
                task.status === 'done' && "line-through"
              )}>
                {task.title}
              </h3>
            </div>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {task.description}
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={handleEdit}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Edit2 size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Trash2 size={14} className="text-gray-400 hover:text-red-600" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            priorityColors[task.priority]
          )}>
            {task.priority}
          </span>
          
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue && "text-red-500",
              isDueToday && "text-orange-500"
            )}>
              <Calendar size={14} />
              <span>{format(task.dueDate, 'MMM d')}</span>
              {isOverdue && <AlertCircle size={14} />}
            </div>
          )}
        </div>
      </div>
      
      {isEditing && (
        <TaskForm
          taskToEdit={task}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}
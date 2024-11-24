import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useTaskStore } from '../store/taskStore';
import { Priority, Status, Task } from '../types/task';

interface TaskFormProps {
  taskToEdit?: Task;
  onClose?: () => void;
}

export function TaskForm({ taskToEdit, onClose }: TaskFormProps = {}) {
  const [isOpen, setIsOpen] = useState(!!taskToEdit);
  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [priority, setPriority] = useState<Priority>(taskToEdit?.priority || 'medium');
  const [dueDate, setDueDate] = useState<Date | null>(taskToEdit?.dueDate || null);
  
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title,
      description,
      priority,
      status: taskToEdit?.status || 'todo' as Status,
      dueDate: dueDate || undefined,
    };

    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData);
    } else {
      addTask(taskData);
    }

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(null);
    setIsOpen(false);
    onClose?.();
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {taskToEdit ? 'Edit Task' : 'New Task'}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded mb-3"
              autoFocus
            />
            
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded mb-3 h-24 resize-none"
            />
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                minDate={new Date()}
                placeholderText="Select due date"
                className="w-full p-2 border rounded"
                dateFormat="MMM d, yyyy"
              />
            </div>
            
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {taskToEdit ? 'Update Task' : 'Create Task'}
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  );
}
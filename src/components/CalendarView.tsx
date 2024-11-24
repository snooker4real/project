import { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../types/task';
import { cn } from '../lib/utils';

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const tasks = useTaskStore((state) => state.tasks);

  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDays = getWeekDays(selectedDate);

  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(
      (task) => task.dueDate && isSameDay(task.dueDate, date)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div key={day.toString()} className="text-center">
            <div className="text-sm font-medium text-gray-500 mb-2">
              {format(day, 'EEE')}
            </div>
            <div className="min-h-[100px] border rounded-lg p-2">
              <div className="text-sm font-medium mb-2">
                {format(day, 'd')}
              </div>
              {getTasksForDate(day).map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "text-xs p-1 mb-1 rounded",
                    task.priority === 'high' ? 'bg-red-100' :
                    task.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  )}
                >
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
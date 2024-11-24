import { Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { Priority, Status } from '../types/task';
import { useTaskStore } from '../store/taskStore';
import DatePicker from 'react-datepicker';
import { cn } from '../lib/utils';

interface FilterState {
  status: Status | 'all';
  priority: Priority | 'all';
  dueDate: Date | null;
}

export function SearchAndFilters() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const setSearchTerm = useTaskStore((state) => state.setSearchTerm);
  const setFilters = useTaskStore((state) => state.setFilters);
  const filters = useTaskStore((state) => state.filters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters({ ...filters, ...updates });
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      dueDate: null,
    });
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={cn(
            "px-4 py-2 rounded-lg border flex items-center gap-2 hover:bg-gray-50",
            isFilterOpen && "bg-gray-50"
          )}
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {isFilterOpen && (
        <div className="mt-2 p-4 bg-white rounded-lg border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange({ status: e.target.value as Status | 'all' })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange({ priority: e.target.value as Priority | 'all' })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <DatePicker
                selected={filters.dueDate}
                onChange={(date) => handleFilterChange({ dueDate: date })}
                placeholderText="Filter by due date"
                className="w-full p-2 border rounded-lg"
                dateFormat="MMM d, yyyy"
                isClearable
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isBefore,
  startOfToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * DatePicker component
 * Custom calendar for selecting dates to view devotions
 *
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - Currently selected date
 * @param {Function} props.onDateSelect - Callback when date is selected
 * @param {Date} props.minDate - Minimum selectable date (optional)
 */
const DatePicker = ({ selectedDate, onDateSelect, minDate = null }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday)
  const firstDayOfWeek = monthStart.getDay();

  /**
   * Navigate to previous month
   */
  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  /**
   * Navigate to next month
   */
  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  /**
   * Handle date selection
   */
  const handleDateClick = (date) => {
    // Don't allow selecting future dates
    if (isBefore(startOfToday(), date)) {
      return;
    }

    // Don't allow selecting dates before minDate
    if (minDate && isBefore(date, minDate)) {
      return;
    }

    onDateSelect(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-sm">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h3>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Next month"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {daysInMonth.map((date) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const isFuture = isBefore(startOfToday(), date);
          const isBeforeMin = minDate && isBefore(date, minDate);
          const isDisabled = isFuture || isBeforeMin;

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-smooth
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
                ${isSelected ? "bg-primary text-white" : ""}
                ${isTodayDate && !isSelected ? "bg-secondary text-white" : ""}
                ${
                  !isSelected && !isTodayDate && !isDisabled
                    ? "hover:bg-gray-100 text-gray-900"
                    : ""
                }
                ${
                  isDisabled
                    ? "text-gray-300 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
              aria-label={format(date, "MMMM d, yyyy")}
              aria-current={isTodayDate ? "date" : undefined}
            >
              {format(date, "d")}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-secondary"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-primary"></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;

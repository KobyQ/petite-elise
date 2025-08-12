import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FiCalendar } from "react-icons/fi"
import { MdClose } from "react-icons/md"
import { LuLoader } from "react-icons/lu"

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void
  isLoading?: boolean
}

const DateRangeFilter = ({ onDateRangeChange, isLoading = false }: DateRangeFilterProps) => {
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [isActive, setIsActive] = useState(false)
  const isMounted = useRef(false)

  const handleStartDateChange = useCallback((date: string) => {
    setStartDate(date)
    // If end date is set and start date is after it, clear end date
    if (endDate && date > endDate) {
      setEndDate("")
      setIsActive(false)
      if (isMounted.current) {
        onDateRangeChange(null, null)
      }
    }
  }, [endDate, onDateRangeChange])

  const handleEndDateChange = useCallback((date: string) => {
    setEndDate(date)
    // If start date is set and end date is before it, clear start date
    if (startDate && date < startDate) {
      setStartDate("")
      setIsActive(false)
      if (isMounted.current) {
        onDateRangeChange(null, null)
      }
    }
  }, [startDate, onDateRangeChange])

  const clearFilters = useCallback(() => {
    setStartDate("")
    setEndDate("")
    setIsActive(false)
    if (isMounted.current) {
      onDateRangeChange(null, null)
    }
  }, [onDateRangeChange])

  // Only trigger date range change when both dates are properly set
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    // Only trigger when both dates are set and valid
    if (startDate && endDate && startDate <= endDate) {
      setIsActive(true)
      onDateRangeChange(startDate, endDate)
    } 
    // Clear filters when dates are cleared
    else if (startDate === "" && endDate === "") {
      setIsActive(false)
      onDateRangeChange(null, null)
    }
    // Don't trigger for partial states to prevent flickering
  }, [startDate, endDate, onDateRangeChange])

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
      <div className="flex items-center gap-2">
        <FiCalendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Date Range:</span>
        {isLoading && isActive && (
          <LuLoader className="w-4 h-4 text-blue-500 animate-spin" />
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Start Date"
          max={endDate || undefined}
          disabled={isLoading}
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => handleEndDateChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="End Date"
          min={startDate || undefined}
          disabled={isLoading}
        />
      </div>

      {isActive && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
          disabled={isLoading}
        >
          <MdClose className="w-3 h-3" />
          Clear
        </Button>
      )}
    </div>
  )
}

export default DateRangeFilter

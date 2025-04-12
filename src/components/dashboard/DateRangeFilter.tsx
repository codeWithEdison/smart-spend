
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

const DateRangeFilter = ({ onDateRangeChange }: DateRangeFilterProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectingStart, setSelectingStart] = useState(true);
  
  const handleDateSelect = (date: Date | undefined) => {
    if (selectingStart) {
      setStartDate(date);
      setEndDate(undefined);
      setSelectingStart(false);
    } else {
      if (startDate && date && date < startDate) {
        // If end date is before start date, swap them
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      setSelectingStart(true);
    }
  };
  
  const handleApply = () => {
    onDateRangeChange(startDate, endDate);
  };
  
  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onDateRangeChange(undefined, undefined);
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-auto justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "PPP") : "Start date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <span className="text-muted-foreground hidden sm:block">to</span>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-auto justify-start text-left font-normal",
              !endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "PPP") : "End date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={handleDateSelect}
            initialFocus
            disabled={!startDate ? (date) => true : undefined}
          />
        </PopoverContent>
      </Popover>
      
      <div className="flex gap-2 ml-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleApply}
          disabled={!startDate}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default DateRangeFilter;

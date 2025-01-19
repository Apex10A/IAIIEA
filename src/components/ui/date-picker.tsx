import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export function DatePickerWithPopover() {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex items-center justify-center rounded border p-2 hover:bg-gray-100">
          {selectedDate ? (
            format(selectedDate, 'PPP')
          ) : (
            <span>Select Date</span>
          )}
          <CalendarIcon className="ml-2 h-4 w-4" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          className="z-50 rounded-md bg-white p-4 shadow-md border"
          sideOffset={5}
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className=""
          />
          <Popover.Close className="PopoverClose" aria-label="Close">
            <button className="mt-2 p-2 bg-gray-200 rounded">Close</button>
          </Popover.Close>
          <Popover.Arrow className="fill-current text-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// For Date and Time
export function DateTimePickerWithPopover({ value, onChange }: { value?: Date; onChange: (date: Date) => void }) {
    const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>(value);
  
    const handleDateSelect = (selectedDay: Date) => {
      const currentTime = selectedDateTime ? selectedDateTime : new Date();
      const combinedDateTime = new Date(
        selectedDay.getFullYear(),
        selectedDay.getMonth(),
        selectedDay.getDate(),
        currentTime.getHours(),
        currentTime.getMinutes()
      );
      setSelectedDateTime(combinedDateTime);
      onChange(combinedDateTime); // Notify parent component
    };
  
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (selectedDateTime) {
        const [hours, minutes] = e.target.value.split(':').map(Number);
        const updatedDateTime = new Date(selectedDateTime);
        updatedDateTime.setHours(hours, minutes);
        setSelectedDateTime(updatedDateTime);
        onChange(updatedDateTime); // Notify parent component
      }
    };
  
    return (
      <div className="flex items-center space-x-2">
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="flex items-center justify-center rounded border p-2 hover:bg-gray-100">
              {selectedDateTime ? (
                format(selectedDateTime, 'PPP')
              ) : (
                <span className='text-sm opacity-[0.8]'>Select Date</span>
              )}
              <CalendarIcon className="ml-2 h-4 w-4" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="z-50 rounded-md bg-white p-4 shadow-md border" sideOffset={5}>
              <DayPicker
                mode="single"
                selected={selectedDateTime}
                onSelect={handleDateSelect}
                className=""
              />
              <Popover.Close className="PopoverClose" aria-label="Close">
                <button className="mt-2 p-2 bg-gray-200 rounded">Close</button>
              </Popover.Close>
              <Popover.Arrow className="fill-current text-white" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
  
        <input
          type="time"
          value={selectedDateTime ? format(selectedDateTime, 'HH:mm') : ''}
          onChange={handleTimeChange}
          className="border rounded p-2"
        />
      </div>
    );
  }
  
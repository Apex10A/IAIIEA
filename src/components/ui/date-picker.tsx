import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export function DatePickerWithPopover() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const handleSelect: SelectSingleEventHandler = (selectedDay) => {
    setSelectedDate(selectedDay || undefined);
  };

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
            onSelect={handleSelect}
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

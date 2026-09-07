'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AgendaScheduleRow,
  agendaRowsToApiFormat,
  emptyAgendaRow,
  parseAgendaToRows,
} from '@/app/(admin)/admin-dashboard/utils/eventAgenda';

interface AgendaScheduleEditorProps {
  value: string;
  onChange: (apiAgenda: string) => void;
  id?: string;
}

type RowWithId = AgendaScheduleRow & { id: string };

let rowIdCounter = 0;

function createRow(partial?: AgendaScheduleRow): RowWithId {
  return {
    id: `agenda-row-${++rowIdCounter}`,
    ...emptyAgendaRow(),
    ...partial,
  };
}

function rowsFromApiValue(value: string): RowWithId[] {
  const parsed = parseAgendaToRows(value);
  const meaningful = parsed.filter(
    (row) => row.startTime.trim() || row.endTime.trim() || row.title.trim()
  );
  if (meaningful.length === 0) return [createRow()];
  return meaningful.map((row) => createRow(row));
}

export function AgendaScheduleEditor({
  value,
  onChange,
  id = 'agenda-schedule',
}: AgendaScheduleEditorProps) {
  const lastEmitted = useRef(value);
  const [rows, setRows] = useState<RowWithId[]>(() => rowsFromApiValue(value));

  useEffect(() => {
    if (value !== lastEmitted.current) {
      setRows(rowsFromApiValue(value));
      lastEmitted.current = value;
    }
  }, [value]);

  const emitChange = useCallback(
    (nextRows: RowWithId[]) => {
      setRows(nextRows);
      const apiValue = agendaRowsToApiFormat(nextRows);
      lastEmitted.current = apiValue;
      onChange(apiValue);
    },
    [onChange]
  );

  const updateRow = (rowId: string, field: keyof AgendaScheduleRow, fieldValue: string) => {
    emitChange(
      rows.map((row) => (row.id === rowId ? { ...row, [field]: fieldValue } : row))
    );
  };

  const addRow = () => {
    emitChange([...rows, createRow()]);
  };

  const removeRow = (rowId: string) => {
    const next = rows.filter((row) => row.id !== rowId);
    emitChange(next.length > 0 ? next : [createRow()]);
  };

  return (
    <div className="space-y-3" id={id}>
      <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_2fr_auto] gap-2 px-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
        <span>Start</span>
        <span>End</span>
        <span className="sm:col-span-1">Activity</span>
        <span className="w-9" aria-hidden />
      </div>

      <div className="space-y-2">
        {rows.map((row, index) => (
          <div
            key={row.id}
            className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_2fr_auto] gap-2 items-start rounded-lg border border-gray-200 bg-gray-50/50 p-3 sm:border-0 sm:bg-transparent sm:p-0"
          >
            <div className="space-y-1">
              <Label htmlFor={`${id}-start-${row.id}`} className="sm:sr-only">
                Start time {index + 1}
              </Label>
              <Input
                id={`${id}-start-${row.id}`}
                value={row.startTime}
                onChange={(e) => updateRow(row.id, 'startTime', e.target.value)}
                placeholder="9am"
                className="bg-white"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor={`${id}-end-${row.id}`} className="sm:sr-only">
                End time {index + 1}
              </Label>
              <Input
                id={`${id}-end-${row.id}`}
                value={row.endTime}
                onChange={(e) => updateRow(row.id, 'endTime', e.target.value)}
                placeholder="10am"
                className="bg-white"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor={`${id}-title-${row.id}`} className="sm:sr-only">
                Activity {index + 1}
              </Label>
              <Input
                id={`${id}-title-${row.id}`}
                value={row.title}
                onChange={(e) => updateRow(row.id, 'title', e.target.value)}
                placeholder="Opening Prayer"
                className="bg-white"
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-gray-400 hover:text-red-600 self-end sm:self-center"
              onClick={() => removeRow(row.id)}
              disabled={rows.length === 1 && !row.startTime && !row.endTime && !row.title}
              aria-label={`Remove session ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addRow}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Add session
      </Button>

      <p className="text-xs text-gray-500">
        Build the event schedule row by row. Times accept flexible formats (e.g. 9am, 10:00, 2pm).
      </p>
    </div>
  );
}

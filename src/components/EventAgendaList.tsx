'use client';

import { Clock } from 'lucide-react';
import { parseAgendaItems } from '@/app/(admin)/admin-dashboard/utils/eventAgenda';

interface EventAgendaListProps {
  agenda?: string | null;
  title?: string;
  emptyMessage?: string;
  showTitle?: boolean;
}

export function EventAgendaList({
  agenda,
  title = 'Agenda',
  emptyMessage = 'No agenda available',
  showTitle = true,
}: EventAgendaListProps) {
  const items = parseAgendaItems(agenda?.trim() || '');

  return (
    <div>
      {showTitle && (
        <h2 className="text-md md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 shrink-0 text-primary" />
          {title}
        </h2>
      )}

      {items.length > 0 ? (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <ul>
            {items.map((item, index) => (
              <li
                key={`${item.time}-${item.title}-${index}`}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-4 py-4 border-b border-gray-100 last:border-b-0 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                {item.time && (
                  <div className="shrink-0 sm:w-44 md:w-52">
                    <span className="inline-block rounded-md bg-primary/10 px-3 py-1.5 text-primary font-semibold text-sm tabular-nums">
                      {item.time}
                    </span>
                  </div>
                )}
                <p className="text-gray-900 text-sm md:text-base leading-relaxed font-medium">
                  {item.title}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">{emptyMessage}</p>
      )}
    </div>
  );
}

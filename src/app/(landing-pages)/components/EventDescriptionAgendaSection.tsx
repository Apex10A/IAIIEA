'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { parseAgendaItems } from '@/app/(admin)/admin-dashboard/utils/eventAgenda';

interface EventDescriptionAgendaSectionProps {
  description?: string | null;
  agenda?: string | null;
}

function EventSchedule({ agenda }: { agenda: string }) {
  const items = parseAgendaItems(agenda);

  if (items.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl md:text-2xl font-bold text-[#D5B93C] mb-5 flex items-center gap-2">
        <Clock className="w-5 h-5 shrink-0" />
        Event Schedule
      </h3>

      <div className="rounded-xl border border-white/10 bg-[#0E1A3D]/40 overflow-hidden">
        <ul className="relative">
          {items.map((item, index) => (
            <li
              key={`${item.time}-${item.title}-${index}`}
              className="relative flex gap-4 md:gap-6 px-4 md:px-6 py-5 border-b border-white/10 last:border-b-0 hover:bg-white/[0.03] transition-colors"
            >
              <div className="relative flex flex-col items-center shrink-0 w-5 pt-1">
                <span
                  className="z-10 h-3 w-3 rounded-full border-2 border-[#D5B93C] bg-[#0E1A3D] ring-4 ring-[#D5B93C]/15"
                  aria-hidden
                />
                {index < items.length - 1 && (
                  <span
                    className="absolute top-4 bottom-[-1.25rem] w-px bg-gradient-to-b from-[#D5B93C]/50 to-[#D5B93C]/10"
                    aria-hidden
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                {item.time && (
                  <div className="shrink-0 sm:w-40 md:w-48">
                    <span className="inline-block rounded-md bg-[#D5B93C]/15 px-3 py-1.5 text-[#D5B93C] font-semibold text-sm tabular-nums tracking-tight border border-[#D5B93C]/25">
                      {item.time}
                    </span>
                  </div>
                )}
                <p className="text-white/90 text-base leading-relaxed font-medium">
                  {item.title}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function EventDescriptionAgendaSection({
  description,
  agenda,
}: EventDescriptionAgendaSectionProps) {
  const desc = description?.trim() || '';
  const agendaRaw = agenda?.trim() || '';
  const hasAgenda = agendaRaw.length > 0 && parseAgendaItems(agendaRaw).length > 0;

  if (!desc && !hasAgenda) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
        About this event
      </h2>

      {desc && (
        <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors">
          <CardHeader>
            <CardTitle className="text-[#D5B93C]">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed whitespace-pre-wrap text-white/90">{desc}</p>
          </CardContent>
        </Card>
      )}

      {hasAgenda && <EventSchedule agenda={agendaRaw} />}
    </section>
  );
}

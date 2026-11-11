'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ChevronDown } from 'lucide-react';
import { parseAgendaItems } from '@/app/(admin)/admin-dashboard/utils/eventAgenda';

interface EventDescriptionAgendaSectionProps {
  description?: string | null;
  agenda?: string | null;
  showDescription?: boolean;
  showAgenda?: boolean;
}

function CollapsibleDay({
  header,
  items,
  defaultOpen = false,
}: {
  header: string;
  items: ReturnType<typeof parseAgendaItems>;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      {/* Day header / toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-[#D5B93C]/10 hover:bg-[#D5B93C]/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="bg-[#D5B93C] text-[#0E1A3D] font-bold text-sm px-4 py-1 rounded-full uppercase tracking-wider">
            {header}
          </span>
          <span className="text-white/50 text-sm">
            {items.length} {items.length === 1 ? 'activity' : 'activities'}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-[#D5B93C] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Collapsible body */}
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="bg-[#0E1A3D]/40">
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
    </div>
  );
}

function EventSchedule({
  agenda,
  hideTitle = false,
}: {
  agenda: string;
  hideTitle?: boolean;
}) {
  const items = parseAgendaItems(agenda);

  if (items.length === 0) return null;

  // Check if any day headers exist — if so, render grouped itinerary view
  const hasDayHeaders = items.some((item) => item.isDayHeader);

  return (
    <div className={hideTitle ? undefined : "mt-8"}>
      {!hideTitle && (
        <h3 className="text-xl md:text-2xl font-bold text-[#D5B93C] mb-5 flex items-center gap-2">
          <Clock className="w-5 h-5 shrink-0" />
          Event Schedule
        </h3>
      )}

      {hasDayHeaders ? (
        // Itinerary view: grouped by day, collapsible
        <div className="space-y-3">
          {(() => {
            const groups: { header: string; items: typeof items }[] = [];
            let current: { header: string; items: typeof items } | null = null;

            for (const item of items) {
              if (item.isDayHeader) {
                if (current) groups.push(current);
                current = { header: item.title, items: [] };
              } else {
                if (!current) current = { header: '', items: [] };
                current.items.push(item);
              }
            }
            if (current) groups.push(current);

            return groups.map((group, groupIndex) => (
              <CollapsibleDay
                key={groupIndex}
                header={group.header}
                items={group.items}
                defaultOpen={groupIndex === 0}
              />
            ));
          })()}
        </div>
      ) : (
        // Original flat timeline view (no day headers)
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
      )}
    </div>
  );
}

export function EventDescriptionAgendaSection({
  description,
  agenda,
  showDescription = true,
  showAgenda = true,
}: EventDescriptionAgendaSectionProps) {
  const desc = description?.trim() || '';
  const agendaRaw = agenda?.trim() || '';
  const hasAgenda = agendaRaw.length > 0 && parseAgendaItems(agendaRaw).length > 0;

  if (showDescription && !showAgenda) {
    if (!desc) return null;

    return (
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
          About this event
        </h2>
        <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors">
          <CardHeader>
            <CardTitle className="text-[#D5B93C]">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed whitespace-pre-wrap text-white/90">{desc}</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!showDescription && showAgenda) {
    if (!hasAgenda) return null;

    return (
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block flex items-center gap-2">
          <Clock className="w-6 h-6 shrink-0 text-[#D5B93C]" />
          Event Schedule
        </h2>
        <EventSchedule agenda={agendaRaw} hideTitle />
      </section>
    );
  }

  if (!desc && !hasAgenda) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
        About this event
      </h2>

      {desc && showDescription && (
        <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors">
          <CardHeader>
            <CardTitle className="text-[#D5B93C]">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed whitespace-pre-wrap text-white/90">{desc}</p>
          </CardContent>
        </Card>
      )}

      {hasAgenda && showAgenda && <EventSchedule agenda={agendaRaw} />}
    </section>
  );
}

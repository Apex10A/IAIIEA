'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatAgendaForDisplay } from '@/app/(admin)/admin-dashboard/utils/eventAgenda';

interface EventDescriptionAgendaSectionProps {
  description?: string | null;
  agenda?: string | null;
}

export function EventDescriptionAgendaSection({
  description,
  agenda,
}: EventDescriptionAgendaSectionProps) {
  const desc = description?.trim() || '';
  const agendaDisplay = agenda?.trim() ? formatAgendaForDisplay(agenda.trim()) : '';

  if (!desc && !agendaDisplay) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
        About this event
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {agendaDisplay && (
          <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors">
            <CardHeader>
              <CardTitle className="text-[#D5B93C]">Agenda</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="leading-relaxed whitespace-pre-wrap font-sans text-white/90">
                {agendaDisplay}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

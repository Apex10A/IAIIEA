export type LandingEventType = 'conference' | 'seminar' | undefined;

export function landingEventHref(id: number, type?: LandingEventType): string {
  return type === 'seminar' ? `/seminars/${id}` : `/conference?id=${id}`;
}

export interface Resource {
  resource_id: number;
  resource_type: string | null;
  caption: string;
  date: string;
  file: string;
}

// Basic conference from /landing/events
export interface Conference {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
  flyer: string;
}

// Detailed conference from /landing/event_details/{id}
export interface ConferenceDetails extends Conference {
  is_registered: boolean;
  start_date: string;
  start_time: string;
  sub_theme: string[];
  work_shop: string[];
  important_date: string[];
  gallery: string[];
  sponsors: string[];
  videos: string[];
  resources: Resource[];
  payments: {
    basic: {
      virtual: { usd: string; naira: string };
      physical: { usd: string; naira: string };
      package: string[];
    };
    premium: {
      virtual: { usd: string; naira: string };
      physical: { usd: string; naira: string };
      package: string[];
    };
    standard: {
      virtual: { usd: string; naira: string };
      physical: { usd: string; naira: string };
      package: string[];
    };
  };
  speakers: {
    speaker_id?: number;
    name: string;
    title?: string;
    portfolio?: string;
    picture?: string;
  }[];
  schedule: {
    schedule_id: number;
    day: string;
    activity: string;
    facilitator: string;
    start: string;
    end: string;
    venue: string;
    posted: string;
  }[];
  meals: {
    meal_id: number;
    name: string;
    image: string;
  }[];
}

// Basic seminar from /landing/seminars
export interface Seminar {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
  resources: Resource[];
}

// Detailed seminar from /landing/seminar_details/{id}
export interface SeminarDetails extends Seminar {
  is_registered: boolean;
  start_date: string;
  start_time: string;
  sub_theme: string[] | null;
  work_shop: string[] | null;
  speakers: {
    name: string;
    title?: string;
    portfolio?: string;
    picture?: string;
  }[];
  payments: {
    basic: {
      virtual: { usd: string; naira: string };
      physical: { usd: string; naira: string };
      package: string[];
    };
    premium: {
      virtual: { usd: string; naira: string };
      physical: { usd: string; naira: string };
      package: string[];
    };
    standard: {
      virtual: { usd: string; naira: string };
      physical: { usd: string; naira: string };
      package: string[];
    };
  };
}

export interface ResourceCardProps {
  resource: Resource;
  onDelete: (resourceId: number) => void;
}

export interface AddResourceModalProps {
  conferenceId: number;
  onSuccess: () => void;
}

export interface ConferenceDetailsProps {
  conference: Conference;
  conferenceDetails: ConferenceDetails | null;
  loading: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewResources: (conference: Conference) => void;
}

export interface ConferenceCardProps {
  conference: Conference;
  onEditConference: () => void;
  onDeleteConference: (conferenceId: number) => void;
  onViewResources: (conference: Conference) => void;
  onViewDetails: (conference: Conference) => void;
}

export interface SeminarDetailsProps {
  seminar: Seminar;
  seminarDetails: SeminarDetails | null;
  loading: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewResources: (seminar: Seminar) => void;
}

export interface SeminarCardProps {
  seminar: Seminar;
  onViewDetails: (seminar: Seminar) => void;
}
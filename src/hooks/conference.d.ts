declare interface Conference {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
  flyer: string;
}

declare interface ConferenceDetails extends Conference {
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
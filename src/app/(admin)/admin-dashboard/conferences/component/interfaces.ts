export interface Resource {
  resource_id: number;
  resource_type: string | null;
  caption: string;
  date: string;
  file: string;
}

export interface Conference {
  id: number;
  title: string;
  theme: string;
  venue: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
   sub_theme?: string[];
  work_shop?: string[];
  important_date?: string[];
  description: string;
  status: string;
  meals: string[];
  gallery: string[];
  flyer: string;
  sponsors: string[];
  videos: string[];
  resources: Resource[];
}

export interface ConferenceDetails {
  id: number;
  is_registered: boolean;
  title: string;
  theme: string;
  venue: string;
  date: string;
  start_date: string;
  start_time: string;
  sub_theme?: string[];
  work_shop: string[];
  important_date: string[];
  flyer: string;
  gallery: string[];
  resources: {
    resource_id: number;
    resource_type: string | null;
    caption: string;
    date: string;
    file: string;
  }[];
  videos: {
    title?: string;
    description?: string;
    url: string;
  }[];
  meals: {
    meal_id: number;
    name: string;
    image: string;
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
  payments: {
    early_bird_registration: {
      virtual: {
        usd: string;
        naira: string;
      };
      physical: {
        usd: string;
        naira: string;
      };
    };
    normal_registration: {
      virtual: {
        usd: string;
        naira: string;
      };
      physical: {
        usd: string;
        naira: string;
      };
    };
    late_registration: {
      virtual: {
        usd: string;
        naira: string;
      };
      physical: {
        usd: string;
        naira: string;
      };
    };
    tour: {
      virtual: {
        usd: number | string;
        naira: number | string;
      };
      physical: {
        usd: string;
        naira: string;
      };
    };
    annual_dues: {
      virtual: {
        usd: string;
        naira: string;
      };
      physical: {
        usd: string;
        naira: string;
      };
    };
    vetting_fee: {
      virtual: {
        usd: string;
        naira: string;
      };
      physical: {
        usd: string;
        naira: string;
      };
    };
    publication_fee: {
      virtual: {
        usd: string;
        naira: string;
      };
      physical: {
        usd: string;
        naira: string;
      };
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
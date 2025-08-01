// Seminar creation types
export interface Speaker {
  speaker_id: number;
  occupation: string;
  name?: string;
  picture?: string;
  portfolio?: string;
  title?: string;
}

export interface AvailableSpeaker {
  speaker_id: number;
  speaker_name: string;
}

export interface Step1Data {
  title: string;
  theme: string;
  venue: string;
  start: string;
  end: string;
  mode: string;
  is_free: string;
}

export interface Step2Data {
  token: string;
  basic_naira: number | string;
  basic_usd: number | string;
  basic_package: string[];
  premium_naira: number | string;
  premium_usd: number | string;
  premium_package: string[];
  standard_naira: number | string;
  standard_usd: number | string;
  standard_package: string[];
  speakers: Speaker[];
}

export interface CreateSeminarModalProps {
  onSuccess: () => void;
}

export interface Step1FormProps {
  data: Step1Data;
  onDataChange: (data: Step1Data) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface Step2FormProps {
  data: Step2Data;
  onDataChange: (data: Step2Data) => void;
  onSubmit: (e: React.FormEvent) => void;
  availableSpeakers: AvailableSpeaker[];
}

export interface SpeakersSectionProps {
  speakers: Speaker[];
  availableSpeakers: AvailableSpeaker[];
  onAddSpeaker: () => void;
  onRemoveSpeaker: (index: number) => void;
  onUpdateSpeaker: (index: number, field: keyof Speaker, value: string | number) => void;
}

export interface PackageSectionProps {
  type: 'basic' | 'standard' | 'premium';
  data: Step2Data;
  onDataChange: (data: Step2Data) => void;
  onPackageChange: (type: 'basic' | 'premium' | 'standard', value: string) => void;
}

// Seminar display types
export interface Seminar {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
  flyer?: string;
  start_date?: string;
  start_time?: string;
  speakers?: Speaker[];
  payments?: Payment[];
}

export interface SeminarDetails {
  start_date: string;
  start_time: string;
  speakers: Speaker[];
  resources: Resource[];
  payments: Payment[];
  is_registered?: boolean;
  registered_count?: number;
}

export interface Resource {
  resource_id: number | string;
  resource_type: string | null;
  caption: string;
  date: string;
  file: string;
  resource?: File[];
  created_at?: string;
}

export interface Payment {
  id: number;
  name: string;
  amount_naira: number;
  amount_usd: number;
  features: string[];
}

export interface SeminarDetailsProps {
  seminar: Seminar;
  seminarDetails: SeminarDetails | null;
  loading: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  handleDeleteSeminar: (id: number) => Promise<void>;
  onViewResources?: (seminar: Seminar) => void;
}

export interface SeminarCardProps {
  seminar: Seminar;
  onViewDetails: (seminar: Seminar) => void;
}

export interface SeminarListProps {
  seminars: Seminar[];
  onViewDetails: (seminar: Seminar) => void;
  selectedSeminar: Seminar | null;
}

export interface AddResourceModalProps {
  seminarId: number;
  onSuccess: () => void;
}
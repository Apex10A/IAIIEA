export type ResourceType = 'Video' | 'document' | 'image';

export interface Resource {
  id?: string;
  resource_type: ResourceType;
  resource: File[];
  caption: string;
  date?: string;
  created_at?: string;
}
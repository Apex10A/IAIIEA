// types.ts
export interface SubItem {
    name: string;
    icon: React.FC<{ isActive: boolean }>;
    requiredPortal?: string | null;
  }
  
  export interface PortalItem {
    name: string;
    icon: React.FC<{ isActive: boolean }>;
    requiredPortal?: string | null;
    subItems: SubItem[];
  }
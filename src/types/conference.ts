// types/conference.ts
export type SectionType = 'Conference Portal' | 'Conference Directory' | 'Conference Resources';

export type VideoResource = {
    imageUrl: string;
    duration: string;
    title: string;
    hasAudio?: boolean;
};

export type DocumentResource = {
    icon: string;
    title: string;
    link: string;
    bgColor?: string;
    type: string;
};

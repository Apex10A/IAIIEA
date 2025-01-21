export type SectionType = 
  | 'Conference Portal' 
  | 'Conference Directory' 
  | 'Conference Resources' 
  | 'Conference resources' 
  | 'Seminar resources' 
  | 'IAIIEA members' 
  | 'Event speakers' 
  | 'Conference participants' 
  | 'Volunteers' 
  | 'job opportunity'
  | 'Announcement'
  | 'Members resources'
  | 'Payment History'
  | 'Dues Settings'
  | 'Workshop participants'
  | "Announcement"
  | "Event"
  | "News";

  export type SectionState = {
    [K in 'section1' | 'section2' | 'section3' | 'section4' | 'section5' | 'section6']: boolean;
  };

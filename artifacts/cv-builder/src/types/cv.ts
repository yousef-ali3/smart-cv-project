export interface PersonalInfo {
  fullName: string;
  fullNameEn?: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
  summaryEn?: string;
}

export interface Education {
  id: string;
  degree: string;
  degreeEn?: string;
  institution: string;
  institutionEn?: string;
  field: string;
  fieldEn?: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
  descriptionEn?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  jobTitleEn?: string;
  company: string;
  companyEn?: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  descriptionEn?: string;
}

export interface Skill {
  id: string;
  name: string;
  nameEn?: string;
}

export interface Course {
  id: string;
  name: string;
  nameEn?: string;
  provider: string;
  date: string;
  certificateId: string;
}

export interface Language {
  id: string;
  name: string;
  level: "مبتدئ" | "متوسط" | "جيد" | "ممتاز" | "اللغة الأم";
}

export interface CVData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  courses: Course[];
  languages: Language[];
}

export const defaultCVData: CVData = {
  personalInfo: {
    fullName: "",
    fullNameEn: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
    summaryEn: "",
  },
  education: [],
  experience: [],
  skills: [],
  courses: [],
  languages: [],
};

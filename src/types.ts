export interface FormState {
  region: string;
  jobTitles: string[];
  skillsAnd: string[];
  skillsOr: string[];
  locations: string[];
  companies: string[];
  exclude: string[];
  platforms: Record<string, boolean>;
}

export interface Region {
  code: string;
  label: string;
}

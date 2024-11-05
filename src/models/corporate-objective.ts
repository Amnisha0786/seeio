export type KeyIndicator = {
  name: string;
  owner: any;
  type: string;
  frequency?: string;
  status: string;
  description: string;
  value?: string;
  startDate?: string;
  endDate?: string;
  currency?: string
};

export type ActionDetails = {
  objCategory?: string;
  name: string;
  description: string;
  objStatus: string;
  reviewFrequency?: number;
  frequencyDuration?: string;
  nextReview: string;
  keyIndicators?: KeyIndicator[];
  other?: string;
  dateCreated?: string;
  lastReview?: string | null;
  startDate?: string;
};

export type CorporateObjective = {
  id?: string;
  name: string;
  nextReview: string;
  dateCreated?: string;
  objCategory?: string;
  objStatus: string;
  status: string;
  description: string;
  reviewFrequency?: number;
  keyIndicators?: KeyIndicator[];
  startDate?: string;
  lastReview?: string | null;
  frequencyDuration?: string;
  other?: string;
};

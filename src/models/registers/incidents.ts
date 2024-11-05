import { Dayjs } from "dayjs";

export interface TIncident {
  id: string;
  name: string;
  dateDiscovered: string;
  dateResolved: string;
  owner: string;
  status: string;
  type: "document" | "folder";
}

export interface IncidentFormValues {
  date: Dayjs;
  owner: string;
  stakeholders: string;
  plan: string;
  cause: string;
  lessons: string;
  description: string;
  expiryDate: Dayjs;
  name: string;
  cancelled: boolean;
  notes: string;
}

export type TIncidentsDocument = {
  id: string;
  name: string;
  plan: string;
  cause: string;
  expiryDate: string;
  description: string;
  lessons: string;
  cancelled: boolean;
  stakeholders: string;
  date: string;
  owner: string;
};

import { MEETING_AGENDA_STATUS } from '@/constants'
import { TActionOwner } from '.'

export type TMeeting = {
  id: string
  date: string
  type: "board"
  name: string
  status: "planned" | "open" | "closed"
  location: string
}

export type TMeetingDetailsTopicRisk = {
  id: string
  name: string
  description: string
  riskType: string
  nextReview: string
  topicOwner?: string
  topicStatus?: string
  topicAmendments?: string
}

export type TMeetingDetailsTopicRegisters = {
  description: string
  docType: string
  id: string
  name: string
  recType: string
  status: string
  type: string
  owner: string | TActionOwner
  nextReview: string
  fileUrl?: string
  fileName?: string
  fileType?: string
  additionalFiles?: any[]
  fileSize?: number
  resolutionNumber?: string
  typeOfResolution?: string
  editUrl?: "/dashboard/business-health/corporate-objectives" | "/dashboard/business-health/strategic-risks" | "/dashboard/business-health/vision-purpose"
}

export type TMeetingDetailsTopicRecord = {
  description: string
  docType: string
  id: string
  name: string
  recType: string
  status: string
  type: string
  owner: string | TActionOwner
  fileUrl?: string
  fileName?: string
  fileType?: string
  additionalFiles?: any[]
  fileSize?: number
  editUrl?: "/dashboard/business-health/corporate-objectives" | "/dashboard/business-health/strategic-risks" | "/dashboard/business-health/vision-purpose"
}
export type TMeetingDetailsTopicObjective = {
  description: string
  name: string
  status: string
  id: string
  nextReview: string
}
export type TMeetingDetailsTopicDoc = {
  documentId: string
  fileName: string
  fileSize: number
  fileType: string
  fileUrl: string
}

export type TMinutes = {
  dateCreated: string;
  status: string;
  description?: string;
  amendments?: string
  meeting: TMeeting
}

export type TMeetingDetailsTopic = {
  topicId: string
  categoryId: string
  topicName: string
  name?: string
  topicType: string
  timeAlloted?: number
  dateOfNextMeeting?: string
  presenter?: string
  notes?: string
  documents?: TMeetingDetailsTopicDoc[]
  topic?: string
  forReviewOrApproval?: string
  discussion?: string
  minutes?: string | TMinutes[]
  meetingIsQuorate?: string
  meetingChair?: string
  attendees?: string
  anyConflictsOfInterest?: boolean
  methodOfManagingConflict?: string
  previousMinutes?: TMinutes[]
  amendments?: string
  details?: string
  actions?: {
    description?: string
    dueDate: string
    id: string
    name: string
    owner: string
    status: string
  }[]
  records?: TMeetingDetailsTopicRecord[]
  registers?: TMeetingDetailsTopicRegisters[]
  objectives?: TMeetingDetailsTopicObjective[]
  risks?: TMeetingDetailsTopicRisk[]
  horizons?: string[]
}

export type TMeetingDetailsAgendaCategory = {
  categoryId: string
  categoryName: string
  categoryType: string
  timeAlloted: number
  topicOrderIds: string[]
  topics: TMeetingDetailsTopic[]
}

export type TMeetingDetails = {
  id: string
  date: string
  type: "board" | string
  name: string
  status: "planned" | "open" | "closed"
  location: string
  agenda: TMeetingDetailsAgendaCategory[]
  isVirtual?: boolean
  agendaStatus?: MEETING_AGENDA_STATUS
  transcriptUploadedAt?: string
}

export type TMeetingToolTypes = "agenda"
  | "risk-register"
  | "risks-for-review"
  | "ongoing-incidents"
  | "corporate-objectives"
  | "progress-against-objectives"
  | "action-tracker"
  | "meeting-pack"
  | "minute-tool"

export type TMeetingTool = {
  id: string
  name: string
  type: TMeetingToolTypes
  lastEdited: string
  review: string
  status: string
}

export type TMeetingPack = {
  id: string
  documentType: string
  dateGenerated: string
  documentDate?: string
}

export type TMeetingPackDocument = {
  id: string
  name: string
  description: string
  dateCreated: string
  createdBy: string
  fileUrl: string
  fileType: string
  fileSize: number
}

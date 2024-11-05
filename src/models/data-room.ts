export type TDataRoom = {
  id: string
  name: string
  numFiles: number
}

export type TDataRoomFolder = {
  folderId: string,
  folderName: string,
  folderDescription: string,
  folder: TDataroomFolderItem[];
}

export type TDataroomFolderItem = {
  id: string
  name: string
  dateCreated: string;
  description: string;
  type: "document" | "folder"
}

export type TDataRoomDocument = {
  id: string,
  name: string,
  documentType?: string,
  description: string,
  dateCreated: string,
  createdBy: string,
  fileUrl: string
  fileType: string,
  fileSize: number
}

export enum StatusVdr {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  READY = "READY",
  DELETED = "DELETED",
}

export enum Role {
  ADMIN = "ADMIN",
  OWNER = "OWNER",
  DATA_ROOM_ACCESS_USER = "DATA_ROOM_ACCESS_USER",
  OTHER_ROLE = "OTHER_ROLE"
}

export interface Access {
  users: string[];
  roles: Role[] | string[];
}

export interface TVdr {
  viewAccess: Access;
  createdAt: string;
  editAccess: Access;
  status: StatusVdr;
  description: string;
  id: string;
  name: string;
  companyId: string;
}

export enum VDR_RECORD_TYPE {
  RECORD = "Corporate Records",
  REGISTER = "Corporate Registers",
  VISION_AND_PURPOSE = "Vision and Purpose",
  OBJECTIVES = "Corporate Objectives",
  RISK = "Strategic Risks",
  CASH_BURN = "Cash Burn",
  COMPANY_INFORMATION = "Company Information",
  COMPANY_KEY_DATES = "Company Key Dates",
}
export enum VDR_METADATA_STATUS {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  DELETED = 'DELETED',
  READY = 'READY'
}

export type TVdrs = { label?: string, value?: string }
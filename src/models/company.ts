export type TCompany = {
  address: string
  companyNumber: string
  companyStatus: string
  companyType: string
  dateOfCreation: string
  name: string
}

export type TUserCompany = {
  companyId: string
  companyName: string
  userType: "company" | "investor"
}

export enum COMPANY_USER_ACCESS_LEVEL {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  BOARD_MEMBER = "BOARD_MEMBER",
  USER = "USER",
  DATA_ROOM_ACCESS_USER = "DATA_ROOM_ACCESS_USER",
  BILLING_ADMIN = "BILLING_ADMIN"
}

export enum USER_TYPE {
  COMPANY = "company",
  INVESTOR = "investor"
}

export type TCompanyUserAccess = {
  accessLevel: string;
  companyId: string;
  userId: string;
  userType: string;
  person?: {
    createdAt?: string;
    departmentIds: string[];
    email?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  };
};

export type TCompanyDetails = {
  id: string
  recType: string
  canFile: boolean
  companyName: string
  companyStatus: 'active'
  companyType: string
  companySummary: string
  numBoardMeetings: number
  logo?: string
  sicCodes: string[]
  companyRegulator: string[]
  companySize: string
  sailLocation: string
  companyTradingName: string
  businessDescription: "product" | "service"
  boardCommitteeOptions: string[]
  registeredOfficeAddress: {
    addressLine1: string
    addressLine2: string
    locality: string
    postalCode: string
    region: string
    country?: string
  }
  companyHouseAuthenticationCode?: string
  governmentGateway?: string
  password?: string
}

export type TPeople = {
  id: string
  role: string
  firstName: string
  lastName: string
  email: string
  departmentIds: string[]
  createdAt: string
}

export type TDepartment = {
  id: string
  name: string
  description: string
  ownerId: string
  createdAt: string
}

export type TCorporateDirector = {
  companyId: string
  id: string
  name: string
  recType: string
  registeredOffice: {
    addressLine1: string;
    locality: string;
    country: string;
    postalCode: string;
    premises: string
  }
  registrationNumber: string
}

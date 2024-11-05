export type TInvestmentReady = {
  id: string
  name: string
  date: string
  status: string
  url: string
}

export type TGovernanceDetail = {
  group: string
  itemToReview: string
  reviewDate: string
  status: string
  detail: {
    categoryId: string
    docType: string
    id: string
    parentId: string
    recordType: string
    meetingId?: string
    meetingStatus?: string
  }
}

export type TGovernanceTimetable = {
  all: TGovernanceDetail[]
  complianceTimetable: TGovernanceDetail[]
  riskAndObjectives: TGovernanceDetail[]
}

export type TDashboardData = {
  companyId?: string
  riskScore: string
  companyName?: string
  boardMeeting: {
    meeting: {
      id: string;
      status: string
    }
    status: string
    nextBoardMeetingDate: string
    numberOfActions: number
  },
  governance: {
    red: number
    yellow: number
    green: number
  },
  progressUpdate: {
    deadline: string;
    status: string
  }
  action: {
    number: number;
    status: string
  }
  dataroom: {
    status?: string,
    vdrId?: string
  }

}

export type TInverstorCompany = {
  id?: string
  action: {
    id?: string
    number: number
    status: string
  }
  actions: {
    id: string,
    companyId: string,
    description?: string,
    dueDate: string,
    meetingId: string,
    name?: string,
    owner?: {
      id: string,
      firstName?: string,
      lastName?: string,
      email?: string,
      role?: string
    }
    recType?: string,
    status?: string
  }[],
  boardMeeting: {
    id?: string
    lastBoardMeetingDate?: string
    meeting: {
      id: string;
      status: string
    }
    nextBoardMeetingDate?: string
    numberOfActions?: number
    status?: string
    companyId: string
    companyName: string
  }
  governance: {
    id?: string
    red: number
    yellow: number
    green: number
  },
  isIncidentExists?: boolean
  riskScore: number
}

export type TCompanyActions = {
  companyId: string,
  description?: string,
  dueDate: string,
  id: string,
  meeting_id: string,
  name?: string,
  owner?: {
    id: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    role?: string
  }
  recType?: string,
  status?: string
}

export type TInvestorDashboardData = {
  allCompanyActions: TCompanyActions[],
  completeActions?: TCompanyActions[],
  incompleteActions?: TCompanyActions[],
  companies: {
    companyId?: string,
    companyName?: string,
    action: {
      id?: string
      number: number
      status: string
    }
    actions: {
      id: string,
      companyId: string,
      description?: string,
      dueDate: string,
      meetingId: string,
      name?: string,
      owner?: {
        id: string,
        firstName?: string,
        lastName?: string,
        email?: string,
        role?: string
      }
      recType?: string,
      status?: string
    }[],
    boardMeeting: {
      id?: string
      lastBoardMeetingDate?: string
      meeting: {
        id: string;
        status: string
      }
      nextBoardMeetingDate?: string
      numberOfActions?: number
      status?: string
      companyId: string
      companyName: string
    }
    governance: {
      id?: string
      red: number
      yellow: number
      green: number
    },
    isIncidentExists?: boolean
    riskScore: number
  }[]
  num_companies: number
  upcomingMeetings: {
    name?: string
    companyName?: string
    date?: string
  }[]
}


export type TInvestments = {
  name: string;
  data: string;
  status: string;
  link: string;
}

export type TFilterOptions = {
  date?: {
    from: string;
    to: string;
  };
  status?: string;
  group?: string;
}

export type TCongif = {
  havePlatformTour: {
    businessHealth: boolean,
    record: boolean,
    register: boolean,
    objective?: boolean
  }
  email?: string,
  firstName?: string,
  lastName?: string,
  isConsentedToMarketing?: boolean
  id?: string
}

export type Currency = "GBP" | "USD" | "EURO";

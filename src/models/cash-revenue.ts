
export type TCash = { value?: number; period: string; status?: string };
export type TCashRevenueDocument = {
  period: string,
  cashValue: number,
  revenueValue: number,
  status?: string
};

export type TRevenue = { value?: number; period: string; };

export type TInvitesData = {
  companyName: string
  companyId: string
  accessLevel: string
  userType: string
  createdAt: string
  inviteStatus: string
}

export type TXero = {
  company: { rootfiId?: number | string; name?: string };
  connections?: string;
  integrationCategories?: string[];
  integrations?: string[];
  inviteLinkId?: string;
  metadata?: string[];
  rootfiCompanyId?: number | string;
  rootfiCreatedAt?: string;
  rootfiDeletedAt?: number | string;
  rootfiId?: number;
  rootfiOrganisationId?: number;
  rootfiUpdatedAt?: string;
  syncConfig: null;
};

export type TXeroData = {
  companyId?: string;
  connectedPlatform?: string;
  baseCurrency: "GBP" | "USD" | "EURO";
  createdAt?: string;
  inviteLinkId?: string;
  isConnected?: boolean;
  isExpired?: boolean;
  rootfiCompanyId?: string;
  payload?: any;
};
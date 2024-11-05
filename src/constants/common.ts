/* eslint-disable max-len */

export const getLabel = (array: any, value: string) => {
  const label = array.find((item: any) => item.value === value);

  return label ? label.label : "";
};

export const COMPANY_TYPES = [
  {
    value: "private-unlimited",
    label: "Private Unlimited Company",
  },
  {
    value: "ltd",
    label: "Limited Company",
  },
  {
    value: "plc",
    label: "Public Limited Company",
  },
  {
    value: "old-public-company",
    label: "Old Public Company",
  },
  {
    value: "private-limited-guarant-nsc-limited-exemption",
    label:
      "Private Limited Company by Guarantee without Share Capital with Limited Exemption",
  },
  {
    value: "limited-partnership",
    label: "Limited Partnership",
  },
  {
    value: "private-limited-guarant-nsc",
    label: "Private Limited Company by Guarantee without Share Capital",
  },
  {
    value: "converted-or-closed",
    label: "Converted/Closed Company",
  },
  {
    value: "private-unlimited-nsc",
    label: "Private Unlimited Company without Share Capital",
  },
  {
    value: "private-limited-shares-section-30-exemption",
    label: "Private Limited Company by Shares with Section 30 Exemption",
  },
  {
    value: "protected-cell-company",
    label: "Protected Cell Company",
  },
  {
    value: "assurance-company",
    label: "Assurance Company",
  },
  {
    value: "oversea-company",
    label: "Overseas Company",
  },
  {
    value: "eeig",
    label: "European Economic Interest Grouping",
  },
  {
    value: "icvc-securities",
    label: "Investment Company with Variable Capital Securities",
  },
  {
    value: "icvc-warrant",
    label: "Investment Company with Variable Capital Warrant",
  },
  {
    value: "icvc-umbrella",
    label: "Investment Company with Variable Capital Umbrella",
  },
  {
    value: "registered-society-non-jurisdictional",
    label: "Registered Society (Non-jurisdictional)",
  },
  {
    value: "industrial-and-provident-society",
    label: "Industrial and Provident Society",
  },
  {
    value: "northern-ireland",
    label: "Northern Ireland Company",
  },
  {
    value: "northern-ireland-other",
    label: "Other Type of Northern Ireland Company",
  },
  {
    value: "royal-charter",
    label: "Royal Charter Company",
  },
  {
    value: "investment-company-with-variable-capital",
    label: "Investment Company with Variable Capital",
  },
  {
    value: "unregistered-company",
    label: "Unregistered Company",
  },
  {
    value: "llp",
    label: "Limited Liability Partnership",
  },
  {
    value: "other",
    label: "Other Type of Company",
  },
  {
    value: "european-public-limited-liability-company-se",
    label: "European Public Limited-Liability Company (SE)",
  },
  {
    value: "uk-establishment",
    label: "UK Establishment Company",
  },
  {
    value: "scottish-partnership",
    label: "Scottish Partnership",
  },
  {
    value: "charitable-incorporated-organisation",
    label: "Charitable Incorporated Organisation",
  },
  {
    value: "scottish-charitable-incorporated-organisation",
    label: "Scottish Charitable Incorporated Organisation",
  },
  {
    value: "further-education-or-sixth-form-college-corporation",
    label: "Further Education or Sixth Form College Corporation",
  },
  {
    value: "registered-overseas-entity",
    label: "Registered Overseas Entity",
  },
];

export const BUSINESS_DESCRIPTION = [
  {
    label: "Manufacturing",
    value: "Manufacturing",
  },
  {
    label: "Retail",
    value: "Retail",
  },
  {
    label: "B2B SaaS",
    value: "B2B SaaS",
  },
  {
    label: "B2C SaaS",
    value: "B2C SaaS",
  },
  {
    label: "Fintech",
    value: "Fintech",
  },
  {
    label: "Life sciences / Biotech",
    value: "Life sciences / Biotech",
  },
  {
    label: "Other",
    value: "Other",
  },
];

export const COMPANY_SIZES = [
  {
    value: "1-9",
    label: "1 - 9",
  },
  {
    value: "10-24",
    label: "10 - 24",
  },
  {
    value: "25-99",
    label: "25 - 99",
  },
  {
    value: "100-249",
    label: "100 - 249",
  },
  {
    value: "250-499",
    label: "250 - 499",
  },
  {
    value: "500+",
    label: "500+",
  },
];

export const COMPANY_REGULATORS = [
  {
    value: "coho",
    label: "Companies House",
  },
  {
    value: "fca",
    label: "Financial Conduct Authority",
  },
  {
    value: "charity",
    label: "Charities Commission",
  },
  {
    value: "mahc",
    label: "Medicines and Healthcare Products Regulator",
  },
  {
    value: "other",
    label: "Other",
  },
];

export const BOARD_COMMITTEE_OPTIONS = [
  {
    value: "advisory-board",
    label: "Advisory board (Requires premium subscription)",
  },
  {
    value: "audit-committee",
    label: "Audit committee",
  },
  {
    value: "board-of-directors",
    label: "Board of Directors",
  },
  {
    value: "nominations-committee",
    label: "Nominations committee",
  },
  {
    value: "remuneration-committee",
    label: "Remuneration committee",
  },
];

export const COMPANY_BOOKS_LOCATION = [
  {
    value: "coho",
    label: "Companies House",
  },
  {
    value: "sail",
    label: "Sail Location",
  },
  {
    value: "office",
    label: "Registered Office",
  },
];

export const OFFICER_ROLES = [
  {
    value: "cic-manager",
    label: "CIC Manager",
  },
  {
    value: "corporate-director",
    label: "Corporate Director",
  },
  {
    value: "corporate-llp-designated-member",
    label: "Corporate LLP Designated Member",
  },
  {
    value: "corporate-llp-member",
    label: "Corporate LLP Member",
  },
  {
    value: "corporate-manager-of-an-eeig",
    label: "Corporate Manager of an EEIG",
  },
  {
    value: "corporate-managing-officer",
    label: "Corporate Managing Officer",
  },
  {
    value: "corporate-member-of-a-management-organ",
    label: "Corporate Member of a Management Organ",
  },
  {
    value: "corporate-member-of-a-supervisory-organ",
    label: "Corporate Member of a Supervisory Organ",
  },
  {
    value: "corporate-member-of-an-administrative-organ",
    label: "Corporate Member of an Administrative Organ",
  },
  {
    value: "corporate-nominee-director",
    label: "Corporate Nominee Director",
  },
  {
    value: "corporate-nominee-secretary",
    label: "Corporate Nominee Secretary",
  },
  {
    value: "corporate-secretary",
    label: "Corporate Secretary",
  },
  {
    value: "director",
    label: "Director",
  },
  {
    value: "general-partner-in-a-limited-partnership",
    label: "General Partner in a Limited Partnership",
  },
  {
    value: "judicial-factor",
    label: "Judicial Factor",
  },
  {
    value: "limited-partner-in-a-limited-partnership",
    label: "Limited Partner in a Limited Partnership",
  },
  {
    value: "llp-designated-member",
    label: "LLP Designated Member",
  },
  {
    value: "llp-member",
    label: "LLP Member",
  },
  {
    value: "manager-of-an-eeig",
    label: "Manager of an EEIG",
  },
  {
    value: "managing-officer",
    label: "Managing Officer",
  },
  {
    value: "member-of-a-management-organ",
    label: "Member of a Management Organ",
  },
  {
    value: "member-of-a-supervisory-organ",
    label: "Member of a Supervisory Organ",
  },
  {
    value: "member-of-an-administrative-organ",
    label: "Member of an Administrative Organ",
  },
  {
    value: "nominee-director",
    label: "Nominee Director",
  },
  {
    value: "nominee-secretary",
    label: "Nominee Secretary",
  },
  {
    value: "person-authorised-to-accept",
    label: "Person Authorised to Accept",
  },
  {
    value: "person-authorised-to-represent",
    label: "Person Authorised to Represent",
  },
  {
    value: "person-authorised-to-represent-and-accept",
    label: "Person Authorised to Represent and Accept",
  },
  {
    value: "receiver-and-manager",
    label: "Receiver and Manager",
  },
  {
    value: "secretary",
    label: "Secretary",
  },
];

export enum SORT_OPTIONS {
  NAME = "name",
  RECENTLY = "recent",
}

// eslint-disable-next-line max-len
export const DRAFT_EDITOR_DEFAULT_TEXT =
  '{"blocks":[{"key":"2no8v","text":"Please enter a value","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';

export const DRAFT_EDITOR_EMPTY_TEXT =
  '{"blocks":[{"key":"2no8v","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';

export const TEXT_FOR_NO_CONFLICTS =
  "Each director present confirmed that they had no direct or indirect interest in any way in the business to beconsidered at the meeting, that would require disclosure under section 177 of the Companies Act 2006 and the Company’s articles of association.";

export const TEXT_FOR_CONFLICTS =
  "A notice of declaration of interest by [NAME] dated [DATE] sent to the other directors of the Company under section 184 of the Companies Act 2006; [DESCRIBE NATURE AND EXTENT OF DECLARING DIRECTOR'S INTEREST OR NATURE OF DECLARING DIRECTOR'S CONNECTION WITH SPECIFIED PERSON UNDER S.185(2) COMPANIES ACT 2006] Each other director present confirmed that they had no direct or indirect interest in any way in the business to be considered at the meeting, that would require disclosure under section 177 of the Companies Act 2006 and the Company’s articles of association.";

export const PASSWORD_ERROR_TEXT =
  "Passwords must be at least 8 characters and contain 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character. (The following characters count as special characters: ^ $ * . [ ] { } ( ) ? - \" ! @ # % & / \\ , > < ' : ; | _ ~ ` + =). Non-leading, non-trailing space character is also treated as a special character.";

export const TEXT_FOR_ASK_AI_RISK_MODAL =
  "Let's get started creating a new risk for you. I can help you setup the risk and figure out any details together. Please describe what the Risk is about to get started.";
export const TEXT_FOR_ASK_AI_VISION_MODAL =
  "Let's get started setting up your Vision and Purpose in SEEIO. Can you please provide some details about the vision and purpose your business?";

export const TEXT_FOR_ASK_AI_OBJECTIVE_MODAL =
  "Let's get started setting up your Corporate Objectives in SEEIO. Can you please provide some details about the Corporate Objectives of your business?";

export enum MEETING_AGENDA_STATUS {
  IN_PROGRESS = "in-progress",
  FINALISED = "finalised",
}

export enum MEETING_TYPE {
  BOARD = "board",
  SPECIFIC_BOARD = "specific-board",
  MANAGEMENT = "management",
  INTERIM_BOARD = "interim-board",
  SHAREHOLDER = "shareholder",
  OTHER = "other",
}

export const MEETING_TYPES = [
  {
    label: "Board meeting",
    value: MEETING_TYPE.BOARD,
  },
  {
    label: "Specific issue meeting",
    value: MEETING_TYPE.SPECIFIC_BOARD,
  },
  { label: "Management meeting", value: MEETING_TYPE.MANAGEMENT },
];

export const MEETING_TYPES_OTHER = [
  {
    label: "Board meeting",
    value: MEETING_TYPE.BOARD,
  },
  {
    label: "Specific issue meeting",
    value: MEETING_TYPE.SPECIFIC_BOARD,
  }
];

export enum PROGRESS_UPDATE_STATUS {
  REQUESTED = "Requested",
  COMPLETED = "Completed",
  OVERDUE = "Overdue",
  ABANDONED = "Abandoned",
}

export enum CODES_AND_PASSWORD {
  COMPANY_INFORMATION = "company-information",
  FINANCE_DOC = "finance-doc",
  REGULATION_AND_COMPLIANCE = "regulation-doc",
  OTHERS = "others",
}

export const SYMBOLS = {
  GBP: "£",
  USD: "$",
  EURO: "€",
};

export const LABEL = "label";
export const PERIOD = "period";
export const DATA = "data";
export const BALANCE = "balance";

export enum DATA_ROOM_STEPS {
  DATA_ROOM = "DATAROOM",
  DOCUMENT_LEVEL = "DOCUMENT_LEVEL_DATAROOM",
  VIEW_DOCUMENT = "VIEW_DOCUMENT_DATAROOM",
  ADD_OBJECTIVE = "ADD_OBJECTIVE"
}

export const isProduction = process.env.NODE_ENV === "production" && window.location.toString().includes('secure.seeio.co.uk')

import { TAction, TBreadCrumb } from "@/models";

export const createRouteForAmendmentAction = (record: TAction): {heading?:string , link ?:  string} => {
  switch (record?.recordDetail?.recordType) {
  case 'Risk':
    return {heading:"Risk" , link:`/dashboard/business-health/strategic-risks?riskId=${record?.recordDetail?.id}`};
  case 'Objective':
    return {heading:"Objective" , link:`/dashboard/business-health/corporate-objectives?objectiveId=${record?.recordDetail?.id}`};
  case 'Vision and Mission':
    return {heading:"Vision and Mission" , link:'/dashboard/business-health/vision-purpose'};
  case 'Record Document':
    if (record?.recordDetail?.parentId === record?.recordDetail?.categoryId) {
      return {heading:"Record",link: `/documents/records/${record?.recordDetail?.parentId}/document/${record?.recordDetail?.id}`};
    }
    return {heading:"Record",link:`/documents/records/${record?.recordDetail?.categoryId}/document/${record?.recordDetail?.id}`};

  case 'Register Document':
    return {heading:"Register",link:`/documents/registers/${record?.recordDetail?.parentId}/document/${record?.recordDetail?.id}`};
  case 'Meeting Minutes':
    return {heading:"Minutes",link:`/dashboard/minute-book/${record?.recordDetail?.meetingId}`};
  default:
    return {heading:"Meetings",link:`/dashboard/business-health/strategic-risks?${`objectiveId=25499ab0-7664-4607-8341-aa9fb2b2e113`}`};
  }
}


export const setBreadCrumbsForAmendmentAction = (
  record: TAction
): TBreadCrumb[] => {
  switch (record?.recordDetail?.recordType) {
  case 'Risk':
    return [
      { title: 'Business Health', link: '/dashboard/business-health' },
      {
        title: 'Strategic Risks',
        link: '/dashboard/business-health/strategic-risks',
      },
    ]
  case 'Objective':
    return [
      { title: 'Business Health', link: '/dashboard/business-health' },
      {
        title: 'Corporate Objectives',
        link: '/dashboard/business-health/corporate-objectives',
      },
    ]
  case 'Vision and Mission':
    return [
      { title: 'Business Health', link: '/dashboard/business-health' },
      {
        title: 'Vision Purpose',
        link: '/dashboard/business-health/vision-purpose',
      },
    ]
  case 'Record Document':
    return [
      {
        title: 'Record',
        link: '/documents/records',
      },
      {
        title: `${record?.recordDetail?.docType}`,
        link:
            record?.recordDetail?.parentId === record?.recordDetail?.categoryId
              ? `/documents/records/${record?.recordDetail?.parentId}`
              : `/documents/records/${record?.recordDetail?.categoryId}`,
      },
      {
        title: `${record?.recordDetail?.name}`,
        link:
            record?.recordDetail?.parentId === record?.recordDetail?.categoryId
              ? `/documents/records/${record?.recordDetail?.parentId}/document/${record?.recordDetail?.id}`
              : `/documents/records/${record?.recordDetail?.categoryId}/document/${record?.recordDetail?.id}`,
      },
    ]
  case 'Register Document':
    return [
      { title: 'Register', link: '/documents/registers' },
      {
        title: `${record?.recordDetail?.docType}`,
        link: `/documents/records/${record?.recordDetail?.parentId}`,
      },
      {
        title: `${record?.recordDetail?.name}`,
        link: `/documents/registers/${record?.recordDetail?.parentId}/document/${record?.recordDetail?.id}`,
      },
    ]
  default:
    return [{ title: '' }]
  }
}

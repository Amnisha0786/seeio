import { TBreadCrumb, TGovernanceDetail } from "@/models"

export const createRouteForGovernance = (record: TGovernanceDetail): string => {
  switch (record?.detail?.recordType) {
  case 'Risk':
    return `/dashboard/business-health/strategic-risks`;
  case 'Objective':
    return '/dashboard/business-health/corporate-objectives';
  case 'Vision and Mission':
    return '/dashboard/business-health/vision-purpose';
  case 'Record Document':
    if (record?.detail?.parentId === record?.detail?.categoryId) {
      return `/documents/records/${record?.detail?.parentId}/document/${record?.detail?.id}`;
    }
    return `/documents/records/${record?.detail?.categoryId}/document/${record?.detail?.id}`;

  case 'Register Document':
    return `/documents/registers/${record?.detail?.parentId}/document/${record?.detail?.id}`;
  case 'Action':
    if (record?.detail?.meetingId && record?.detail?.meetingStatus) {
      if (record?.detail?.meetingStatus === "open") {
        return `/dashboard/meeting-and-track-targets/${record?.detail?.meetingId}/status/started`
      } else if (record?.detail?.meetingStatus === "closed") {
        return `/dashboard/meeting-and-track-targets/${record?.detail?.meetingId}/status/ended`
      } else {
        return `/dashboard/meeting-and-track-targets/${record?.detail?.meetingId}/status/planned`
      }
    } else if (record?.detail?.meetingId) {
      return `/dashboard/meeting-and-track-targets/${record?.detail?.meetingId || ''
      }`
    }
    return '/dashboard/meeting-and-track-targets'
  case 'Meeting Minutes':
    return `/dashboard/minute-book/${record?.detail?.meetingId}`;
  case 'Company Annual Review Date':
  case 'Company Review Date':
    return `/settings/company-setup/key-dates`
  default:
    return '';
  }
}

export const setBreadCrumbsForGovernance = (
  record: TGovernanceDetail
): TBreadCrumb[] => {
  switch (record?.detail?.recordType) {
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
        title: `${record.group}`,
        link:
            record?.detail?.parentId === record?.detail?.categoryId
              ? `/documents/records/${record?.detail?.parentId}`
              : `/documents/records/${record?.detail?.categoryId}`,
      },
      {
        title: `${record.itemToReview}`,
        link:
            record?.detail?.parentId === record?.detail?.categoryId
              ? `/documents/records/${record?.detail?.parentId}/document/${record?.detail?.id}`
              : `/documents/records/${record?.detail?.categoryId}/document/${record?.detail?.id}`,
      },
    ]
  case 'Register Document':
    return [
      { title: 'Register', link: '/documents/registers' },
      {
        title: `${record.group}`,
        link: `/documents/registers/${record?.detail?.parentId}`,
      },
      {
        title: `${record.itemToReview}`,
        link: `/documents/registers/${record?.detail?.parentId}/document/${record?.detail?.id}`,
      },
    ]
  case 'Action':
    return [
      {
        title: 'Action',
        link: record?.detail?.meetingId
          ? `/dashboard/meeting-and-track-targets/${record?.detail?.meetingId || ''
          }`
          : `/dashboard/meeting-and-track-targets`,
      },
    ]
  default:
    return [{ title: '' }]
  }
}

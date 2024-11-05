import React from 'react'

import { TMeetingDetails, TMeetingDetailsTopic } from '@/models'

interface IMeetingDetailsContext {
  readonly meetingDetails: TMeetingDetails | null;
  readonly deleting: boolean;
  readonly setMeetingDetails: (meetingDetails: TMeetingDetails) => void
  readonly loadMeetingDetails: () => Promise<any>
  readonly updateTopic: (topic: TMeetingDetailsTopic, values: any) => Promise<any>
  readonly deleteTopic: (topic: TMeetingDetailsTopic, callback?: () => void) => Promise<any>
}

export const MeetingDetailsContext = React.createContext<IMeetingDetailsContext>({
  meetingDetails: null,
  deleting: false,
  setMeetingDetails: (meetingDetails: TMeetingDetails) => meetingDetails,
  loadMeetingDetails: async () => null,
  updateTopic: async () => null,
  deleteTopic: async () => null
});

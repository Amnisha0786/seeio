import * as yup from 'yup'
import { TOPIC_TYPE } from './form-modal-types'


export enum MeetingMinuteStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  APPROVED_WITH_AMENDMENTS = 'approved-with-ammendments'
}

export const preMeetingSchema = yup.object({
  timeAlloted: yup.number().optional(),
  notes: yup.string().optional(),
  documents: yup.array().of(yup.string()).optional(),
})

export const additionalItemSchema = yup.object({
  topic: yup.string().optional(),
  presenter: yup.string().optional(),
  notes: yup.string().optional(),
})

export const riskRegisterSchema = yup.object({
  presenter: yup.string().optional(),
  minutes: yup.string().optional(),
  preMeetingSchema,
})

export const additionalInformationItemSchema = yup.object({
  additionalInformationItem: yup.array().of(additionalItemSchema).optional(),
  minutes: yup.string().optional(),
  preMeetingSchema,
})

export const chairsIntroductionSchema = yup.object({
  meetingChair: yup.string().optional(),
  meetingIsQuorate: yup.boolean().optional(),
  minutes: yup.string().optional(),
  preMeetingSchema,
})

export const attendeesSchema = yup.object({
  anyConflictsOfInterest: yup.boolean().optional(),
  methodOfManagingConflict: yup
    .mixed()
    .oneOf([
      'Articles Permit Voting',
      'Did Not Vote Or Form Part Of Quorum',
      'Rescue From Meeting',
    ])
    .optional(),
  details: yup.string().optional(),
  minutes: yup.string().optional(),
  preMeetingSchema,
})

export const previousMinutesSchema = yup.object({
  previousMinutes: yup
    .array()
    .of(
      yup.object({
        name: yup.string().optional(),
        description: yup.string().optional(),
        status: yup
          .mixed()
          .oneOf([
            'Approval',
            'Approved with Amendments',
            'Approved',
            'Pending',
          ])
          .optional(),
      })
    )
    .optional(),
  preMeetingSchema,
})

export const additionalOpeningItemSchema = yup.object({
  additionalOpeningItem: yup.array().of(additionalItemSchema).optional(),
  minutes: yup.string().optional(),
  preMeetingSchema,
})

export const progressActionSchema = yup.object({
  newNotes: yup.string().optional(),
  minutes: yup.string().optional(),
  preMeetingSchema,
})

export const riskReviewSchema = yup.object({
  presenter: yup.string().optional(),
  minutes: yup.string().optional(),
  risks: yup.array().of(
    yup.object({
      id: yup.string().optional(),
      description: yup.string().optional(),
      name: yup.string().optional(),
      nextReview: yup.string().optional(),
      riskType: yup.string().optional(),
      status: yup
        .string()
        .oneOf(['not-approved', 'approved', 'approved-with-amendments'])
        .optional(),
    })
  ),
  preMeetingSchema,
})

export const horizonPlanningSchema = yup.object({
  presenter: yup.string().optional(),
  minutes: yup.string().optional(),
  preMeetingSchema,
})

export const progressAgainstObjectivesSchema = yup.object({
  presenter: yup.string().optional(),
  minutes: yup.string().optional(),
  preMeetingSchema,
})

export const financeOperationsSchema = yup.object({
  presenter: yup.string().optional(),
  minutes: yup.string().optional(),
  preMeetingSchema,
})

export const additionalDiscussionSchema = yup.object({
  additionalDiscussionItem: yup.array().of(additionalItemSchema).optional(),
  minutes: yup.string().optional(),
  preMeetingSchema,
})

export const reviewOrApprovalSchema = yup.object({
  forReviewOrApproval: yup
    .array()
    .of(
      yup.object({
        topic: yup.string().optional(),
        presenter: yup.string().optional(),
        notes: yup.string().optional(),
        meetingIsQuorate: yup
          .mixed()
          .oneOf([
            'Approved',
            'Approved with Amendments',
            'Did not approved/resolved',
          ])
          .optional(),
      })
    )
    .optional(),
  minutes: yup.string().optional(),
  preMeetingSchema,
})

export const dateOfNextMeetingSchema = yup.object({
  dateOfNextMeeting: yup.date().optional(),
  minutes: yup.string().optional(),
  preMeetingSchema,
})

export const additionalAobSchema = yup.object({
  additionalAobItem: yup.array().of(additionalItemSchema).optional(),
  minutes: yup.string().optional(),
  preMeetingSchema,
})

export const actionsFromMeetingSchema = yup.object({
  actionsFromMeeting: yup
    .array()
    .of(
      yup.object({
        name: yup.string().optional(),
        dueDate: yup.date().optional(),
        owner: yup.string().optional(),
        notes: yup.string().optional(),
      })
    )
    .optional(),
  minutes: yup.string().optional(),
  preMeetingSchema,
})

export const updateAttributeTopicMapSchema: any = {
  [TOPIC_TYPE.CHAIR_INTRODUCTION]: chairsIntroductionSchema,
  [TOPIC_TYPE.ATTENDEES]: attendeesSchema,
  [TOPIC_TYPE.APPROVAL]: previousMinutesSchema,
  [TOPIC_TYPE.ADDITIONAL_OPENING]: additionalOpeningItemSchema,
  [TOPIC_TYPE.RISKS]: riskReviewSchema,
  [TOPIC_TYPE.HORIZON_PLANNING]: horizonPlanningSchema,
  [TOPIC_TYPE.PROGRESS]: progressAgainstObjectivesSchema,
  [TOPIC_TYPE.NEXT_MEETING]: dateOfNextMeetingSchema,
  [TOPIC_TYPE.ADDITIONAL_AOB]: additionalAobSchema,
  [TOPIC_TYPE.ACTIONS]: actionsFromMeetingSchema,
  [TOPIC_TYPE.REVIEW_APPROVAL]: reviewOrApprovalSchema,
  [TOPIC_TYPE.PROGRESS_ACTIONS]: progressActionSchema,
  [TOPIC_TYPE.FINANCE]: financeOperationsSchema,
  [TOPIC_TYPE.ADDITIONAL_DISCUSSION]: additionalDiscussionSchema,
}

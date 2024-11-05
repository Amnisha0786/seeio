import { TOPIC_TYPE } from './form-modal-types'

export const getUpdateAttributes = (topic: any) => {
  const sharedValues = {
    timeAlloted: topic?.timeAlloted,
    notes: topic?.notes,
    documents: topic?.documents,
  }
  let updateAttributes
  switch (topic.topicType) {
  case TOPIC_TYPE.CHAIR_INTRODUCTION:
    updateAttributes = {
      meetingChair: topic?.meetingChair,
      meetingIsQuorate: topic?.meetingIsQuorate,
      minutes: topic?.meetingIsQuorate,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.ATTENDEES:
    updateAttributes = {
      attendees: topic?.attendees,
      anyConflictsOfInterest: topic?.anyConflictsOfInterest,
      methodOfManagingConflict: topic?.methodOfManagingConflict,
      details: topic?.details,
      minutes: Array.isArray(topic?.minutes) ? topic.minutes?.[0]?.description : topic?.minutes,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.APPROVAL:
    updateAttributes = {
      minutes: topic?.minutes,
      topicAmendments : topic?.topicAmendments,
      topicOwner: topic?.topicOwner,
      topicStatus: topic?.topicStatus,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.ADDITIONAL_OPENING:
    updateAttributes = {
      additionalOpeningItem: topic?.additionalOpeningItem,
      topic: topic?.topic,
      presenter: topic?.presenter,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.RISKS:
    updateAttributes = {
      presenter: topic?.presenter,
      minutes: Array.isArray(topic?.minutes) ? topic.minutes?.[0]?.description : topic?.minutes,
      discussion: topic?.discussion,
      risks: topic?.risks,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.HORIZON_PLANNING:
    updateAttributes = {
      presenter: topic?.presenter,
      discussion: topic?.discussion,
      minutes: topic?.minutes,
      horizons: topic?.horizons,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.PROGRESS:
    updateAttributes = {
      presenter: topic?.presenter,
      discussion: topic?.discussion,
      minutes: Array.isArray(topic?.minutes) ? topic.minutes?.[0]?.description : topic?.minutes,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.NEXT_MEETING:
    updateAttributes = {
      dateOfNextMeeting: topic?.dateOfNextMeeting,
      location: topic?.location,
      minutes: topic?.minutes,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.ADDITIONAL_AOB:
    updateAttributes = {
      topic: topic?.topic,
      presenter: topic?.presenter,
      additionalAobItem: topic?.additionalAobItem,
      minutes: topic?.minutes,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.ACTIONS:
    updateAttributes = {
      agenda: topic?.agenda,
      dueDate: topic?.dueDate,
      owner: topic?.owner,
      actionsFromMeeting: topic?.actionsFromMeeting,
      minutes: topic?.minutes,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.REVIEW_APPROVAL:
  case TOPIC_TYPE.OBJECTIVE_APPROVAL:
  case TOPIC_TYPE.RECORD_APPROVAL:
  case TOPIC_TYPE.REGISTER_APPROVAL:
    updateAttributes = {
      topicName: topic?.topicName,
      registers: topic?.registers,
      records: topic?.records,
      objectives: topic?.objectives,
      topic: topic?.topic,
      presenter: topic?.presenter,
      forReviewOrApproval: topic?.forReviewOrApproval,
      minutes: topic?.minutes,
      discussion: topic?.discussion,
      meetingIsQuorate: topic?.meetingIsQuorate,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.PROGRESS_ACTIONS:
    updateAttributes = {
      newNotes: topic?.newNotes,
      minutes: Array.isArray(topic?.minutes) ? topic.minutes?.[0]?.description : topic?.minutes,
      discussion: topic?.discussion,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.FINANCE:
    updateAttributes = {
      presenter: topic?.presenter,
      discussion: topic?.discussion,
      minutes: topic?.minutes,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.RISK_REGISTER:
    updateAttributes = {
      topic: topic?.topic,
      presenter: topic?.presenter,
      discussion: topic?.discussion,
      minutes: topic?.minutes,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.COMPLAINT_INCIDENT:
    updateAttributes = {
      topic: topic?.topic,
      presenter: topic?.presenter,
      minutes: Array.isArray(topic?.minutes) ? topic.minutes?.[0]?.description : topic?.minutes,
      discussion: topic?.discussion,
      ...sharedValues,
    }
    break
  case TOPIC_TYPE.ADDITIONAL_INFORMATION:
    updateAttributes = {
      topic: topic?.topic,
      presenter: topic?.presenter,
      discussion: topic?.discussion,
      minutes:Array.isArray(topic?.minutes) ? topic.minutes?.[0]?.description : topic?.minutes,
      ...sharedValues,
    }
    break

  case TOPIC_TYPE.ADDITIONAL_DISCUSSION:
    updateAttributes = {
      presenter: topic?.presenter,
      discussion: topic?.discussion,
      additionalDiscussionItem: topic?.additionalDiscussionItem,
      minutes: topic?.minutes,
      ...sharedValues,
    }
    break

  case TOPIC_TYPE.ADDITIONAL_TOPIC:
    updateAttributes = {
      topicName: topic?.topicName,
      presenter: topic?.presenter,
      minutes: Array.isArray(topic?.minutes) ? topic.minutes?.[0]?.description : topic?.minutes,
      discussion: topic?.discussion,
      topicStatus : topic?.topicStatus,
      ...sharedValues,
    }
    break

  default:
    updateAttributes = {
      ...sharedValues,
    }
    break
  }

  return updateAttributes
}

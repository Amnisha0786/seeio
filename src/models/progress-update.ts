export type TProgressUpdate = {
  id: string,
  objectiveId: string,
  objectiveName: string,
  deadline: string,
  lastEdited: string,
  status: string,
  keyIndicatorName: string,
  metricId: string,
  ownerId: string,
  companyId: string,
  requestedDate: string,
  owner: {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
  }
}

export type TProgressUpdateDetails = {
  companyId: string,
  status: string,
  specificNeeds: string,
  currentWork: string,
  metricType: string,
  ownerEmail: string,
  ownerId: string,
  progressSummary: string,
  deadline: string,
  objectiveName: string,
  achievements: string,
  lastEdited: string,
  keyIndicatorName: string,
  obstaclesPreventingProgress: string,
  objectiveDescription: string
  keyIndicatorDescription: string
  notesToOwner?: string
  id: string,
  outlook: string,
  quantitiveMetric: {
    valueAchieved: string,
    units: string
  },
  objectiveId: string,
  dateRequested: string,
  requestedDate: string,
  owner: {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string
  }
}

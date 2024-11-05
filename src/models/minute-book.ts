export type TMinuteBook = {
  meetingId: string
  dateCreated: string
  status: string
  meeting: {
    id: string;
    name: string;
  }
}

export type TMinuteBookDetails = {
  id: string,
  meetingId: string
  dateCreated: string
  status: string
  fileUrl: string
  fileType: string
  fileSize: number
  meeting: {
    id: string;
    name: string;
  }
}

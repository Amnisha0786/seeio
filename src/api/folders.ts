import decamelizeKeys from 'decamelize-keys'
import { MainApi } from './endpoint'

type TAddAFolderPayload = {
  companyId?: string
  dataroomId?: string
  parentId?: string
  folderName: string
  folderDescription: string
  needsReview: boolean
}

export const addAFolder = (payload: TAddAFolderPayload): Promise<any> => {
  return MainApi.post(`/company/${payload.companyId}/dataroom/${payload.dataroomId}/folder`, decamelizeKeys({
    parent_id: payload.parentId,
    name: payload.folderName,
    description: payload.folderDescription,
  }))
}

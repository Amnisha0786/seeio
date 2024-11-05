import { ExternalApi } from './endpoint'

type TFile = {
  presignUrl: string,
  file: File | ArrayBuffer | undefined
}

export const uploadFiles = ({ files }: { files: TFile[] }): Promise<any> => new Promise(async (resolve, reject) => {
  try {
    const promiseArray: Promise<any>[] = []
    files.forEach(async (item) => {
      promiseArray.push(ExternalApi.put(item.presignUrl, item.file))
    })
    await Promise.all(promiseArray)

    resolve(true)
  } catch (e) {
    reject(e)
  }
})

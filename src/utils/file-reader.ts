export const isFile = (file: File): boolean => !!(file?.name && file?.size && file?.type)

export const getBase64 = (file: File): Promise<string | ArrayBuffer | null> => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => resolve(reader.result)
  reader.onerror = (error) => reject(error)
})

export const openDownloadDialog = (
  { url, data, filename }: { url?: string, data?: ArrayBuffer, filename: string }
): void => {
  const downloadUrl: any = url || data
  const a = document.createElement('a')

  if (typeof a.download === 'undefined') {
    window.location = downloadUrl
  } else {
    a.href = downloadUrl
    a.target = "__blank"
    a.download = filename
    document.body.appendChild(a)
    a.click()
  }

  document.body.removeChild(a)
}

export const openUploadDialog = (fileType?: string): Promise<FileList> => {
  return new Promise<FileList>((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = fileType || '*.json'
    input.onchange = (e: any) => {
      resolve(e.target.files as FileList)
      document.body.removeChild(input)
    }
    document.body.appendChild(input)
    input.click()
  })
}
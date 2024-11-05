import Space from '@/components/space'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import { openDownloadDialog } from '@/utils/file-reader'

interface IProps {
  url: string
  filename?: string
}

const DownloadFileView = ({
  url,
  filename
}: IProps): JSX.Element => {
  const onDownload = () => {
    openDownloadDialog({
      url,
      filename: filename || "downloaded-file"
    })

  }

  return (
    <FlexBox flexDirection="column" alignItems="center">
      <Space size={100} />
      <Typography size="huge">Preview not Available</Typography>
      <Space size={16} />
      <Typography size="large" gray>The document is not a pdf</Typography>
      <Space size={16} />
      <Button type="primary" onClick={onDownload}>Download</Button>
      <Space size={100} />
    </FlexBox>
  )
}

export default DownloadFileView

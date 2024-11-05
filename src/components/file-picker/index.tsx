import { useState, useEffect } from 'react'
import classnames from 'classnames'
import { Upload } from 'antd'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

import FlexBox from '@/components/flex-box'
import Typography from '@/components/typography'
import Space from '@/components/space'
import styles from './file-picker.module.scss'

const { Dragger } = Upload

interface IProps {
  className?: string
  onChange?: (files: UploadFile[]) => void
  files?: UploadFile[]
  accept?: string
}

const FilePicker = ({ className, onChange, files, accept }: IProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (files) setFileList(files)
  }, [files])

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      if (!files) setFileList(newFileList);
      onChange?.(newFileList)
    },
    beforeUpload: (file) => {
      const newFileList = [...fileList, file]
      if (!files) setFileList(newFileList);
      onChange?.(newFileList)

      return false;
    },
    fileList,
  };

  return (
    <FlexBox className={classnames(styles.filePicker, className)} alignItems="center">
      <Dragger {...props} multiple={false} accept={accept} >
        <FlexBox alignItems="center">
          <FlexBox justifyContent="center" alignItems="center" className={styles.uploadDrag}>
            <Typography size="large" gray>Drop file here</Typography>
          </FlexBox>
          <Space horizontal size={20} />
          <Typography size="large" gray>or</Typography>
          <Space horizontal size={20} />
          <FlexBox justifyContent="center" alignItems="center" className={styles.uploadButton}>
            <Typography size="large">Upload</Typography>
          </FlexBox>
        </FlexBox>
      </Dragger>
    </FlexBox>
  )
}

export default FilePicker

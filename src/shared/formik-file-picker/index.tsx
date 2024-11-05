import { useState, useEffect } from 'react'
import classnames from 'classnames'
import { Upload } from 'antd'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import FlexBox from '@/components/flex-box'
import Typography from '@/components/typography'
import Space from '@/components/space'
import styles from './file-picker.module.scss'
import Toast from '@/components/toast';

const { Dragger } = Upload

interface IProps {
  form?: any;
  className?: string;
  fileKeyName?: string;
  fileBinaryKeyName?: string;
  error?: string;
  resetError?: () => void;
  onChange?: (files: UploadFile[]) => void;
  value?: string;
  maxFileCount?: number
}

const FormikFilePicker = ({
  className,
  onChange,
  form,
  resetError,
  fileBinaryKeyName = "fileBinary",
  fileKeyName = "additionalFileNames",
  error,
  value,
  maxFileCount = 1
}: IProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      onChange?.(newFileList)
      if (fileKeyName === "fileName") {
        form?.setFieldValue(fileKeyName, "");
        form?.setFieldValue(fileBinaryKeyName, null);

      } else {
        if (newFileList.length !== -1) {
          const currentFileNames = form.values[fileKeyName] || [];
          const currentBinaryData = form.values[fileBinaryKeyName] || [];

          const indexToRemove = currentFileNames.indexOf(file.name);
          const updatedFileNames = [...currentFileNames];
          const updatedBinaryData = [...currentBinaryData];

          updatedFileNames.splice(indexToRemove, 1);
          updatedBinaryData.splice(indexToRemove, 1);

          form.setFieldValue(fileKeyName, updatedFileNames);
          form.setFieldValue(fileBinaryKeyName, updatedBinaryData);
        } else {
          form?.setFieldValue(fileKeyName, []);
          form?.setFieldValue(fileBinaryKeyName, []);
        }
      }

    },
    beforeUpload: (file: RcFile, files: RcFile[]) => {
      let newFileList = [...fileList, ...files];

      if (maxFileCount === 1) {
        newFileList = [file];
      } else if (newFileList?.length > maxFileCount) {
        Toast.warning(`You can only upload ${maxFileCount} files.`);
        return false;
      }

      if (resetError) {
        resetError();
      }
      setFileList(newFileList);
      onChange?.(newFileList)


      if (fileKeyName === "fileName") {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
          form.setFieldValue(fileKeyName, file.name);
          form.setFieldValue(fileBinaryKeyName, reader.result);

        };
      }
      else {
        const filePromises = newFileList?.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file as File);
            reader.onload = (event) => {
              const binaryData = event.target?.result;
              if (binaryData) {
                resolve({ name: file.name, data: binaryData });
              } else {
                reject(new Error("Failed to read file."));
              }
            };
            reader.onerror = () => {
              reject(new Error("Failed to read file."));
            };
          });
        });

        Promise.all(filePromises)
          .then(fileDataArray => {
            const additionalFileNames = fileDataArray.map((fileData: any) => fileData.name);
            const additionalBinaryData = fileDataArray.map((fileData: any) => fileData.data);
            form.setFieldValue(fileKeyName, additionalFileNames);
            form.setFieldValue(fileBinaryKeyName, additionalBinaryData);
          })
          .catch(error => {
            Toast.error(error?.message || "Failed to process files.");
          });
      }

      if (resetError) {
        resetError();
      }

      return false;
    },
    fileList,
  };

  useEffect(() => {
    if (value?.length === 0 || !value) {
      setFileList([]);
    }
  }, [value]);

  return (
    <FlexBox className={classnames(styles.filePicker, className)} alignItems="center">
      <Dragger {...props} multiple={maxFileCount > 1 ? true : false} maxCount={maxFileCount}>
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
        {error && (
          <>
            <Space size={5} />
            <Typography size="small" red style={{ textAlign: "left" }}>
              {error}
            </Typography>
          </>
        )}
      </Dragger>
    </FlexBox>
  )
}

export default FormikFilePicker

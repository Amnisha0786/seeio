import React, { useEffect } from 'react'
import { Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import FlexBox from '@/components/flex-box'
import styles from './page.module.scss'
import Button from '@/components/button'
import Space from '@/components/space'
import Field from '@/components/field'


type TProps = {
  formik: any,
  handleChange: (key: string, value: any) => void
}

const AddDataRoomStep1 = ({ formik }: TProps) => {


  return (
    <div>
      <Space size={24} />
      <FlexBox alignItems='center' gap={10}>
        <span className={styles.barActive}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </FlexBox>
      <Space size={24} />

      <FlexBox flexDirection="column" flex={1}>
        <Field label="Data Room Name" errorMessage={formik?.errors?.name as string}>
          <Input
            className={styles.inputField}
            name="name"
            id='name'
            size="large"
            placeholder="Enter here"
            onChange={formik?.handleChange}
            value={formik?.values?.name}
            status={formik?.errors?.name && "error"}
          />
        </Field>
      </FlexBox>
      <Space size={24} />

      <FlexBox flexDirection="column" flex={1}>
        <Field label="Data Room Description" errorMessage={formik?.errors?.description as string}>
          <TextArea
            className={styles.inputField}
            name="description"
            size="large"
            placeholder="Enter here"
            onChange={formik?.handleChange}
            value={formik?.values?.description}
            status={formik?.errors?.description && "error"}
          />
        </Field>
      </FlexBox>
      <Space size={24} />

      <FlexBox justifyContent='flex-end'>
        <Button className={styles.formButton} onClick={() => {
          formik.handleSubmit()
        }}>Next</Button>
      </FlexBox>
    </div>
  )
}

export default AddDataRoomStep1;

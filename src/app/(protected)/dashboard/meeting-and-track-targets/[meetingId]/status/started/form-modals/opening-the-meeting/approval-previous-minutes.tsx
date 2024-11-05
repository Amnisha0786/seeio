import { forwardRef } from 'react'
import dayjs from 'dayjs'
import TextArea from 'antd/es/input/TextArea'
import { Col, Radio, Row } from 'antd'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Typography from '@/components/typography'
import Field from '@/components/field'
import styles from '../../page.module.scss'
import { MeetingMinuteStatus } from '../form-modal-validation-schemas'
import { TMinutes } from '@/models'
import PeopleSelect from '@/shared/people-select'


const ApprovalPreviousForm = forwardRef(({ formik }: any, ref) => {
  const { minutes } = formik.values

  return (
    <div>
      {minutes && minutes?.length > 0 && minutes?.map((minute: TMinutes, index: number) => (
        <>
          <div className={styles.padding} key={index}>
            <FlexBox justifyContent='space-between'>
              <Typography size='large' className={styles.bolder}>
                {`Meeting dated ${minute?.meeting?.date ? dayjs(minute?.meeting?.date).format("DD/MM/YYYY") : "- -"}`}
              </Typography>
            </FlexBox>
            <Space size={18} />
            <FlexBox justifyContent='space-between'>
              <Field>
                <Radio.Group
                  name={`minutes[${index}].topicStatus`}
                  onChange={formik.handleChange}
                  value={Array.isArray(minutes) ? minutes?.[index]?.topicStatus : minutes }
                  defaultValue={MeetingMinuteStatus.PENDING}
                >
                  <Radio value={MeetingMinuteStatus.APPROVED}>Approve</Radio>
                  <Radio value={MeetingMinuteStatus.APPROVED_WITH_AMENDMENTS}>Approve With Amendments</Radio>
                </Radio.Group>
              </Field>
              
            </FlexBox>
            {(minutes?.[index]?.topicStatus === MeetingMinuteStatus.APPROVED_WITH_AMENDMENTS) &&
              <>
                <Space size={18} />
                <Row gutter={[30, 0]}>
                  <Col span={12}>
                    <FlexBox flexDirection='column'>
                      <Field label='Owner'>
                        <PeopleSelect
                          size='large'
                          allowClear
                          placeholder='Select'
                          onChange={(value) => formik.setFieldValue(`minutes[${index}].topicOwner`, value)}
                          value={minutes[index]?.topicOwner}
                        />
                      </Field>
                    </FlexBox>
                  </Col>
                </Row>
                <Space size={18} />
                <FlexBox flexDirection='column' flex={1}>
                  <Field label='Description of amendments'>
                    <TextArea
                      rows={4}
                      name={`minutes[${index}].topicAmendments`}
                      size='large'
                      placeholder='Enter here'
                      onChange={formik.handleChange}
                      value={minutes[index]?.topicAmendments}
                    />
                  </Field>
                </FlexBox>
              </>
            }
          </div>
          <Space size={16} />
        </>
      ))}
    </div>
  )
})
ApprovalPreviousForm.displayName = 'ApprovalPreviousForm'

export default ApprovalPreviousForm

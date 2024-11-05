"use client"

import { useCallback, useEffect, useState } from 'react'
import { Row, Col, Input, Select } from 'antd'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import * as yup from 'yup'

import ScollablePage from '@/components/scollable-page'
import Container from '@/components/container'
import Space from '@/components/space'
import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import Field from '@/components/field'
import BreadCrumbs from '@/components/breadcrumbs'
import Typography from '@/components/typography'
import Card from '@/components/card'
import * as API from "@/api";
import styles from './page.module.scss'
import { useSelectedAccountCompany } from '@/hooks'
import Loading from '@/components/loading'
import { TProgressUpdateDetails } from '@/models'
import Toast from '@/components/toast'
import { PROGRESS_UPDATE_STATUS } from '@/constants'

enum ProgressUpdateStatus {
  REQUESTED = 'requested',
  COMPLETED = 'completed',
  REVISION = "revision"
}

type TForm = {
  progressSummary: string
  achievements: string
  currentWork: string
  outlook: string
  obstaclesPreventingProgress: string
  specificNeeds: string
  quantitiveMetric: {
    valueAchieved: string
    units: string
  }
  notesToOwner?: string
  status?: string
}


const OPTIONS = [{
  label: "Ahead of schedule",
  value: "Ahead of schedule"
}, {
  label: "On track",
  value: "On track"
}, {
  label: "Marginally behind",
  value: "Marginally behind"
}, {
  label: "Seriously behind",
  value: "Seriously behind"
}]

const validationSchema = yup.object().shape({
  progressSummary: yup.string().required("Progress Summary is required."),
})

const Page = ({ params: { progressUpdateId, objectiveId } }: { params: { progressUpdateId: string, objectiveId: string } }) => {
  const [initing, setIniting] = useState(false);
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState<TProgressUpdateDetails | null>(null);
  const [completing, setCompleting] = useState(false)
  const [revising, setRevising] = useState(false)

  const companyId = useSelectedAccountCompany()?.companyId
  const router = useRouter()

  const fetchData = useCallback(async () => {
    if (!companyId) return
    setIniting(true);

    try {
      const result = await API.getProgressUpdateDetails({
        companyId,
        objectiveId,
        updateId: progressUpdateId
      });
      setData(result);
    } finally {
      setIniting(false);
    }
  }, [objectiveId, companyId, progressUpdateId]);

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line
  }, []);


  const formik = useFormik<TForm>({
    enableReinitialize: true,
    validateOnChange: true,
    validationSchema,
    initialValues: {
      progressSummary: data?.progressSummary || "On track",
      quantitiveMetric: { valueAchieved: data?.quantitiveMetric?.valueAchieved || "", units: data?.quantitiveMetric?.units || "" },
      achievements: data?.achievements || "",
      currentWork: data?.currentWork || "",
      outlook: data?.outlook || "",
      obstaclesPreventingProgress: data?.obstaclesPreventingProgress || "",
      specificNeeds: data?.specificNeeds || "",
      notesToOwner: data?.notesToOwner || "",
    },
    onSubmit: async (values) => {
      try {
        if (!companyId) return
        if (!values.status) {
          setSubmitting(true)
        }
        await API.saveProgressUpdateDetails({
          companyId,
          objectiveId,
          updateId: progressUpdateId,
          ...values
        });
        Toast.success("updated successfully!")
      } catch (error: any) {
        Toast.error(error?.message || "Something went wrong.")
      } finally {
        fetchData()
        router.push(`/dashboard/progress-updates/${objectiveId}/${progressUpdateId}`)
        setSubmitting(false)
        setCompleting(false)
        setRevising(revising)
      }
    }
  });

  const handleSaveComplete = (status: string) => {
    if (Object.keys(formik?.errors)?.length == 0) {
      if (status === ProgressUpdateStatus.COMPLETED) {
        formik.setFieldValue('status', status)
        setCompleting(true)
      } else {
        formik.setFieldValue('status', ProgressUpdateStatus.REQUESTED)
        formik.setFieldValue('sendEmail', status)
        setRevising(true)
      }
      formik.handleSubmit()
    }
  }

  if (initing) return <Loading size='small' />
  if (!data) return null;

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <FlexBox alignItems='center' justifyContent='space-between'>
          <BreadCrumbs
            items={[{
              title: "Progress update",
              link: '/dashboard/progress-updates/'
            }, {
              title: data?.keyIndicatorName || "Progress update form"
            }]}
          />
          {data.status === PROGRESS_UPDATE_STATUS.COMPLETED && <Button
            type="primary"
            loading={revising}
            onClick={() => handleSaveComplete(ProgressUpdateStatus.REVISION)}

          >
            Send for revision
          </Button>}
        </FlexBox>
        <Space size={24} />
        <Card>
          <FlexBox justifyContent="space-between" alignItems="center">
            <Typography size="huge">Edit Updates</Typography>
            <FlexBox flexDirection="column" alignItems="flex-end">
              <Typography>
                {data?.dateRequested ? dayjs(data?.dateRequested).format("DD/MM/YYYY") : "-"}
              </Typography>
            </FlexBox>
          </FlexBox>

          <Space size={24} />
          <FlexBox className={styles.sectionGroup} flexDirection="column">
            <Typography size="huge" bold>
              Objective
            </Typography>
            <Space size={16} />
            <FlexBox flexDirection="column">
              <Typography color="#00293F" serif>
                Name
              </Typography>
              <Space size={8} />
              <Typography serif size='big'>
                {data.objectiveName}
              </Typography>
            </FlexBox>
            <Space size={10} />
            <FlexBox flexDirection="column">
              <Typography color="#00293F" serif>
                Description
              </Typography>
              <Space size={8} />
              <Typography serif size='big'>
                {data?.objectiveDescription}
              </Typography>
            </FlexBox>
          </FlexBox>
          <Space size={24} />

          <FlexBox className={styles.sectionGroup} flexDirection="column">
            <Typography size="huge" bold>
              Key Indicator
            </Typography>
            <Space size={16} />
            <FlexBox flexDirection="column">
              <Typography color="#00293F" serif>
                Indicator Name
              </Typography>
              <Space size={8} />
              <Typography serif size='big'>
                {data?.keyIndicatorName}
              </Typography>
            </FlexBox>
            <Space size={10} />
            <FlexBox flexDirection="column">
              <Typography color="#00293F" serif>
                Indicator Description
              </Typography>
              <Space size={8} />
              <Typography serif size='big'>
                {data?.keyIndicatorDescription}
              </Typography>
            </FlexBox>
          </FlexBox>

          <Space size={24} />
          <Row gutter={[30, 0]}>
            <Col span={8}>
              <Field label="Progress summary" errorMessage={formik.errors.progressSummary}>
                <Select
                  size="large"
                  placeholder="Select"
                  allowClear
                  options={OPTIONS}
                  onChange={(value) => formik.setFieldValue("progressSummary", value)}
                  value={formik.values.progressSummary}
                  status={formik.errors.progressSummary && "error"}
                />
              </Field>
            </Col>
          </Row>
          <Space size={24} />
          <FlexBox flexDirection="column" className={styles.sectionGroup}>
            <Typography size="huge" bold>
              Quantitive metrics
            </Typography>
            <Space size={16} />
            <Row gutter={[30, 0]}>
              <Col span={8}>
                <Field label="Value achieved">
                  <Input
                    name="quantitiveMetric.valueAchieved"
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.quantitiveMetric.valueAchieved}
                  />
                </Field>
              </Col>
              <Col span={8}>
                <Field label="Units">
                  <Input
                    name="quantitiveMetric.units"
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.quantitiveMetric.units}
                  />
                </Field>
              </Col>
            </Row>
          </FlexBox>
          <Space size={24} />
          <Field label="Achievements">
            <TextArea
              rows={4}
              name={'achievements'}
              size="large"
              placeholder="Enter here"
              onChange={formik.handleChange}
              value={formik.values.achievements}
            />

          </Field>
          <Space size={24} />
          <Field label="Current work">
            <TextArea
              rows={4}
              name={'currentWork'}
              size="large"
              placeholder="Enter here"
              onChange={formik.handleChange}
              value={formik.values.currentWork}
            />
          </Field>
          <Space size={24} />
          <Field label="Outlook">
            <TextArea
              rows={4}
              name={`outlook`}
              size="large"
              placeholder="Enter here"
              onChange={formik.handleChange}
              value={formik.values.outlook}
            />
          </Field>
          <Space size={24} />
          <Field label="Obstacles preventing progress">
            <TextArea
              rows={4}
              name={'obstaclesPreventingProgress'}
              size="large"
              placeholder="Enter here"
              onChange={formik.handleChange}
              value={formik.values.obstaclesPreventingProgress}
            />
          </Field>
          <Space size={24} />
          <Field label="Specific needs/ Board decisions sought">
            <TextArea
              rows={4}
              name={'specificNeeds'}
              size="large"
              placeholder="Enter here"
              onChange={formik.handleChange}
              value={formik.values.specificNeeds}
            />
          </Field>
          <Space size={24} />
          <Field label="Notes to owner">
            <TextArea
              rows={4}
              name={'notesToOwner'}
              size="large"
              placeholder="Enter here"
              onChange={formik.handleChange}
              value={formik.values.notesToOwner}
            />
          </Field>
          <Space size={24} />
        </Card>
        <Space size={24} />
        <FlexBox justifyContent="flex-end">
          <Button
            type="primary"
            onClick={() => formik.handleSubmit()}
            loading={submitting}
          >
            Save
          </Button>
          <Space horizontal size={15} />
          <Button
            onClick={() => handleSaveComplete(ProgressUpdateStatus.COMPLETED)}
            loading={completing}
          >
            Save and complete
          </Button>
        </FlexBox>
      </Container>
      <Space size={50} />
    </ScollablePage>
  )
}

export default Page

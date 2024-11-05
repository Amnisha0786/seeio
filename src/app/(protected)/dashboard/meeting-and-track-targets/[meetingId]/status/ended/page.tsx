'use client'

import {
  useContext,
  Fragment,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'

import * as API from '@/api'
import Space from '@/components/space'
import Typography from '@/components/typography'
import Clickable from '@/components/clickable'
import Button from '@/components/button'
import Icon from '@/components/icon'
import FlexBox from '@/components/flex-box'
import { MeetingDetailsContext } from '../../context'
import styles from './page.module.scss'
import { useBreadcrumbs, useSelectedAccountCompany } from '@/hooks'
import Toast from '@/components/toast'
import Loading from '@/components/loading'
import { TAction, TBreadCrumb } from '@/models'
import DocumentPreviewModal from '@/shared/document-preview-modal'
import { createRouteForAmendmentAction, setBreadCrumbsForAmendmentAction } from '@/utils/amendment-actions'

type TDocumentDetails = {
  fileUrl: string
  fileType: string
  status: string
}

const Page = ({ params: { meetingId } }: { params: { meetingId: string } }) => {
  const [loading, setLoading] = useState(false)
  const [actions, setActions] = useState<TAction[]>([])
  const [documentDetails, setDocumentDetails] =
    useState<TDocumentDetails | null>(null)

  const companyId = useSelectedAccountCompany()?.companyId
  const { meetingDetails } = useContext(MeetingDetailsContext)
  const router = useRouter()
  const openDocumentPreviewModal: any = useRef()
  const breadcrumbs = useBreadcrumbs()

  const fetchActionData = useCallback(async () => {
    setLoading(true)

    try {
      if (!companyId || !meetingDetails) return

      const result = await API.getActions({
        companyId,
        linkType: 'company',
        meetingId: meetingDetails.id,
      })
      setActions(result)
    } finally {
      setLoading(false)
    }
  }, [companyId, meetingDetails])

  const gettingMinutesDocument = useCallback(async () => {
    setLoading(true)
    if (!companyId || !meetingDetails) return
    try {
      const response = await API.getMinutesDocument({
        companyId,
        meetingId: meetingDetails.id,
      })
      setDocumentDetails(response)
    } catch (err: any) {
      Toast.error(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }, [meetingDetails, companyId])

  useEffect(() => {
    gettingMinutesDocument()
    fetchActionData()
  }, [gettingMinutesDocument, fetchActionData])

  const amendmentAction = (record: any) => {
    const actionRoute: any = createRouteForAmendmentAction(record);
    return actionRoute;
  };

  if (!meetingDetails) return null

  if (loading) {
    return <Loading size='small' />
  }

  return (
    <FlexBox className={styles.page} flexDirection='column'>
      <FlexBox className={styles.sectionBox}>
        <FlexBox justifyContent='space-between'>
          <Typography size='giant'>Post meeting</Typography>
          <Button
            onClick={() =>
              router.push(
                `/dashboard/meeting-and-track-targets/${meetingId}/meeting-pack`
              )
            }
          >
            View Meeting Pack
          </Button>
        </FlexBox>
        {documentDetails?.fileUrl && documentDetails?.fileUrl !== 'error' && (
          <>
            <Space size={32} />
            <Typography size='big'>Meeting Minutes</Typography>
            <Space size={20} />
            <Clickable
              onClick={() =>
                openDocumentPreviewModal.current.open(documentDetails)
              }
            >
              <FlexBox alignItems='center'>
                <Icon name='pdf-file-icon' size={34} />
                <Space horizontal size={5} />
                <Typography gray>View Minutes Document</Typography>
              </FlexBox>
            </Clickable>
          </>
        )}

        <Space size={32} />
        <Typography size='big'>List of Actions from meeting</Typography>
        <Space size={16} />
        {actions &&
          actions.length > 0 &&
          actions?.map((action, index) => {
            const { link, heading } = amendmentAction(action);
            return (
              <Fragment key={index}>
                <div className={styles.border}>
                  <FlexBox flexDirection='column'>
                    <FlexBox justifyContent='space-between'>
                      <Typography className={styles.fontWeight} serif size='big'>
                        {action?.recordDetail ? "Amendment" : "Action"}
                      </Typography>
                      {action?.recordDetail && (
                        <Clickable onClick={() => {
                          router.push(link);
                          const breadcrumbsArray: TBreadCrumb[] = setBreadCrumbsForAmendmentAction(action)
                          breadcrumbs.set(breadcrumbsArray)
                        }}>
                          <Typography primary size='large'>
                            {`View ${heading}`}
                          </Typography>
                        </Clickable>)}</FlexBox>
                    <Space size={16} />
                    <FlexBox justifyContent='space-between'>

                      <FlexBox flexDirection='column'>
                        <Typography className={styles.bolder} serif size='large'>
                          Name
                        </Typography>
                        <Space size={10} />
                        <Typography size='large' serif>{action?.name}</Typography>
                      </FlexBox>
                      <FlexBox flexDirection='column'>
                        <Typography className={styles.bolder} serif size='large'>
                          Owner
                        </Typography>
                        <Space size={10} />
                        <Typography size='large' serif>
                          {`${action?.owner?.firstName} ${action?.owner?.lastName}`}
                        </Typography>
                      </FlexBox>
                      <FlexBox flexDirection='column'>
                        <Typography className={styles.bolder} serif size='large'>
                          Date Due
                        </Typography>
                        <Space size={10} />
                        <Typography size='large' serif>
                          {action?.dueDate
                            ? dayjs(action?.dueDate).format('DD/MM/YYYY')
                            : '- -'}
                        </Typography>
                      </FlexBox>
                    </FlexBox>
                    <Space size={20} />
                    <FlexBox
                      flexDirection='column'
                      justifyContent='space-between'
                    >
                      <FlexBox flexDirection='column'>
                        <FlexBox>
                          <Typography className={styles.bolder} serif size='large'>
                            Details
                          </Typography>
                        </FlexBox>
                        <Space size={5} />
                        <Typography size='large' serif>{action?.description}</Typography>
                      </FlexBox>
                    </FlexBox>
                  </FlexBox>
                </div>
                <Space size={16} />
              </Fragment>
            )
          })}
        <Space size={32} />
      </FlexBox>
      <DocumentPreviewModal ref={openDocumentPreviewModal} />
    </FlexBox>
  )
}

export default Page

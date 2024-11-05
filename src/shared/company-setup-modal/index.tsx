import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Divider } from 'antd'

import * as API from '@/api'
import Modal from '@/components/modal'
import styles from './company-setup.module.scss'
import Typography from '@/components/typography'
import Button from '@/components/button'
import Space from '@/components/space'
import Card from '@/components/card'
import FlexBox from '@/components/flex-box'
import Icon from '@/components/icon'
import Toast from '@/components/toast'
import * as SetupACompanyModal from '../setup-a-company-modal'
import { useAppDispatch, useAppSelector, useAuthenticatedUser } from '@/hooks'
import { useRouter } from 'next/navigation'
import { getAccountInfo } from '@/store/actions'
import { TInvitesData } from '@/models'
import ConfirmDelete from '../confirm-delete'
import Loading from '@/components/loading'
import * as AllPlansModal from '@/shared/all-plans-modal';

let instance: any

export enum INVITE_RESPONSE {
  REJECT = 'REJECT',
  ACCEPT = 'ACCEPT',
}

const CompanySetupModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false)
  const user = useAuthenticatedUser()
  const [invites, setInvites] = useState<TInvitesData[]>([])
  const [closable, setClosable] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch();
  const logoutRef = useRef<any>()
  const account = useAppSelector(({ account }) => account)

  const companyDetails = useCallback(async () => {
    if (!account?.companies) return
    setLoading(true)
    try {
      const invitesInfo = await API.getAccountInfo('pending')
      if (invitesInfo?.invites) {
        setInvites(invitesInfo?.invites)
      }
      setLoading(false)
    } catch (error: any) {
      Toast.error(error.message || "Something went wrong")
      setLoading(false)
    }
  }, [user, open, account?.companies])

  useEffect(() => {
    if (account?.companies && open) {
      companyDetails()
    }
  }, [user, account?.companies, open])

  async function getCompanyData() {
    try {
      await dispatch(getAccountInfo());
    } catch (error) {
      console.log("Error getting company data", error)
    }
  }

  const onAcceptInvitation = useCallback(
    async (
      companyId: string,
      type: INVITE_RESPONSE.ACCEPT | INVITE_RESPONSE.REJECT
    ) => {
      try {
        if (type === INVITE_RESPONSE.ACCEPT) {
          setAccepting(true)
        } else {
          setRejecting(true)
        }
        await API.acceptCompanyInvitation({
          companyId,
          response: type,
        })
        if (type === INVITE_RESPONSE.ACCEPT) {
          Toast.success('Accepted successfully!')
          getCompanyData()
          setOpen(false)
        } else {
          Toast.success('Rejected successfully!')
        }
      } catch (error: any) {
        Toast.error(error?.message || 'Something went wrong.')
      } finally {
        companyDetails()
        setAccepting(false)
        setRejecting(false)
      }
    },
    []
  )

  const logout = async () => {
    setLoading(true)
    try {
      await API.signOutUser()
      setOpen(false)
      router.push("/login")
      logoutRef?.current?.close()
      AllPlansModal.close()
      setLoading(false)

    } catch (e: any) {
      Toast.error(e.message)
      setLoading(false)
    }
  }

  useImperativeHandle(
    ref,
    () => ({
      open: (force?: boolean) => {
        setOpen(true)
        setClosable(!force)
      },
      close: () => setOpen(false),
    }),
    []
  )

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      className={styles.setupModal}
      closable={closable}
      maskClosable={closable}
    >

      <div className={styles.size}>
        {!closable && <Button
          className={styles.btn}
          onClick={() => {
            logoutRef?.current?.open()
          }}
        >Logout</Button>}
        <Typography size='enormous' className={styles.bolder}>
          Create a new company
        </Typography>
        <Typography size='large'>
          Create your company and invite your first members now!
        </Typography>
        <Space size={15} />
        <Button type='primary' onClick={() => SetupACompanyModal.open()}>
          Create a new company
        </Button>
        <Space size={25} />
        <Typography gray>OR</Typography>
        <Space size={25} />
        <Card className={styles.padding}>
          <Typography className={styles.bold}>Your invitations</Typography>

          <div>
            <Space size={15} />
            {loading ?
              (<Loading size='small' />)
              : invites && invites?.length ? (
                invites?.map((invite, index: number) => (
                  <>
                    <FlexBox flexDirection='column' key={index}>
                      <FlexBox alignItems='center' justifyContent='space-between'>
                        <Typography
                          size='large'
                          bold
                          ellipsis
                          className={styles.width}
                        >
                          {invite.companyName || invite.accessLevel}
                        </Typography>
                        <Typography
                          gray
                          size='large'
                          ellipsis
                          className={styles.width}
                        >
                          {"invite you to company"}
                        </Typography>
                        <FlexBox alignItems='center'>
                          <Button className={styles.border} loading={rejecting}
                            disabled={accepting || rejecting} onClick={() =>
                              onAcceptInvitation(
                                invite.companyId,
                                INVITE_RESPONSE.REJECT
                              )
                            }>Reject</Button>

                          <Space horizontal size={10} />
                          <Button
                            type='primary'
                            loading={accepting}
                            disabled={accepting || rejecting}
                            onClick={() =>
                              onAcceptInvitation(
                                invite.companyId,
                                INVITE_RESPONSE.ACCEPT
                              )
                            }
                          >
                            Accept
                          </Button>
                        </FlexBox>
                      </FlexBox>
                    </FlexBox>
                    <Divider className={styles.margin} />
                  </>
                ))
              ) : (
                <div>
                  <FlexBox justifyContent='center'>
                    <Icon name='no-found-icon' size={120} alt='SEEIO logo' />
                  </FlexBox>
                  <Space size={5} />
                  <Typography center gray>
                    No pending invitations
                  </Typography>
                </div>
              )}
          </div>
        </Card>
        <ConfirmDelete
          ref={logoutRef}
          handleConfirm={logout}
          loading={loading}
          message={`Are you sure you want to logout?`}
        />
      </div>
    </Modal>
  )
})
CompanySetupModal.displayName = 'CompanySetupModal'

export const setInstantce = (ref: any) => {
  instance = ref
}

export const open = (force?: boolean) => {
  if (instance) {
    return instance.open(force)
  }

  return null
}

export const close = (force?: boolean) => {
  if (instance) {
    return instance.close(force)
  }

  return null
}

export default CompanySetupModal

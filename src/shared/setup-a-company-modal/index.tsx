import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Image from 'next/image'
import { Input } from 'antd'
import { useFormik } from 'formik'
import * as yup from 'yup'
import lodash from 'lodash'
import classnames from 'classnames'
import { useRouter } from 'next/navigation'

import Modal from '@/components/modal'
import Space from '@/components/space'
import Toast from '@/components/toast'
import Typography from '@/components/typography'
import Button from '@/components/button'
import { useAccessLevel, useAppDispatch, useAuthenticatedUser } from '@/hooks'
import * as API from '@/api'
import { getAccountInfo, setSelectedCompanyId } from '@/store/actions'
import { TCompany } from '@/models'
import styles from './setup-a-company-modal.module.scss'
import * as CompanySetupModal from '../company-setup-modal'
// import useAmplitudeContext from '@/hooks/amplitude'


type TForm = {
  companies: TCompany[]
}

const validationSchema = yup.object().shape({
  companies: yup.string().email().required(),
})

let instance: any

const SetupACompanyModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmingCompanyNumber, setConfirmingCompanyNumber] = useState<string | null>(null)
  const [companyNumber, setCompanyNumber] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [companies, setCompanies] = useState<TCompany[]>([])
  const user = useAuthenticatedUser();
  useAccessLevel()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const formik = useFormik<TForm>({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: {
      companies: companies,
    },
    validationSchema,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => { }
  });

  const onSearch = async () => {
    setLoading(true)
    try {
      const data = await API.searchCompany({ companyName, companyNumber })
      setCompanies(data.companies.slice(0, 4))
    } catch (e: any) {
      const serverError = lodash.get(e, "[0].error")
      if (serverError) {
        if (serverError === "company-profile-not-found") Toast.error("Company Number doesn't exists")
      }
    } finally {
      setLoading(false)
    }
  }

  const onConfirm = async (company: TCompany) => {
    setConfirmingCompanyNumber(company.companyNumber)

    try {
      await API.importCompany({ companyId: company.companyNumber })
      await dispatch(getAccountInfo())
      dispatch(setSelectedCompanyId(company.companyNumber))
      setOpen(false)
      CompanySetupModal.close(true)
      router.push(`/add-company/${company.companyNumber}`)
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.")
    } finally {
      if (user) {
        CompanySetupModal.close(true)
      }
      setConfirmingCompanyNumber(null)
    }
  }

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true)
      setCompanies([])
      setCompanyNumber("")
      setCompanyName("")
    },
    close: () => setOpen(false)
  }), [])

  return (
    <Modal
      open={open}
      width={companies?.length > 1 ? 970 : 567}
      onCancel={() => setOpen(false)}
    >
      <div className={styles.setupACompanyModal}>
        <Image
          className={styles.logo}
          src="/logo.png"
          alt="App Logo"
          width={72}
          height={43}
          priority
        />
        <Space size={30} />
        <Typography center serif size="enormous">Setup a Company</Typography>
        <Space size={24} />
        {companies.length === 0 ? (
          <div className={styles.searchSection}>
            <Typography center size="large" gray>
              Search for your company by name or number,
              <br />
              then confirm to get started!
            </Typography>
            <Space size={24} />
            <Input
              name="companyNumber"
              size="large"
              placeholder="Company Number"
              onChange={(e) => setCompanyNumber(e.target.value)}
              onFocus={() => setCompanyName("")}
              value={companyNumber}
            />
            <Space size={24} />
            <div className={styles.divider}>
              <div className={styles.line} />
              <Typography gray size="large">or</Typography>
            </div>
            <Space size={24} />
            <Input
              name="companyName"
              size="large"
              placeholder="Company Name"
              onChange={(e) => setCompanyName(e.target.value)}
              onFocus={() => setCompanyNumber("")}
              value={companyName}

            />
            <Space size={24} />
            <Button
              size="large"
              type="primary"
              loading={loading}
              disabled={!companyNumber && !companyName}
              onClick={onSearch}
            >
              Continue
            </Button>
            <Space size={24} />
          </div>
        ) : (
          <div className={styles.sectionOuter}>
            {formik.values.companies.map((company, index) => (
              <div
                key={index}
                className={classnames(styles.section, { [styles.single]: formik.values.companies.length < 2 })}
              >
                <div className={styles.field}>
                  <Typography gray>Company Name</Typography>
                  <Space size={8} />
                  <Input
                    readOnly
                    name={`companies[${index}].name`}
                    size="large"
                    onChange={formik.handleChange}
                    value={formik.values.companies[index].name}
                  />
                </div>
                <Space size={24} />
                <div className={styles.field}>
                  <Typography gray>Incorperation Date</Typography>
                  <Space size={8} />
                  <Input
                    readOnly
                    name={`companies[${index}].dateOfCreation`}
                    size="large"
                    onChange={formik.handleChange}
                    value={formik.values.companies[index].dateOfCreation}
                  />
                </div>
                <Space size={24} />
                <div className={styles.field}>
                  <Typography gray>Company Number</Typography>
                  <Space size={8} />
                  <Input
                    readOnly
                    name={`companies[${index}].companyNumber`}
                    size="large"
                    onChange={formik.handleChange}
                    value={formik.values.companies[index].companyNumber}
                  />
                </div>
                <Space size={24} />
                <div className={styles.field}>
                  <Typography gray>Company Type</Typography>
                  <Space size={8} />
                  <Input
                    readOnly
                    name={`companies[${index}].companyType`}
                    size="large"
                    onChange={formik.handleChange}
                    value={formik.values.companies[index].companyType}
                  />
                </div>
                <Space size={24} />
                <div className={styles.field}>
                  <Typography gray>Address</Typography>
                  <Space size={8} />
                  <Input
                    readOnly
                    name={`companies[${index}].address`}
                    size="large"
                    onChange={formik.handleChange}
                    value={formik.values.companies[index].address}
                  />
                </div>
                <Space size={24} />
                <Button
                  size="large"
                  type="primary"
                  loading={confirmingCompanyNumber === company.companyNumber}
                  onClick={() => onConfirm(company)}
                >
                  Confirm
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
})
SetupACompanyModal.displayName = "SetupACompanyModal"

export const setInstantce = (ref: any) => {
  instance = ref
}

export const open = (force?: boolean) => {
  if (instance) {
    return instance.open(force)
  }

  return null
}

export default SetupACompanyModal

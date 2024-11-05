"use client"

import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react'
import { Select, Input, Dropdown } from 'antd'
import { SearchOutlined, EllipsisOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd';
import { useDispatch } from 'react-redux'

import Typography from '@/components/typography'
import Table from "@/components/table";
import Clickable from "@/components/clickable";
import Space from "@/components/space";
import { TColumn } from '@/components/table'
import Icon from "@/components/icon";
import * as API from '@/api'
import styles from './page.module.scss'
import { handleRedirection, useAuthenticatedUser, useSelectedAccountCompany } from '@/hooks'
import { TGetUsersResponse, TUsers } from '@/api'
import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import AddUserModal, { ACCESS_LEVEL } from './add-user-modal'
import ConfirmDelete from '@/shared/confirm-delete'
import Toast from '@/components/toast'
import { usePathname, useRouter } from 'next/navigation'
import { accessLevelActions } from '@/store/account/useAcessLevel'

const Page = () => {
  const [initing, setIniting] = useState(true)
  const [data, setData] = useState<TGetUsersResponse>()
  const [selectedItemKeys, setSelectedItemKeys] = useState<any>([])
  const [deleting, setDeleting] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string[]>([])
  const [disabledRecord, setDisabledRecord] = useState<TUsers>()
  const [disabling, setDisabling] = useState(false)
  const [inviting, setInviting] = useState(false)

  const user = useAuthenticatedUser()

  const companyId = useSelectedAccountCompany()?.companyId

  const addUserModalRef = useRef<any>()
  const editUserModalRef = useRef<any>()
  const deleteUserModalRef = useRef<any>()
  const confirmUserStatusRef = useRef<any>()
  const confirmUserInvite = useRef<any>()
  const userToInvite = useRef<any>()
  const dispatch = useDispatch()
  const pathname = usePathname()
  const { updateAcessLevel } = accessLevelActions
  const router = useRouter()

  const onSuccess = () => fetchData()

  const fetchData = async () => {
    setIniting(true)
    fetchUserAccessLevel()

    try {
      const result = await API.getUsers(companyId!)

      setData(result)
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong!")
    } finally {
      setIniting(false)
    }
  }

  const fetchUserAccessLevel = async () => {
    try {
      if (companyId) {
        const accessLevel = await API.getAccountAccess(companyId || "")
        handleRedirection(pathname, accessLevel, router)
        dispatch(updateAcessLevel(accessLevel))
      }
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong!")
    }
  }

  useEffect(() => {
    fetchData()
  }, [companyId])

  const deleteUser = useCallback(async () => {
    if (!companyId) {
      return
    }
    try {
      setDeleting(true)
      await API.deleteUsers(companyId, { userIds: userToDelete })
      Toast.success("User deleted successfully.")
      fetchData()
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong!")
    } finally {
      deleteUserModalRef.current.close()
      setDeleting(false)
      setSelectedItemKeys([])
    }
  }, [companyId, userToDelete])


  const resendInvite = async () => {
    if (!companyId || !userToInvite.current) return
    const { email, firstName, lastName } = userToInvite.current;

    try {
      setInviting(true)
      await API.resendInvite(companyId, { email, firstName, lastName })
      Toast.success("Invitation sent successfully.")
    } catch (error) {
      Toast.success("Something went wrong")
    } finally {
      confirmUserInvite.current.close()
      setInviting(false)
    }
  }

  const columns = useMemo<TColumn<TUsers>[]>(() => ([{
    key: "firstName",
    title: "First Name",
    width: 180,
  }, {
    key: "lastName",
    title: "Last Name",
    width: 180,
  }, {
    key: "email",
    title: "Email",
    width: 300,
  }, {
    key: "accessLevel",
    title: "Access Level",
    render: (record) => record?.accessLevel ? ACCESS_LEVEL?.find((item) => item?.value === record?.accessLevel)?.label : "-",
    width: 200,
  },
  {
    width: 100,
    render: (record) => {
      const items: MenuProps['items'] = [{
        label: "Edit",
        style: {},
        key: '0',
        onClick: (e) => {
          e.domEvent.stopPropagation()
          editUserModalRef?.current?.open(record)
        }
      }]


      if (user?.email !== record.email) {
        items.push({
          label: "Resend invite",
          style: {},
          key: '1',
          onClick: (e) => {
            e.domEvent.stopPropagation()
            confirmUserInvite.current.open()
            userToInvite.current = record;
          }
        })

        items.push({
          label: record?.isDisabled ? "Enable" : "Disable",
          style: { color: record?.isDisabled ? "green" : "gray" },
          key: '2',
          onClick: (e) => {
            e.domEvent.stopPropagation()
            confirmUserStatusRef.current.open()
            setDisabledRecord(record)
          }
        })

        items.push({
          label: "Delete",
          style: { color: "red" },
          key: '3',
          onClick: (e) => {
            e.domEvent.stopPropagation()
            setUserToDelete([record?.email])
            deleteUserModalRef?.current?.open()
          }
        })
      }
      return (

        <Dropdown
          menu={{ items }}
          trigger={['click']}
        >
          <Clickable
            onClick={(e) => e.stopPropagation()}
          >
            <EllipsisOutlined style={{ fontSize: 22 }} />
          </Clickable>
        </Dropdown>
      )
    }
  }
  ]), [data])

  const handleRowSelect = (select: any, checked: boolean) => {
    if (select == "selectAll") {
      if (checked) {
        setSelectedItemKeys(data?.users?.map((item) => item?.userId))
      } else {
        setSelectedItemKeys([])
      }
    } else {
      const updatedKeys = checked
        ? [...selectedItemKeys, select?.userId]
        : selectedItemKeys?.filter((key: any) => key !== select?.userId);
      setSelectedItemKeys(updatedKeys);
    }
  }

  const toggleUserDisabled = async () => {
    if (!companyId || !disabledRecord) {
      return;
    }

    try {
      setDisabling(true)
      await API.updateUsers(
        companyId,
        {
          userId: disabledRecord?.userId,
          updateAttributes: {
            accessLevel: disabledRecord?.accessLevel,
            userType: disabledRecord?.userType || "",
            isDisabled: !disabledRecord?.isDisabled,
            firstName: disabledRecord.firstName,
            lastName: disabledRecord.lastName,
          }
        }
      )
      Toast.success("Updated successfully.")

      fetchData()
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.")
    } finally {
      setDisabling(false)
      confirmUserStatusRef.current.close()
    }
  };

  return (
    <div className={styles.page}>
      <Table
        rowKey="userId"
        allowSelect
        title="Users"
        columns={columns}
        items={data?.users ?? []}
        loading={initing}
        onRowSelect={handleRowSelect}
        selectedItemKeys={selectedItemKeys}
        disabledRecord={user?.email}
        disableKey={"email"}
        headerRight={(
          <>
            <Input
              allowClear
              className={styles.searchInput}
              bordered
              size="large"
              placeholder="Type to search..."
              prefix={<SearchOutlined />}
            />
            <Space horizontal size={24} />
            <Typography gray>
              Sort by:
            </Typography>
            <Space horizontal size={16} />
            <Select
              allowClear
              className={styles.sortSelect}
              size="large"
              bordered
              placeholder="Select"
              options={[{
                label: "Recently",
                value: 1
              }, {
                label: "Name",
                value: 2
              }]}
            />
            <Space horizontal size={24} />
            <Clickable onClick={() => {
              if (selectedItemKeys?.length === 0) {
                Toast.warning('Please select user.')
              } else {
                setUserToDelete(selectedItemKeys)
                deleteUserModalRef?.current?.open()
              }
            }}>
              <Icon name="gray-delete-icon" size={24} />
            </Clickable>
          </>
        )}
      />
      <Space size={50} />
      <FlexBox justifyContent="flex-end">
        <Button type="primary" onClick={() => addUserModalRef.current.open()}>
          Add User
        </Button>
      </FlexBox>

      <AddUserModal
        ref={addUserModalRef}
        onSuccess={onSuccess}
        companyId={companyId!}
      />
      <AddUserModal
        ref={editUserModalRef}
        onSuccess={onSuccess}
        companyId={companyId!}
        isEdit={true}
      />
      <ConfirmDelete
        ref={deleteUserModalRef}
        handleConfirm={deleteUser}
        loading={deleting}
        message='Are you sure you want to delete this user.'
      />
      <ConfirmDelete ref={confirmUserStatusRef} handleConfirm={toggleUserDisabled} loading={disabling}
        message={`${disabledRecord?.isDisabled ? "Are you sure you want to enable this user." : "Are you sure you want to disable this user."}`} />
      <ConfirmDelete
        ref={confirmUserInvite}
        handleConfirm={resendInvite}
        loading={inviting}
        message={"Are you sure you want to resend invite to this user?"}
      />
    </div>
  )
}

export default Page

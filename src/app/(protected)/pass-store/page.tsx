"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import Typography from "@/components/typography";
import ScollablePage from "@/components/scollable-page";
import Container from "@/components/container";
import Space from "@/components/space";
import Icon from "@/components/icon";
import Clickable from "@/components/clickable";
import Button from "@/components/button";
import FlexBox from "@/components/flex-box";
import Table, { TColumn } from "@/components/table";
import * as API from "@/api";
import styles from "./page.module.scss";
import StatusDot from "@/components/status-dot";
import AddPassStoreModal from "./add-store-modal";
import Toast from "@/components/toast";
import EditPassStoreModal from "./edit-store-modal";

interface PassStore {
  id: string;
  name: string;
  description: string;
  password: string;
  status: string;
}

const Page = () => {
  const [data, setData] = useState<PassStore[]>([]);
  const [initing, setIniting] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const addPassStoreModalRef = useRef<any>();
  const editPassStoreModalRef = useRef<any>();

  const fetchData = useCallback(async () => {
    setIniting(true);

    try {
      const result = await API.getMockPassStores();
      setData(result.items);
    } catch (err: any) {
      Toast.error(err?.message || "Something went wrong.");
    } finally {
      setIniting(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line
  }, []);

  const onCopyClick = (password: string) => {
    navigator.clipboard.writeText(password);
    Toast.success("Password copied to clipboard.")
  };

  const onSuccess = () => {
    fetchData();
  };

  const columns = useMemo<TColumn<PassStore>[]>(
    () => [
      {
        key: "name",
        title: "Name",
      },
      {
        key: "description",
        title: "Description",
      },

      {
        key: "password",
        title: "Passwords",
        render: (record) => (
          <FlexBox alignItems="center">
            <Typography size="large">
              {showPassword ? record?.password : "********"}
            </Typography>
            <Space horizontal size={14} />
            <Clickable onClick={() => onCopyClick(record?.password)}>
              <Icon name="content_copy" size={24} />
            </Clickable>
          </FlexBox>
        ),
      },
      {
        key: "status",
        title: "Status",

        render: (record) => (
          <FlexBox alignItems="center" justifyContent="flex-end">
            <StatusDot
              color={
                record.status === "pending"
                  ? "yellow"
                  : record.status === "complete"
                    ? "green"
                    : "red"
              }
            />
          </FlexBox>
        ),
      },
    ],
    [showPassword]
  );

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <Table
          rowKey="id"
          allowSelect
          title="Pass-store"
          columns={columns}
          items={data}
          loading={initing}
          headerRight={
            <>
              <Space horizontal size={35} />


              <Space horizontal size={14} />
              <Clickable onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (

                  <FlexBox alignItems='center'>
                    <Typography gray size="large">
                      Hide contents
                    </Typography>
                    <EyeInvisibleOutlined className={styles.passwordVisibility} />
                  </FlexBox>
                ) : (
                  <FlexBox alignItems='center'>
                    <Typography gray size="large">
                      Show contents
                    </Typography>
                    <EyeOutlined className={styles.passwordVisibility} />
                  </FlexBox>
                )}
              </Clickable>

              <Space horizontal size={35} />
              <Clickable>
                <Typography gray size="large">
                  Select All
                </Typography>
              </Clickable>
              <Space horizontal size={24} />
              <Clickable>
                <Icon name="gray-delete-icon" size={24} />
              </Clickable>
            </>
          }
        />
        <Space size={20} />
        <FlexBox justifyContent="flex-end">
          <Button onClick={() => editPassStoreModalRef.current.open()}>
            Edit
          </Button>
          <Space size={20} horizontal />
          <Button
            type="primary"
            onClick={() => addPassStoreModalRef.current.open()}
          >
            Add
          </Button>
          <Space size={20} horizontal />
        </FlexBox>
        <EditPassStoreModal
          ref={editPassStoreModalRef}
          onSuccess={onSuccess}
          passStore={{
            documentType: "1",
            code1Name: "code 1 name",
            code1: "code 1",
            code2Name: "code 2 name",
            code2: "code 2",
            notes: "note",
            passwords: [
              {
                url: "password",
                username: "user",
                password: "pass",
                pin: "pass",
                associatedEmail: "pass@test.com",
                associatedPhone: "123456",
                notes: "note",
              },
            ],
          }}
        />
        <AddPassStoreModal ref={addPassStoreModalRef} onSuccess={onSuccess} />
      </Container>
      <Space size={50} />
    </ScollablePage>
  );
};

export default Page;

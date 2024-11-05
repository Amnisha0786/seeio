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
import Toast from "@/components/toast";
import AddPasswordStoreModal from "./add-store-password-modal";
import EditPasswordStoreModal from "./edit-store-password-modal";

interface CodePassword {
  id: string;
  name: string;
  description: string;
  code1: string;
  code1Name: string;
  code2: string;
  status: string;
}

const Page = () => {
  const [data, setData] = useState<CodePassword[]>([]);
  const [initing, setIniting] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const addPasswordStoreModalRef = useRef<any>();
  const editPasswordStoreModalRef = useRef<any>();

  const fetchData = useCallback(async () => {
    setIniting(true);

    try {
      const result = await API.getMockCodePassStores();
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
  };

  const onSuccess = () => {
    fetchData();
  };

  const columns = useMemo<TColumn<CodePassword>[]>(
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
        key: "code1",
        title: "Code1",
        render: (record) => (
          <FlexBox alignItems="center">
            <Typography size="large">
              {showPassword ? record?.code1 : "********"}
            </Typography>
            <Space horizontal size={14} />
            <Clickable onClick={() => onCopyClick(record?.code1)}>
              <Icon name="content_copy" size={24} />
            </Clickable>
          </FlexBox>
        ),
      },
      {
        key: "code1Name",
        title: "Code 1 name",
      },
      {
        key: "code2",
        title: "Code 2",
        render: (record) => (
          <FlexBox alignItems="center">
            <Typography size="large">
              {showPassword ? record?.code2 : "********"}
            </Typography>
            <Space horizontal size={14} />
            <Clickable onClick={() => onCopyClick(record?.code2)}>
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
          title="Code & Password"
          columns={columns}
          items={data}
          loading={initing}
          headerRight={
            <>
              <Space horizontal size={35} />

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
          <Space size={20} horizontal />

          <Button onClick={() => editPasswordStoreModalRef.current.open()}>
            Edit
          </Button>
          <Space size={20} horizontal />
          <Button
            type="primary"
            onClick={() => addPasswordStoreModalRef.current.open()}
          >
            Add
          </Button>
        </FlexBox>

        <AddPasswordStoreModal
          ref={addPasswordStoreModalRef}
          onSuccess={onSuccess}
        />
        <EditPasswordStoreModal
          ref={editPasswordStoreModalRef}
          onSuccess={onSuccess}
          passwords={{
            passwords: [
              {
                url: "pass",
                username: "pass",
                password: "pass",
                pin: "1234",
                associatedEmail: "pass@test.com",
                associatedPhone: "12345678",
                notes: "note",
              },
            ],
          }}
        />
      </Container>
      <Space size={50} />
    </ScollablePage>
  );
};

export default Page;

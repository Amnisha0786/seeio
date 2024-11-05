"use client"

import React, { useMemo, useState } from "react";
import { Button, Dropdown, Radio, RadioChangeEvent } from "antd";
import { useRouter } from "next/navigation";
import { EyeOutlined, EyeInvisibleOutlined, EllipsisOutlined } from "@ant-design/icons";

import Table, { TColumn } from "@/components/table";
import FlexBox from "@/components/flex-box";
import Icon from "@/components/icon";
import styles from "../page.module.scss";
import Typography from "@/components/typography";
import Clickable from "@/components/clickable";
import Toast from "@/components/toast";
import Space from "@/components/space";

export enum CODES_AND_PASSWORD {
  COMPANY_INFORMATION = "company-information",
  FINANCE_DOC = "finance-doc",
  REGULATION_AND_COMPLIANCE = "regulation-doc",
  OTHERS = "others",
}

type TSummary = {
  id: string;
  category?: string;
  doc_type?: string;
  name?: string;
  parentId?: string;
  recordCategoryId?: string;
  referenceNumber?: string;
  referenceNumberLabel?: string;
  secondReferenceNumber?: string;
  secondReferenceNumberLabel?: string;
  references?: string[];
};

type TProps = {
  data: any;
  initing: boolean;
  setDocType: (val: string) => void;
  docType: string;
  canAccessOther: boolean;
  addDocumentModalRef: any;
  editDocumentRef: any,
  onDeleteDocument: (id: string) => void
  deleteModelRef: any,
}

const SummaryInfoTable = ({
  data,
  initing,
  setDocType,
  docType,
  canAccessOther,
  addDocumentModalRef,
  editDocumentRef,
  onDeleteDocument,
  deleteModelRef
}: TProps) => {
  const onCopyClick = (text: string) => {
    navigator.clipboard.writeText(text);
    Toast.success("Text copied to clipboard.");
  };
  const router = useRouter();
  const handleTabChange = (e: RadioChangeEvent) => {
    setDocType(e.target.value);
  };
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRender = (record: TSummary, docType: string) => {
    if (docType === CODES_AND_PASSWORD.COMPANY_INFORMATION) {
      router.push("/settings/company-setup/outline-of-the-company");
    } else if (
      docType === CODES_AND_PASSWORD.FINANCE_DOC &&
      record?.parentId &&
      record?.id
    ) {
      router.push(
        `/documents/records/${record.parentId}/document/${record.id}`
      );
    } else if (
      docType === CODES_AND_PASSWORD.REGULATION_AND_COMPLIANCE &&
      record?.parentId &&
      record?.id
    ) {
      router.push(
        `/documents/records/${record.parentId}/document/${record.id}`
      );
    } else if (
      docType === CODES_AND_PASSWORD.OTHERS &&
      record?.parentId &&
      record?.id
    ) {
      router.push(
        `/documents/records/${record.parentId}/document/${record.id}`
      );
    }
  };

  const getPassword = (password: string[]) => {
    return password[0]
  }
  
  const Tabscomponent = () => {
    return (
      <div className="summaryTabs">
        <Radio.Group
          onChange={handleTabChange}
          value={docType}
          style={{ marginBottom: 8 }}
        >
          <Radio.Button value={CODES_AND_PASSWORD.COMPANY_INFORMATION}>
            Company Information data points
          </Radio.Button>
          <Radio.Button value={CODES_AND_PASSWORD.FINANCE_DOC}>
            Finance docs
          </Radio.Button>
          <Radio.Button value={CODES_AND_PASSWORD.REGULATION_AND_COMPLIANCE}>
            Regulation and Complaince{" "}
          </Radio.Button>
          {
            canAccessOther && (
              <Radio.Button value={CODES_AND_PASSWORD.OTHERS}>Other</Radio.Button>
            )
          }
        </Radio.Group>
      </div>
    );
  };

  const columns = useMemo<TColumn<TSummary>[]>(
    () => [
      {
        key: "name",
        render: (record) => (
          <Clickable
            onClick={() => {
              handleRender(record, docType);
            }}
          >
            <Typography color="grey">
              {record?.name || ""}
            </Typography>
          </Clickable>
        ),
        width: 400
      },

      {
        key: "recordCategory",
        render: (record) =>
          docType === CODES_AND_PASSWORD.OTHERS ? (
            <FlexBox flexDirection="column">
              <FlexBox alignItems='flex-start'>
                <Space horizontal size={14} />
                {record?.references ?
                  <FlexBox alignItems="center">
                    <Typography>
                      {showPassword
                        ? getPassword(record.references)
                        : "********"}
                    </Typography>
                    <Space horizontal size={14} />
                    <Clickable
                      onClick={() =>
                        record?.references && onCopyClick(record?.references[0])
                      }
                    >
                      <Icon name="content_copy2" size={17} />
                    </Clickable>

                  </FlexBox>
                  : <>-</>
                }
              </FlexBox>
            </FlexBox>
          ) : record?.referenceNumber ? (
            <FlexBox flexDirection="column">
              <FlexBox alignItems='flex-start'>
                <FlexBox>
                  <Typography color="#797E92">{record?.referenceNumberLabel}</Typography>
                </FlexBox>
                <Space horizontal size={14} />
                <FlexBox>
                  <Typography>{record?.referenceNumber}</Typography>
                  <Space horizontal size={14} />

                  <Clickable
                    onClick={() =>
                      record?.referenceNumber &&
                      onCopyClick(record?.referenceNumber)
                    }
                  >
                    <Icon name="content_copy2" size={17} />
                  </Clickable>
                </FlexBox>
              </FlexBox>
              <Space size={14} horizontal />
              <FlexBox alignItems='flex-start' >
                <FlexBox>
                  <Typography color="#797E92">{record?.secondReferenceNumberLabel}</Typography>
                </FlexBox>
                <Space horizontal size={14} />
                <FlexBox>
                  <Typography>{record?.secondReferenceNumber}</Typography>
                  <Space horizontal size={14} />
                  <Clickable
                    onClick={() =>
                      record?.secondReferenceNumber &&
                      onCopyClick(record?.secondReferenceNumber)
                    }
                  >
                    <Icon name="content_copy2" size={17} />
                  </Clickable>
                </FlexBox>
              </FlexBox>
            </FlexBox>
          ) : (
            <> 
              <Typography color="#797E92">{record?.category?.trim() || "-"}</Typography> 
              <Space horizontal size={14} />
              {
                record?.category?.trim() && (
                  <Clickable
                    onClick={() => onCopyClick(`${record?.category}`)}
                  >
                    <Icon name="content_copy2" size={17} />
                  </Clickable>
                )
              } </>
          ),
        width: 400
      },
      docType === CODES_AND_PASSWORD.OTHERS ? {
        key: "operations",
        render: (record) => (
          <Dropdown menu={{
            items: [{
              label: "Edit",
              key: '0',
              onClick: () => editDocumentRef.current.open(record)
            }, {
              label: "Delete",
              key: '1',
              onClick: () => {
                onDeleteDocument(record.id)
                deleteModelRef.current.open()
              }
            }]
          }} trigger={['click']}>
            <Clickable
              onClick={(e) => e.stopPropagation()}
            >
              <EllipsisOutlined style={{ fontSize: 24 }} />
            </Clickable>
          </Dropdown>
        ),
        width: 400
      } : {}
    ],
    [docType, showPassword]
  );

  return (
    <Table
      tabElement={<Tabscomponent />}
      className="summaryTable"
      showTableHeaders={false}
      rowKey="id"
      noDataProps={{
        title: 'No records found',
      }}
      headerRight={
        docType === CODES_AND_PASSWORD.OTHERS ? (
          <FlexBox gap={5}>
            {
              data?.length > 0 && (
                <Button
                  onClick={() => {
                    handleShowPassword();
                  }}
                  className={styles.btn}
                >
                  {`${showPassword ? 'Hide' : 'Show'}`} contents {!showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </Button>
              )
            }
            <Button
              onClick={() => addDocumentModalRef.current.open()}
              className={`${styles.btn} ${styles.addBtn}`}
            >
              Add new
            </Button>
          </FlexBox>
        ) : (
          <></>
        )
      }
      columns={columns}
      items={data}
      loading={initing}
    />
  );
};

export default SummaryInfoTable;

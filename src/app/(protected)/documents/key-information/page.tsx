"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";

import ScollablePage from "@/components/scollable-page";
import Container from "@/components/container";
import Space from "@/components/space";
import styles from "./page.module.scss";
import SummaryInfoTable from "./passwords-table";
import Typography from "@/components/typography";
import { useAccessLevel, useSelectedAccountCompany } from "@/hooks"
import * as API from "@/api";
import Toast from "@/components/toast"
import AddDocumentModal from "./add-document-modal"
import { CODES_AND_PASSWORD } from '@/constants';
import { COMPANY_USER_ACCESS_LEVEL } from '@/models';
import ConfirmDelete from "@/shared/confirm-delete";

type TData = {
  name: string
  category: string
}

const Page = () => {
  const [data, setData] = useState<TData[]>([]);
  const [initing, setIniting] = useState(false);
  const [docType, setDocType] = useState<string>(CODES_AND_PASSWORD.COMPANY_INFORMATION)
  const companyId = useSelectedAccountCompany()?.companyId;
  const addDocumentModalRef = useRef<any>();
  const editDocumentModalRef = useRef<any>();
  const [deleting, setDeleting] = useState(false)
  const deleteModelRef = useRef<any>()
  const [docId, setDocId] = useState<string>()
  const access = useAccessLevel();

  const canAccessOther = useMemo(() => {
    return (
      access?.accessLevel?.toLowerCase() !== COMPANY_USER_ACCESS_LEVEL.USER.toLowerCase() &&
      access?.accessLevel?.toLowerCase() !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER.toLowerCase()
    )
  }, [access])

  const fetchData = useCallback(async (docType: string) => {
    try {
      setIniting(true);
      if (companyId) {
        const result = await API.getSummaryInformationCodes(companyId, docType);

        if (docType === CODES_AND_PASSWORD.COMPANY_INFORMATION) {
          const items = result?.[0]
          const data = [
            {
              name: "Companies House registration number",
              category: items?.companyId
            },
            {
              name: "Date of incorporation",
              category: items?.incorporationDate ? dayjs(items?.incorporationDate).format("DD/MM/YYYY") : ""
            },
            {
              name: "Registered office address",
              // eslint-disable-next-line max-len
              category: `${items?.registeredOfficeAddress?.addressLine1 || ""} ${items?.registeredOfficeAddress?.addressLine2 || ""} ${items?.registeredOfficeAddress?.locality || ""} ${items?.registeredOfficeAddress?.region || ""} ${items?.registeredOfficeAddress?.country || ""} ${items?.registeredOfficeAddress?.postalCode || ""}`
            },

          ]

          if (canAccessOther) {
            data.push({
              name: "Government Gateway number",
              category: items?.governmentGateway
            },
            {
              name: "Companies House authentication code",
              category: items?.companyHouseAuthenticationCode
            })
          }

          setData(data);
        } else {
          setData(result);
        }
      }
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
    } finally {
      setIniting(false);
    }
  }, [companyId]);

  const onDeleteDocument = async () => {
    if (!docId && !companyId) return
    setDeleting(true)
    try {
      await API.deleteDocument(companyId, { ids: [docId] })
      Toast.success('Code deleted successfully')
      setDeleting(false)
      deleteModelRef.current.close()
      fetchData(docType)
    } catch (error: any) {
      Toast.error(error.meessage || 'Something went wrong')
    }
    setDeleting(false)
  }

  useEffect(() => {
    fetchData(docType)
  }, [docType, companyId])

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <Typography size="enormous" color="#00293F">
          Key information
        </Typography>
        <Space size={32} />
        <SummaryInfoTable
          addDocumentModalRef={addDocumentModalRef}
          setDocType={setDocType}
          docType={docType}
          data={data}
          initing={initing}
          editDocumentRef={editDocumentModalRef}
          onDeleteDocument={setDocId}
          deleteModelRef={deleteModelRef}
          canAccessOther={canAccessOther}
        />
        <Space size={20} />
      </Container>
      <Space size={50} />
      <AddDocumentModal
        ref={addDocumentModalRef}
        onSuccess={() => {
          fetchData(docType);
        }}
      />
      <AddDocumentModal
        isEdit={true}
        ref={editDocumentModalRef}
        onSuccess={() => {
          fetchData(docType);
        }}
      />
      <ConfirmDelete
        ref={deleteModelRef}
        handleConfirm={onDeleteDocument}
        loading={deleting}
        message={"Are you sure you want to delete the code?"}
      />
    </ScollablePage>
  );
};

export default Page;

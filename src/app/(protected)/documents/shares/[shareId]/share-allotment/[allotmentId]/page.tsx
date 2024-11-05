"use client";

import React, { useRef, useState } from "react";
import { useFormik } from "formik";

import BreadCrumbs from "@/shared/global-breadcrumbs";
import ScollablePage from "@/components/scollable-page";
import Space from "@/components/space";
import Container from "@/components/container";
import styles from "../page.module.scss";
import FlexBox from "@/components/flex-box";
import Typography from "@/components/typography";
import Icon from "@/components/icon";
import Clickable from "@/components/clickable";
import EditAllotment from "./edit-allotment/edit-allotment";
import AddShareClassModal from "./edit-allotment/add-share-class-modal";

const Page = () => {
  const [isEdit, setIsEdit] = useState(false);
  const addShareClassModalRef: any = useRef();

  const formik = useFormik({
    validateOnChange: false,
    validateOnMount: false,
    initialValues: {},
    // validationSchema,
    onSubmit: async (values: any): Promise<void> => {},
  });

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <BreadCrumbs />
        <Space size={32} />
        {!isEdit ? (
          <>
            <Space size={24} />
            <FlexBox flexDirection="column" className={styles.infoBox}>
              <FlexBox justifyContent="space-between" alignItems="center">
                <Typography size="huge">Share Allotment</Typography>
                <FlexBox>
                  <Clickable onClick={() => setIsEdit(true)}>
                    <Icon name="black-edit-icon" size={24} />
                  </Clickable>
                  <Space horizontal size={10} />
                  <Clickable
                    onClick={() => addShareClassModalRef.current.open()}
                  >
                    <Icon name="black-delete-icon" size={24} />
                  </Clickable>
                </FlexBox>
              </FlexBox>
              <Space size={25} />
              <FlexBox
                justifyContent="space-between"
                className={styles.content}
              >
                <FlexBox flexDirection="column" className={styles.content}>
                  <FlexBox>
                    <Typography gray>Date of Issue</Typography>
                  </FlexBox>
                  <Space size={5} />
                  <Typography size="large">12/12/2023</Typography>
                </FlexBox>
                <FlexBox flexDirection="column" className={styles.content}>
                  <FlexBox>
                    <Typography gray>Tax scheme used</Typography>
                  </FlexBox>
                  <Space size={5} />
                  <Typography size="large">Lorem ipsum dolor</Typography>
                </FlexBox>
              </FlexBox>
              <Space size={25} />
              <FlexBox
                justifyContent="space-between"
                className={styles.content}
              >
                <FlexBox flexDirection="column" className={styles.content}>
                  <FlexBox>
                    <Typography gray>Shares Issued To</Typography>
                  </FlexBox>
                  <Space size={5} />
                  <Typography size="large">12/12/2023</Typography>
                </FlexBox>
                <FlexBox flexDirection="column" className={styles.content}>
                  <FlexBox>
                    <Typography gray>Share Class</Typography>
                  </FlexBox>
                  <Space size={5} />
                  <Typography size="large">12/12/2023</Typography>
                </FlexBox>
              </FlexBox>
              <Space size={25} />
              <FlexBox
                justifyContent="space-between"
                className={styles.content}
              >
                <FlexBox flexDirection="column" className={styles.content}>
                  <FlexBox>
                    <Typography gray>Number of shares allocated *</Typography>
                  </FlexBox>
                  <Space size={5} />
                  <Typography size="large">12/12/2023</Typography>
                </FlexBox>
                <FlexBox flexDirection="column" className={styles.content}>
                  <FlexBox>
                    <Typography gray>Total consideration paid</Typography>
                  </FlexBox>
                  <Space size={5} />
                  <Typography size="large">12/12/2023</Typography>
                </FlexBox>
              </FlexBox>
              <Space size={25} />
              <FlexBox
                justifyContent="space-between"
                className={styles.content}
              >
                <FlexBox flexDirection="column" className={styles.content}>
                  <FlexBox>
                    <Typography gray>Nominal value</Typography>
                  </FlexBox>
                  <Space size={5} />
                  <Typography size="large">12/12/2023</Typography>
                </FlexBox>
                <FlexBox flexDirection="column" className={styles.content}>
                  <FlexBox>
                    <Typography gray>Agregate nominal value</Typography>
                  </FlexBox>
                  <Space size={5} />
                  <Typography size="large">12/12/2023</Typography>
                </FlexBox>
              </FlexBox>
              <Space size={25} />
              <FlexBox
                justifyContent="space-between"
                className={styles.content}
              >
                <FlexBox flexDirection="column" className={styles.content}>
                  <FlexBox>
                    <Typography gray>Share premium</Typography>
                  </FlexBox>
                  <Space size={5} />
                  <Typography size="large">12/12/2023</Typography>
                </FlexBox>
                <FlexBox flexDirection="column" className={styles.content}>
                  <FlexBox>
                    <Typography gray>Share Price</Typography>
                  </FlexBox>
                  <Space size={5} />
                  <Typography size="large">12/12/2023</Typography>
                </FlexBox>
              </FlexBox>

              <Space size={25} />
            </FlexBox>
            <Space size={24} />
            <FlexBox flexDirection="column" className={styles.infoBox}>
              <FlexBox justifyContent="space-between">
                <FlexBox flexDirection="column" className={styles.content}>
                  <FlexBox>
                    <Typography gray>Share Certificate Number</Typography>
                  </FlexBox>
                  <Space size={5} />
                  <Typography size="large">12/12/2023</Typography>
                </FlexBox>
                <FlexBox>
                  <Clickable>
                    <Icon name="black-edit-icon" size={24} />
                  </Clickable>
                  <Space horizontal size={10} />
                  <Clickable>
                    <Icon name="black-delete-icon" size={24} />
                  </Clickable>
                </FlexBox>
              </FlexBox>
            </FlexBox>
          </>
        ) : (
          <>
            <Space size={24} />
            <EditAllotment formik={formik} />
          </>
        )}
        <Space size={24} />
      </Container>
      <AddShareClassModal ref={addShareClassModalRef} />
    </ScollablePage>
  );
};

export default Page;

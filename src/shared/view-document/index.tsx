"use client";

import {
  LeftOutlined,
  RightOutlined,
  PrinterOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Document, Page as PDFPage } from "react-pdf";

import Typography from "@/components/typography";
import ScollablePage from "@/components/scollable-page";
import Container from "@/components/container";
import Space from "@/components/space";
import Status from "@/components/status";
import Button from "@/components/button";
import FlexBox from "@/components/flex-box";
import Avatars from "@/components/avatars";
import Loading from "@/components/loading";
import BreadCrumbs from "@/components/breadcrumbs";
import styles from "../../shared/folder-icons/page.module.scss";
import { TViewDocuments } from "@/models/registers/view-document";

const SRCS = [
  "https://picsum.photos/id/237/200/300",
  "https://picsum.photos/id/238/200/300",
  "https://picsum.photos/id/239/200/300",
];

const ViewDocument: React.FC<TViewDocuments> = ({
  data,
  currentPage,
  pageTotal,
  initing,
  setCurrentPage,
  onDocumentLoadSuccess,
  items,
}) => {
  if (initing) return <Loading size="small" />;
  if (!data) return <></>;
  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <FlexBox justifyContent="space-between">
          <BreadCrumbs items={items} activeItem={data.name} />
          <FlexBox>
            <Button
              icon={
                <>
                  <Space size={3} />
                  <PrinterOutlined />
                </>
              }
            />
            <Space size={16} horizontal />
            <Button
              icon={
                <>
                  <Space size={3} />
                  <DeleteOutlined />
                </>
              }
            />
            <Space size={16} horizontal />
            <Button
              icon={
                <>
                  <Space size={3} />
                  <UploadOutlined />
                </>
              }
            />
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox flexDirection="column" className={styles.infoBox}>
          <FlexBox>
            <FlexBox flexDirection="column">
              <FlexBox>
                <Space size={5} horizontal />
                <Typography gray>Last Edited</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">{data.lastEdited}</Typography>
            </FlexBox>
            <Space size={150} horizontal />
            <FlexBox flexDirection="column">
              <FlexBox>
                <Space size={5} horizontal />
                <Typography gray>Review</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">{data.review}</Typography>
            </FlexBox>
          </FlexBox>
          <Space size={25} />
          <FlexBox flexDirection="column">
            <FlexBox>
              <Space size={5} horizontal />
              <Typography gray>Notes</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data.notes}</Typography>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox className={styles.previewBox} flexDirection="column">
          <FlexBox justifyContent="space-between" alignItems="center">
            <Typography size="giant">{data.name}</Typography>
            <FlexBox>
              <Avatars sources={SRCS} />
              <Space horizontal size={24} />
              <Status color="yellow" title="In progress" />
            </FlexBox>
          </FlexBox>
          <Space size={30} />
          <FlexBox justifyContent="space-between" alignItems="center">
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage < 2}
            >
            Previous Page
            </Button>
            {pageTotal > 0 && (
              <Typography size="large">
                {currentPage}/{pageTotal}
              </Typography>
            )}
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pageTotal}
            >Next Page</Button>
          </FlexBox>

          <Space size={20} />
          <Document
            file={data.documentUrl}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <PDFPage
              pageNumber={currentPage}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </FlexBox>
      </Container>
    </ScollablePage>
  );
};

export default ViewDocument;

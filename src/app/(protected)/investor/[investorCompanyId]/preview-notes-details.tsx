import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Col, Row } from 'antd';

import FlexBox from '@/components/flex-box';
import Typography from '@/components/typography';
import Space from '@/components/space';
import Modal from '@/components/modal';
import { TNotes } from './add-modal'
import DraftEditor from '@/components/draft-editor'

type IProps = {
  data?: TNotes | null;
  fetchDetails?: () => void;
};

const PreviewNotesDetails = forwardRef(
  ({ data }: IProps, ref) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          setOpen(true);
        },
        close: () => setOpen(false),
      }),
      []
    );

    const handleCancel = () => {
      setOpen(false);
    };

    return (
      <Modal open={open} width={970} onCancel={handleCancel}>
        <Space size={10} />
        <>
          <FlexBox justifyContent='space-between'>
            <Typography size='giant'>Notes Details</Typography>

          </FlexBox>
          <Space size={16} />
          <FlexBox flexDirection='column'>
            <Row gutter={[30, 0]}>
              <Col span={24}>
                <FlexBox flexDirection='column'>
                  <Row gutter={[30, 0]}>
                    <Col span={12}>
                      <Typography gray size="large">
                        Date / Time
                      </Typography>
                      <Typography size="big">{data?.date || "-"}</Typography>
                    </Col>
                    <Col span={12}>
                      <Typography gray size="large">
                        Subject
                      </Typography>
                      <Typography size="big">{data?.subject || "-"}</Typography>
                    </Col>
                  </Row>

                  <Space size={15} />
                </FlexBox>
              </Col>
            </Row>
            <Row gutter={[30, 0]}>
              <Col span={24}>
                <FlexBox flexDirection='column'>
                  <Row gutter={[30, 0]}>
                    <Col span={12}>
                      <Typography gray size="large">
                        User
                      </Typography>
                      <Typography size="big">{data?.user || "-"}</Typography>
                    </Col>
                    <Col span={12}>
                      <Typography gray size="large">
                        Notes Field
                      </Typography>
                      <DraftEditor viewOnly defaultValue={data?.description} />
                    </Col>

                  </Row>

                  <Space size={15} />
                </FlexBox>
              </Col>
            </Row>
          </FlexBox>
        </>
      </Modal>
    );
  }
);

PreviewNotesDetails.displayName = "PreviewNotesDetails";

export default PreviewNotesDetails;

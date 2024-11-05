import React, { forwardRef } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

import FlexBox from "@/components/flex-box";
import Space from "@/components/space";
import Field from "@/components/field";
import styles from "./page.module.scss";

const TransactionBiblesForm = forwardRef(({ formik }: { formik: any }, ref) => {
  return (
    <div className={styles.addFolderModal}>
      <FlexBox>
        <FlexBox flexDirection="column" flex={1}>
          <Field label="Date" errorMessage={formik.errors.metadata?.date}>
            <DatePicker
              name="metadata.date"
              size="large"
              placeholder="__/__/____"
              format="DD/MM/YYYY"
              onChange={(value) =>
                formik.setFieldValue("metadata.date", value?.toISOString())
              }
              value={
                formik.values.metadata?.date &&
                dayjs(formik.values.metadata?.date)
              }
              status={formik.errors.metadata?.date && "error"}
            />
          </Field>
        </FlexBox>
        <Space horizontal size={24} />
        <FlexBox flexDirection="column" flex={1}>
          <div></div>
        </FlexBox>
      </FlexBox>
    </div>
  );
});
TransactionBiblesForm.displayName = "TransactionBiblesForm";

export default TransactionBiblesForm;

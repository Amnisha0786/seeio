import React from "react";

import FlexBox from "@/components/flex-box";
import Space from "@/components/space"
import Status from "@/components/status";
import Typography from "@/components/typography";
import { TVdrs } from '@/models';

const VdrList = ({ vdrList }: { vdrList?: TVdrs[] }) => {
  return (
    <>
      {vdrList && vdrList?.length > 0 && (
        <>
          <Typography gray>VDRs in which document is already present</Typography>
          <Space size={15} />
          <FlexBox flexDirection="column">
            <FlexBox alignItems="flex-start" gap={5}>
              {vdrList?.map((item, index) => {
                return <Status title={item?.label || ""} color={"green"} key={index} />;
              })}
            </FlexBox>
          </FlexBox>
        </>
      )}
    </>
  );
};

export default VdrList;

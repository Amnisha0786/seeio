import dayjs from "dayjs";

import { LABEL } from '@/constants';

export const getLabelAndData = (
  slice: boolean,
  graphData: any,
  additionalData?: any,
  type?: string,
  key?: string,
  length?: number,
) => {
  const data = additionalData?.length ? additionalData : graphData
  const dataKey = key ? key : ''
  const isLabel = type === LABEL;
  const sliceLength = 6
  if (!data?.length) return []

  if (data?.length > sliceLength && slice) {
    return data
      ?.slice((length ? length : data.length) - sliceLength, (length ? length : data.length))
      ?.map((item: any) =>
        isLabel ? dayjs(item[dataKey]).format("MMM") : item[dataKey]
      );
  } else {
    return data?.map((item: any) =>
      isLabel ? dayjs(item[dataKey]).format("MMM") : item[dataKey]
    );
  }
};

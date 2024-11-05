import decamelizeKeys from "decamelize-keys";

import { MainApi } from "./endpoint";
import { TRisksFormValues } from "@/models/strategic-risks";

export const getStrategicRisks = (companyId: string) => {
  return MainApi.get(`/company/${companyId}/risk/list`,{} ,(result)=>result ,true);
};

export const createStrategicRisk = (
  companyId: string,
  details: TRisksFormValues
) => {
  return MainApi.post(
    `/company/${companyId}/risk`,
    decamelizeKeys(details, { deep: true })
  );
};

export const viewStrategicRisk = (companyId: string, riskId: string) => {
  return MainApi.get(`/company/${companyId}/risk/${riskId}`);
};

export const updateStrategicRisk = (
  companyId: string,
  riskId: string,
  details: TRisksFormValues
) => {
  return MainApi.patch(
    `/company/${companyId}/risk/${riskId}`,
    decamelizeKeys(details, { deep: true })
  );
};

export const deleteStrategicRisk = (companyId: string, riskId: string) => {
  return MainApi.delete(`/company/${companyId}/risk/${riskId}`);
};

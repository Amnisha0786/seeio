import decamelizeKeys from "decamelize-keys";

import { TPeople } from '@/models'
import { MainApi } from "./endpoint";
import { TRegisterItem, Update } from '../models/registers/register';
import { TDeletePayload, TRecordDocumentUpload } from ".";

type TGetPeopleRes = {
  numPeople: 2
  people: TPeople[]
}

export const getRegisters = (companyId: string) => {
  return MainApi.get(`/company/${companyId}/registers/list`);
};

export const getRegisterRecords = (companyId: string, registerCategoryId: string) => {
  return MainApi.get(`/company/${companyId}/registers/${registerCategoryId}/list`);
};

export const getPeoplesByDepartment = (companyId: string) => {
  return MainApi.get(`/company/${companyId}/people/list?sort_by_department=true`);
};

export const getPeoples = (companyId: string): Promise<TGetPeopleRes> => {
  return MainApi.get(`/company/${companyId}/people/list`);
};

export const getRegisterDetails = (companyId: string, registerCategoryId: string) => {
  return MainApi.get(`/company/${companyId}/registers/${registerCategoryId}`);
};

export const createRegister = async (
  details: TRegisterItem,
  registerCategoryId: string,
  companyId?: string,
) => {

  const response = await MainApi.post(
    `/company/${companyId}/registers/${registerCategoryId}/document`,
    decamelizeKeys(details, { deep: true })
  );

  if (response?.additionalUploadUrls?.length) {

    const promises: Promise<any>[] = []
    response?.additionalUploadUrls.map((binary: any, index: number) => {
      if (binary?.uploadUrl && details?.fileBinary?.length) {
        const promise = fetch(binary?.uploadUrl, {
          method: 'PUT',
          body: details?.fileBinary?.[index]
        })

        promises.push(promise)
      }
    })
    if (promises.length) {
      await Promise.all(promises)
    }

  } else {
    const upload_url = response?.uploadUrl;

    if (upload_url) {
      await fetch(upload_url, {
        method: 'PUT',
        body: details.fileBinary
      });
    }
  }

  if (response?.complaintUpdate && response?.complaintUpdate?.length) {
    if (details?.metadata?.updates?.length) {
      const promises: Promise<any>[] = []
      details?.metadata?.updates?.map((update, index) => {
        if (response?.complaintUpdate?.[index]?.uploadUrl) {
          const promise = fetch(response?.complaintUpdate?.[index]?.uploadUrl, {
            method: 'PUT',
            body: update.fileBinary
          })

          promises.push(promise)
        }
      })

      if (promises.length) {
        await Promise.all(promises)
      }
    }
  }

  return response;
};

export const viewRegisterDocument = (registerCategoryId: string, documentId: string, companyId?: string) => {
  return MainApi.get(`/company/${companyId}/registers/${registerCategoryId}/document/${documentId}`);
};

export const updateRegisterDocument = async (
  details: any,
  registerCategoryId: string,
  documentId: string,
  companyId?: string,
) => {

  const response = await MainApi.patch(
    `/company/${companyId}/registers/${registerCategoryId}/document/${documentId}`,
    decamelizeKeys(details, { deep: true })
  );

  const upload_url = response?.uploadUrl;

  if (upload_url) {
    await fetch(upload_url, {
      method: 'PUT',
      body: details.fileBinary
    });
  }

  if (response?.newComplaintUpdates && response?.newComplaintUpdates?.length) {
    if (details?.newUpdates?.length) {
      const promises: Promise<any>[] = []
      details?.newUpdates?.map((update: Update, index: number) => {
        if (response?.newComplaintUpdates?.[index]?.uploadUrl) {
          const promise = fetch(response?.newComplaintUpdates?.[index]?.uploadUrl, {
            method: 'PUT',
            body: update.fileBinary
          })
          promises.push(promise)
        }
      })

      if (promises.length) {
        await Promise.all(promises)
      }
    }
  }

  return response;
};

export const deleteRegisterDocument = (
  registerCategoryId: string,
  documentId: string,
  companyId?: string
) => {
  return MainApi.delete(`/company/${companyId}/registers/${registerCategoryId}/document/${documentId}`);
};

export const uploadAdditionalDocument = async (
  companyId: string,
  registerCategoryId: string,
  documentId: string,
  payload: TRecordDocumentUpload,
  fileBinary: any
) => {
  const response =
    await MainApi.patch(`/company/${companyId}/registers/${registerCategoryId}/document/${documentId}/add-documents`, decamelizeKeys(payload))
  if (response?.additionalUploadUrls?.length) {

    const promises: Promise<any>[] = []
    response?.additionalUploadUrls.map((binary: any, index: number) => {
      if (binary?.uploadUrl && fileBinary?.length) {
        const promise = fetch(binary?.uploadUrl, {
          method: 'PUT',
          body: fileBinary?.[index]
        })

        promises.push(promise)
      }
    })
    if (promises.length) {
      await Promise.all(promises)
    }

  }
  return response;
}

export const deleteRegisterDocuments = (
  companyId: string,
  registerCategoryId: string,
  documentId: string,
  payload: TDeletePayload
) => {
  return MainApi.patch(`/company/${companyId}/registers/${registerCategoryId}/document/${documentId}/remove-documents`,
    decamelizeKeys(payload));
};

export const getAllResolutions = (companyId: string) => {
  return MainApi.get(`/company/${companyId}/resolution-number/list`);
}

export const getSummaryInformationCodes = (companyId: string, categoryEnum: string) => {
  return MainApi.get(`/company/${companyId}/codes-and-passwords?category=${categoryEnum} `);
}

export const addNewDocument = (companyId?: string, payload?: any) => {
  return MainApi.post(`/company/${companyId}/codes-and-passwords`, decamelizeKeys(payload));
}

export const editDocument = (companyId?: string, payload?: any) => {
  return MainApi.patch(`/company/${companyId}/codes-and-passwords`, decamelizeKeys(payload));
}

export const deleteDocument = (companyId?: string, payload?: any) => {
  return MainApi.delete(`/company/${companyId}/codes-and-passwords`, decamelizeKeys(payload));
}

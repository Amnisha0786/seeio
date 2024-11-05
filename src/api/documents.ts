import decamelizeKeys from "decamelize-keys";

import mockApi from "@/utils/mock-api";
import { TDocument, TStorageObject, TRecordDocument } from "@/models";
import { MainApi } from "./endpoint";

type TAddDocumentPayload = {
  title: string;
};

export type TGetRecordDetailsResponse = {
  items: TStorageObject[];
  name: string;
  id: string;
};

type TValues = {
  title: string;
  fileName: string;
  documentDate?: string;
  notes?: string
  fileBinary?: ArrayBuffer
}

export type TRecordDocumentUpload = {
  additionalFileNames: string[]
}

export type TDeletePayload = {
  additionalFileIds: string[]
}

export const addDocument = (payload: TAddDocumentPayload): Promise<any> => {
  return mockApi({
    data: payload,
  });
}

export const addMeetingPackDocument = async (
  companyId: string,
  meetingId: string,
  values: TValues
) => {
  const response: any = await MainApi.post(
    `/company/${companyId}/meeting/${meetingId}/meeting-pack`,
    decamelizeKeys(values, { deep: true })
  );
  const upload_url = response.uploadUrl;

  if (upload_url) {
    await fetch(upload_url, {
      method: "PUT",
      body: values.fileBinary,
    });
  }

  return response;
};

export const addRecordDocument = async (
  companyId: string,
  recordCategoryId: string,
  payload: any
) => {
  const response: any = await MainApi.post(
    `/company/${companyId}/records/${recordCategoryId}/document`,
    decamelizeKeys(payload, { deep: true })
  );
  if (response?.additionalUploadUrls?.length) {

    const promises: Promise<any>[] = []
    response?.additionalUploadUrls.map((binary: any, index: number) => {
      if (binary?.uploadUrl && payload?.fileBinary?.length) {
        const promise = fetch(binary?.uploadUrl, {
          method: 'PUT',
          body: payload?.fileBinary?.[index]
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
        body: payload.fileBinary
      });
    }
  }

  return response;
};

export const addFolder = (
  companyId: string,
  recordCategoryId: string,
  payload: any
) => {
  return MainApi.post(
    `/company/${companyId}/records/${recordCategoryId}/folder`,
    decamelizeKeys(payload, { deep: true })
  );
};

export const getDocument = (id: string): Promise<TDocument> => {
  return mockApi({
    data: {
      id,
      name: "Test Document",
      lastEdited: "21/ 01/ 2023",
      review: "21/ 01/ 2023",
      notes:
        "Lorem ipsum dolor sit amet consectetur." +
        "Pharetra pretium blandit mollis tellus ut est massa tellus." +
        "In egestas integer lectus lectus mattis ut." +
        "Justo risus faucibus magna aliquam ornare venenatis feugiat." +
        "Morbi ornare ipsum interdum vehicula duis faucibus euismod.",
      documentUrl: "/sample.pdf",
    },
  });
};

export const getRecords = (companyId: string) => {
  return MainApi.get(`/company/${companyId}/records/list`);
};

export const deleteRecordFolder = (recordCategoryId: string, folderId: string, companyId?: string) => {
  return MainApi.delete(`/company/${companyId}/records/${recordCategoryId}/folder/${folderId}`);
};

export const deleteRecordDocument = (recordCategoryId: string, documentId: string, companyId?: string) => {
  return MainApi.delete(`/company/${companyId}/records/${recordCategoryId}/document/${documentId}`);
};

export const getRecordDocumentList = (
  companyId: string,
  recordCategoryId: string
) => {
  return MainApi.get(`/company/${companyId}/records/${recordCategoryId}/list`);
};

export const getRecordDocumentDetails = (
  companyId: string,
  recordCategoryId: string
) => {
  return MainApi.get(`/company/${companyId}/records/${recordCategoryId}`);
};

export const getRecordFolder = (
  companyId: string,
  folderId: string,
  recordCategoryId: string
) => {
  return MainApi.get(`/company/${companyId}/records/${recordCategoryId}/folder/${folderId}`);
};

export const getRecordDocument = ({
  companyId,
  documentId,
  recordCategoryId
}: {
  companyId: string;
  documentId: string;
  recordCategoryId: string;
}): Promise<TRecordDocument> => {
  return MainApi.get(`/company/${companyId}/records/${recordCategoryId}/document/${documentId}`);
};

export const updateRecordDocument = async (
  data: TRecordDocument,
  documentId: string,
  recordCategoryId: string,
  companyId?: string,
) => {
  const response = await MainApi.patch(
    `/company/${companyId}/records/${recordCategoryId}/document/${documentId}`,
    decamelizeKeys(data, { deep: true })
  );
  const upload_url = response?.uploadUrl;

  if (upload_url) {
    await fetch(upload_url, {
      method: 'PUT',
      body: data.fileBinary
    });
  }
  return response;
};

export const uploadAdditionalDocuments = async (
  companyId: string,
  recordCategoryId: string,
  documentId: string,
  payload: TRecordDocumentUpload,
  fileBinary: any
) => {
  const response =
    await MainApi.patch(`/company/${companyId}/records/${recordCategoryId}/document/${documentId}/add-documents`, decamelizeKeys(payload))
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

export const deleteRecordDocuments = (
  companyId: string,
  recordCategoryId: string,
  documentId: string,
  payload: TDeletePayload
) => {
  return MainApi.patch(`/company/${companyId}/records/${recordCategoryId}/document/${documentId}/remove-documents`,
    decamelizeKeys(payload));
};

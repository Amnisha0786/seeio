import { simulateApiResponse } from '@/utils/mock-api';
import { MainApi } from './endpoint'
import { AddCode } from '@/models/pass-store';

export const getPassStores = () => {
  return MainApi.get(`/pass-stores`)
}

export const getMockPassStores = () => {
  const data = [
    {
      id: "123123",
      name: "File 1",
      description: "lorem",
      password: "lorem",
      status: "pending",
    },
    {
      id: "1231236",
      name: "File 2",
      description: "lorem",
      password: "lorem",
      status: "pending",
    },
    {
      id: "12312368",
      name: "File 3",
      description: "lorem",
      password: "lorem",
      status: "pending",
    },
    {
      id: "123123689",
      name: "Folder 1",
      description: "lorem",
      password: "lorem",
      status: "pending",
    },
    {
      id: "123123659",
      name: "Folder 2",
      description: "lorem",
      password: "lorem",
      status: "pending",
    },
  ];

  return simulateApiResponse({ items: data });
}

export const getMockCodePassStores = () => {
  const data = [
    {
      id: "123123",
      name: "File 1",
      description: "lorem",
      code1: "lorem",
      code1Name: "lorem",
      code2: "lorem",
      status: "pending",
    },
    {
      id: "1231236",
      name: "File 2",
      description: "lorem",
      code1: "lorem",
      code1Name: "lorem",
      code2: "lorem",
      status: "pending",
    },
    {
      id: "12312368",
      name: "File 3",
      description: "lorem",
      code1: "lorem",
      code1Name: "lorem",
      code2: "lorem",
      status: "pending",
    },
    {
      id: "123123689",
      name: "Folder 1",
      description: "lorem",
      code1: "lorem",
      code1Name: "lorem",
      code2: "lorem",
      status: "pending",
    },
    {
      id: "123123659",
      name: "Folder 2",
      description: "lorem",
      code1: "lorem",
      code1Name: "lorem",
      code2: "lorem",
      status: "pending",
    },
  ];

  return simulateApiResponse({ items: data });
}

export const createPassStore = (details: AddCode) => {
  return MainApi.post(`/pass-store`, details)
}

export const createMockPassStore = (details: AddCode) => {
  return simulateApiResponse({
    message: "Pass store successfully added",
    data: details
  })
}
export const updatePassStore = (details: AddCode) => {
  return MainApi.put(`/pass-store`, details)
}

export const updateMockPassStore = (details: AddCode) => {
  return simulateApiResponse({
    message: "Pass store successfully added",
    data: details
  })
}

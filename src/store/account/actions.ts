import { createAsyncThunk, createAction } from '@reduxjs/toolkit';

import * as API from '@/api'

export const getAccountInfo = createAsyncThunk("ACCOUNT/GET_ACCOUNT_INFO", API.getAccountInfo);
export const setSelectedCompanyId = createAction<string>("ACCOUNT/SET_SELECTED_COMPANY_ID");

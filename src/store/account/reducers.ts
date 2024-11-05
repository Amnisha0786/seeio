import { createReducer } from '@reduxjs/toolkit';

import { TUserCompany } from '@/models'
import { getAccountInfo, setSelectedCompanyId } from './actions';

export interface AccountState {
  companies: TUserCompany[]
  selectedCompanyId: string | null
}

export const defaultState: AccountState = {
  companies: [],
  selectedCompanyId: null
};

export default createReducer<AccountState>(defaultState, builder => {
  builder
    .addCase(getAccountInfo.fulfilled, (state, { payload }) => {
      state.companies = payload.companies

      if (payload.companies?.length > 0) {
        state.selectedCompanyId = payload.companies[0].companyId
      }
    })
    .addCase(setSelectedCompanyId, (state, { payload }) => {
      state.selectedCompanyId = payload
    })
})

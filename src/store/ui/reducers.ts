import { createReducer } from '@reduxjs/toolkit';

import { TBreadCrumb } from '@/models'
import { setBreadcrumbs, setBreadcrumbHistory } from './actions';

export interface UiState {
  breadcrumbs: TBreadCrumb[]
  breadcrumbHistory: TBreadCrumb[][]
}

export const defaultState: UiState = {
  breadcrumbs: [],
  breadcrumbHistory: []
};

export default createReducer<UiState>(defaultState, builder => {
  builder
    .addCase(setBreadcrumbs, (state, { payload }) => {
      state.breadcrumbs = payload
    })
    .addCase(setBreadcrumbHistory, (state, { payload }) => {
      state.breadcrumbHistory = payload
    })
})

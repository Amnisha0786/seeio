import { createAction } from '@reduxjs/toolkit';

import { TBreadCrumb } from '@/models'

export const setBreadcrumbs = createAction<TBreadCrumb[]>("UI/SET_BREADCRUMBS");
export const setBreadcrumbHistory = createAction<TBreadCrumb[][]>("UI/SET_BREADCRUMB_HISTORY");

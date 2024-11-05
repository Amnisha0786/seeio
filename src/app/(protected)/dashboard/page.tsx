'use client';

import React from 'react';

import { USER_TYPE } from '@/models';
import { useAccessLevel } from '@/hooks';
import Loading from '@/components/loading';
import Dashboard from './dashboard';
import InvestorDashboard from './investor/investor';

const Page = () => {
  const userAccess = useAccessLevel()

  if (!userAccess?.userType) {
    return <Loading size='small' />
  }

  if (userAccess?.userType?.toLowerCase() === USER_TYPE.INVESTOR) {
    return <InvestorDashboard />
  }
  
  return <Dashboard />
};

export default Page;

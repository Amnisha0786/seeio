"use client"

import { useEffect, useState } from 'react'
import { Amplify, ResourcesConfig } from "aws-amplify";
import { useRouter, usePathname } from 'next/navigation'
import { FetchUserAttributesOutput, fetchAuthSession } from 'aws-amplify/auth';
import { defaultStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

import config from '../aws-exports';
import { listenToAutoSignInEvent } from '@/api';
import { handleRedirection, useAccessLevel } from '@/hooks';
import { COMPANY_USER_ACCESS_LEVEL, USER_TYPE } from '@/models';
import { useAuthenticatedUser } from '@/hooks';
import useAmplitudeContext from '@/hooks/amplitude';

const authConfig: ResourcesConfig['Auth'] = {
  Cognito: {
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
    userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || ""
  }
};

Amplify.configure({
  ...config,
  Auth: authConfig
}, { ssr: true });

cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);

const AUTH_ROUTES = ["/login", "/forgot-password", "/signup", "/setup"]

const hidePreloading = (): void => {
  const preloading = document.getElementById(('preloading'))

  if (!preloading) return

  const fadeEffect = setInterval(() => {
    if (!preloading.style.opacity) {
      preloading.style.opacity = '1'
    }
    if (preloading.style.opacity === '1') {
      preloading.style.opacity = '0'
    } else {
      clearInterval(fadeEffect)
      preloading.style.display = 'none'
    }
  }, 500)
}

const Init = ({ children }: { children: React.ReactNode }) => {
  const [inited, setInited] = useState(false);
  const router = useRouter()
  const pathname = usePathname()
  const userAccess = useAccessLevel()
  const user = useAuthenticatedUser();
  const { initializeUser } = useAmplitudeContext();

  useEffect(() => {
    if (userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BILLING_ADMIN) {
      listenToAutoSignInEvent();
    } else {
      listenToAutoSignInEvent(true);
    }

    const fetchData = async () => {
      try {
        const { idToken } = (await fetchAuthSession()).tokens ?? {};
        if (idToken) {
          handleRedirection(pathname, userAccess, router);
        } else {
          if (!AUTH_ROUTES.includes(pathname as string)) {
            router.push("/login");
          }
        }
      } catch (error) {
        if (!AUTH_ROUTES.includes(pathname as string)) {
          router.push("/login");
        }
      } finally {
        setInited(true);
      }
    }
    hidePreloading()
    fetchData()
    // eslint-disable-next-line
  }, [userAccess]);

  useEffect(() => {
    if (userAccess) {
      hidePreloading()
    }
  }, [userAccess])

  useEffect(() => { //INIT Analytics User Ids
    const initAnalytics = async () => {
      const attributes = user as FetchUserAttributesOutput

      if (attributes) {
        initializeUser(attributes.sub!, attributes.email!, attributes.given_name!, attributes.family_name!);
      }

    }

    initAnalytics();
  }, [user]);

  return inited && (
    <>
      {children}
    </>
  )
}

export default Init;

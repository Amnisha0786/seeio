import { useState, useEffect } from 'react';
import { FetchUserAttributesOutput, fetchAuthSession } from 'aws-amplify/auth';

import * as API from '@/api'

interface IUser {
  given_name?: string;
  family_name?: string;
  email?: string;
  is_verified?: boolean;
  sub?: string
}

export const useAuthenticatedUser = (): IUser | FetchUserAttributesOutput | undefined => {
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    const fetchUser = async () => {
      const session = (await fetchAuthSession()) ?? {};

      const idToken = session?.tokens?.idToken;

      if (idToken) {
        const attributes = await API.fetchAttributes()
        setUser(attributes);
      }
    };
    fetchUser();
  }, []);

  return user;
};

export const useUserName = (): string => {
  const user = useAuthenticatedUser();

  return `${user?.family_name ?? ''} ${user?.given_name ?? ''}`.trim()
}

import {
  resetPassword,
  updatePassword,
  signUp, confirmSignUp,
  updateMFAPreference,
  autoSignIn,
  confirmSignIn,
  confirmResetPassword,
  signIn,
  updateUserAttributes,
  fetchUserAttributes,
  signOut,
  verifyTOTPSetup
} from "aws-amplify/auth";
import { fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import router from "next/router";
import { MainApi } from "./endpoint";

interface UserPreference {
  sms?: "PREFERRED" | "ENABLED"
  totp?: "PREFERRED"
}

export interface ISignUpResult {
  user: any;
  userConfirmed: boolean;
  userSub: string;
  codeDeliveryDetails: CodeDeliveryDetails;
}

export interface CodeDeliveryDetails {
  AttributeName: string;
  DeliveryMedium: string;
  Destination: string;
}

export const checkAPIStatus = (): Promise<any> => {
  return MainApi.get(`/health`);
};

export const signInUser = ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<any> => {
  return signIn({ username: email?.toLowerCase(), password });
};

export const signOutUser = (): Promise<any> => {
  return signOut();
};

export const forgotPassword = (email: string): Promise<any> => {
  return resetPassword({ username: email?.toLowerCase() });
};

export const forgotPasswordSubmit = (
  email: string,
  code: string,
  newPassword: string
): Promise<any> => {
  return confirmResetPassword({ username: email, confirmationCode: code, newPassword });
};

export const signUpUser = (
  email: string,
  phone: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<any> => {
  return signUp({
    username: email?.toLowerCase(),
    password,
    options: {
      userAttributes: {
        given_name: lastName,
        family_name: firstName,
        phone_number: phone,
      },
      autoSignIn: false,
    },

  });
};

export const handleSignUpConfirmation = (email: string, code: string, isMarketingConsent: boolean): Promise<any> => {
  return confirmSignUp({
    confirmationCode: code,
    username: email,
    options: {
      clientMetadata: {
        is_marketing_consent: isMarketingConsent ? "true" : "false"
      }
    }
  });
};

export const autoSignInUser = async () => {
  return autoSignIn();
}

export const handleUpdateMFAPreference = (preference: UserPreference) => {
  return updateMFAPreference(preference)
}

export const handleSignInConfirmation = (otpCode: string) => {
  return confirmSignIn({ challengeResponse: otpCode })
}

export const setupTOTP = (user: any): Promise<any> => {
  return setupTOTP(user);
};

export const verifyTOTP = (code: string): Promise<any> => {
  return verifyTOTPSetup({ code });
};

export const currentAuthenticatedUser = (): Promise<any> => {
  return fetchAuthSession();
};

export const updateAttributes = ({
  givenName,
  familyName,
  marketingPreferences,
}: {
  givenName: string;
  familyName: string;
  marketingPreferences?: boolean;
}): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      await updateUserAttributes(
        {
          userAttributes: {
            given_name: givenName,
            family_name: familyName,
          },
          options: {
            clientMetadata: {
              marketing_preferences: marketingPreferences ? "true" : "false",
            }
          }
        }
      );
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchAttributes = () => {
  return fetchUserAttributes()
}

export const changePassword = ({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      await updatePassword({ oldPassword, newPassword });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const listenToAutoSignInEvent = function (isBillingAdmin?: boolean) {
  Hub.listen("auth", ({ payload }) => {
    const { event } = payload;
    if (event === "signedIn") {
      if (!isBillingAdmin) {
        router.push("/dashboard");
      } else {
        router.push("/profile");
      }
    } else if (event === "signInWithRedirect_failure" || event === "signedOut" || event === "tokenRefresh_failure") {
      router.push("/login");
    }
  });
};

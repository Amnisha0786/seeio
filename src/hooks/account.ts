import { useAppSelector, useAuthenticatedUser } from '@/hooks'
import { COMPANY_USER_ACCESS_LEVEL, TCompanyUserAccess, TUserCompany } from '@/models'
import { useSelector } from 'react-redux'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import { FetchUserAttributesOutput } from 'aws-amplify/auth'
import { setSelectedCompanyId } from '@/store/actions'
import { useDispatch } from 'react-redux'

const AUTH_ROUTES = ["/login", "/forgot-password", "/signup", "/setup", "/choose-mfa"]

export const useSelectedAccountCompany = (): TUserCompany | undefined => {
  let attributes:any
  const user = useAuthenticatedUser();

  if(user){
    attributes = user as FetchUserAttributesOutput
  }
  let storedCompanyObejct: any
  const { companies } = useAppSelector(({ account }) => account);
  const accessLevel = useAccessLevel()
  const storedSelectedCompanyId = localStorage.getItem('companyObject');
  if(storedSelectedCompanyId){
    storedCompanyObejct = JSON.parse(storedSelectedCompanyId) 
  }else{
    storedCompanyObejct = ''
  }
  const dispatch = useDispatch();

  let selectedCompany
  if (companies?.length) {
    if (storedCompanyObejct[`${accessLevel?.userId ? accessLevel?.userId :attributes?.sub}`] !== undefined) {
      selectedCompany = companies.find(
        (item: { companyId: string }) => item.companyId === storedCompanyObejct[`${accessLevel?.userId ? accessLevel?.userId :attributes?.sub }`]
      );
      if(!selectedCompany){
        selectedCompany = companies[0]
      }
    } else {
      selectedCompany = companies[0]
      if(attributes?.sub || accessLevel?.userId){
        localStorage.setItem('companyObject', JSON.stringify({
          ...storedCompanyObejct,
          [`${accessLevel?.userId ? accessLevel?.userId : attributes?.sub }`]:companies[0]?.companyId,
        }));
      }
      dispatch(setSelectedCompanyId(selectedCompany.companyId))
    }
  }
  return selectedCompany;
};

export const useCompanyRole = (): "company" | "investor" | undefined => {
  const company = useSelectedAccountCompany()

  return company?.userType ? company?.userType?.toLowerCase() as ("company" | "investor") : undefined;
};

export const useAccessLevel = (): TCompanyUserAccess | undefined => {
  const { accessLevel } = useSelector((state: any) => state.acessLevel)

  return accessLevel
};

export const handleRedirection = async (
  pathname: string | null,
  userAccess: TCompanyUserAccess | undefined,
  router: AppRouterInstance
) => {
  if (AUTH_ROUTES.includes(pathname || "") || pathname === "/") {
    if (userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BILLING_ADMIN) {
      router.push("/dashboard")
    } else {
      router.push("/profile")
    }
  }
}

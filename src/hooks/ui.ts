import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { TBreadCrumb } from '@/models'
import { useAppSelector } from '@/hooks'
import { setBreadcrumbs, setBreadcrumbHistory } from '@/store/actions'

export const useBreadcrumbHistory = () => {
  const dispatch = useDispatch()
  const items = useAppSelector(({ ui }) => ui.breadcrumbHistory)

  const set = useCallback((values: TBreadCrumb[][]) => {
    dispatch(setBreadcrumbHistory(values))
  }, [dispatch])

  const add = useCallback((value: TBreadCrumb[]) => {
    dispatch(setBreadcrumbHistory(items.concat([value])))
  }, [items, dispatch])

  const pop = useCallback(() => {
    dispatch(setBreadcrumbHistory(items.slice(0, items.length - 1)))

    return items[items.length - 1] || []
  }, [items, dispatch])

  return { items, set, add, pop }
};

export const useBreadcrumbs = () => {
  const dispatch = useDispatch()
  const items = useAppSelector(({ ui }) => ui.breadcrumbs)
  const breadcrumbHistory = useBreadcrumbHistory()

  const set = useCallback((values: TBreadCrumb[]) => {
    dispatch(setBreadcrumbs(values))
  }, [dispatch])

  const add = useCallback((value: TBreadCrumb) => {
    const itemExist = items?.filter((item) => item?.link === value?.link)
    if (itemExist?.length === 0) {
      breadcrumbHistory.add(items)
      dispatch(setBreadcrumbs(items.concat([value])))
    }
  }, [breadcrumbHistory, items, dispatch])

  const pop = useCallback((index?: number) => {
    breadcrumbHistory.add(items)
    dispatch(setBreadcrumbs(items.slice(0, index ? index + 1 : items.length - 1)))
  }, [breadcrumbHistory, items, dispatch])

  const back = useCallback(() => {
    dispatch(setBreadcrumbs(breadcrumbHistory.pop()))
  }, [breadcrumbHistory, dispatch])

  return { items, set, add, pop, back }
};

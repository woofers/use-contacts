import { useState, useCallback, useMemo, useEffect, useRef } from 'react'

type ContactAddress = {
  addressLine?: string
  city?: string
  country?: string
  dependentLocality?: string
  organization?: string
  phone?: string
  postalCode?: string
  recipient?: string
  region?: string
  sortingCode?: string
  toJSON: () => string
}

export type Contact = {
  address: ContactAddress[]
  email: string[]
  icon: Blob
  name: string[]
  tel: string[]
}

declare global {
  interface Navigator {
    contacts?: {
      ContactsManager: {}
      getProperties: () => Promise<string[]>
      select: (properties: string[], options?: { multiple?: boolean }) => Promise<Contact[]>
    }
  }
}

const isSupported = () =>
  typeof window !== 'undefined' && 'contacts' in window.navigator

const __isDev__ = true
const resolveError = () => {
  let error = 'Unsupported browser.'
  // istanbul ignore next
  if (__isDev__) {
    error =
      'Unsupported browser: no Contact Picker API in Navigator. Check https://developer.mozilla.org/en-US/docs/Web/API/Contact_Picker_API.'
  }
  throw new Error(error)
}

const memo = <T, K extends string>(func: () => T | Promise<T>, key: K) => {
  const cache: Record<string, T> = {}
  const wrapper = async () => {
    if (cache[key]) return cache[key]
    try {
      const result = await func()
      cache[key] = result
      return result
    } catch (e) {
      cache[key] = [] as T
      throw e
    }
  }
  return wrapper
}

const checkProperties = memo(async () => {
  const supportedProperties = (await window.navigator.contacts?.getProperties()) ?? [];
  return supportedProperties
}, 'gp')

const createInstance = (options?: {}) => isSupported() && window.navigator.contacts

const useIsSupported = () => {
  const mounted = useRef<boolean>()
  const [data, setData] = useState(false)
  useEffect(() => {
    mounted.current = true
    setData(isSupported())
    return () => {
      mounted.current = false
    }
  }, [])
  const supported = useCallback(() => data, [data])
  return [mounted, supported] as const
}

const wrap = <T extends (...args: any) => any>(func: T) => (...args: Parameters<T>) => func(...args)

const createHelpers = (options?: {}) => {
  const contacts = createInstance(options) || { select: resolveError, getProperties: resolveError }
  return { select: wrap(contacts.select), getProperties: wrap(contacts.getProperties) }
}

export const useContact = (options?: {}) => {
  const { getProperties, select: selectOg } = useMemo(() => createHelpers(options), [options])
  const [mounted, isSupported] = useIsSupported()
  const controller = useRef()
  const close = useCallback(() => {
  }, [])
  const select = useCallback(async <T extends string>(properties?: T[], options = { multiple: false }) => {
    if (!isSupported()) {
      return resolveError()
    }
    try {
      const props = await checkProperties()
      const data = await selectOg(properties ?? props, options)
      return data
    } catch (e) {
      console.log(e)
      throw e
    }
  }, [selectOg, isSupported])
  useEffect(() => close, [close])
  return { getProperties, select, isSupported }
}

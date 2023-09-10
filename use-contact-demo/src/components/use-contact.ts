import { useState, useCallback, useMemo, useEffect, useRef } from 'react'

type ContactAddress = {
  addressLine?: string[]
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
  icon: Blob[]
  name: string[]
  tel: string[]
}

type ContactWithProperties<T extends ContactKey> = {
  [K in T]: Contact[K]
}

type ContactKey = keyof Contact


type ContactOptions = { multiple?: boolean }

interface ContactsManager {
  getProperties: () => Promise<string[]>
  select: (properties: string[], options?: ContactOptions) => Promise<Contact[]>
}

interface Contacts extends ContactsManager {
  ContactsManager: ContactsManager
}

type ContactManagerOptions = {}

declare global {
  interface Navigator {
    contacts?: Contacts
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

const memo = <T>(func: () => T | Promise<T>) => {
  let cache: T
  return async () => {
    if (cache) return cache
    try {
      cache = await func()
      return cache
    } catch (e) {
      throw e
    }
  }
}

const createInstance = (options?: ContactManagerOptions) => isSupported() && window.navigator.contacts

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

const wrap = <T extends (...args: any) => any>(func: (...args: Parameters<T>) => ReturnType<T>) => func

const createHelpers = (options?: ContactManagerOptions) => {
  const instance = createInstance(options) || {} as never
  return {
    select: wrap<typeof instance.select>((...args) => (instance?.select || resolveError)(...args)),
    getProperties: wrap<typeof instance.getProperties>((...args) => (instance?.getProperties || resolveError)(...args))
  }
}

export const useContact = (options?: ContactManagerOptions) => {
  const { getProperties, select: selectContacts } = useMemo(() => createHelpers(options), [options])
  const [mounted, isSupported] = useIsSupported()
  const controller = useRef()
  const checkProperties = useMemo(() => memo(getProperties), [getProperties])
  const close = useCallback(() => {
  }, [])
  const select = useCallback(async <T extends ContactKey>(properties?: T[], options?: ContactOptions) => {
    if (!isSupported()) {
      return resolveError()
    }
    try {
      const props = !properties ? (await checkProperties()) : properties
      const data = await selectContacts(props, options)
      return data as ContactWithProperties<T>[]
    } catch (e) {
      throw e
    }
  }, [selectContacts, checkProperties, isSupported])
  useEffect(() => close, [close])
  return { getProperties, select, isSupported }
}

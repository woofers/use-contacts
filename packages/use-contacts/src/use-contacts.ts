import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import type {
  ContactKey,
  Contacts,
  ContactOptions,
  ContactManagerOptions,
  DefinedContactKey,
  SelectContact
} from './types'

declare global {
  interface Navigator {
    contacts?: Contacts
  }
  var __isDev__: boolean
}

const isSupported = () =>
  typeof window !== 'undefined' && 'contacts' in navigator

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
    cache = await func()
    return cache
  }
}

const createInstance = (_?: ContactManagerOptions) =>
  (isSupported() && navigator.contacts) as Contacts

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

const createHelpers = (options?: ContactManagerOptions) => {
  const instance = createInstance(options)
  return [
    (...args) =>
      instance ? instance.select(...args) : resolveError(),
    (...args) =>
      instance ? instance.getProperties(...args) : resolveError()
  ] as [(typeof instance)['select'], (typeof instance)['getProperties']]
}

const resolveOnSignal = (signal: AbortController['signal']) => {
  let onAbort: () => void
  const cancel = () => {
    if (!onAbort) return
    signal.removeEventListener('abort', onAbort)
  }
  const promise = new Promise<[]>(resolve => {
    onAbort = () => {
      resolve([])
    }
    signal.addEventListener('abort', onAbort)
  })
  return [promise, cancel] as const
}

export const useContacts = (options?: ContactManagerOptions) => {
  const [selectContacts, getProperties] = useMemo(
    () => createHelpers(options),
    [options]
  )
  const [mounted, isSupported] = useIsSupported()
  const controller = useRef<AbortController>()
  const checkProperties = useMemo(() => memo(getProperties), [getProperties])
  const cancel = useCallback(() => {
    if (!controller.current) return
    controller.current.abort()
  }, [])
  const select = useCallback(
    async <T extends ContactKey = ContactKey, K extends boolean = false>(
      properties?: DefinedContactKey<T>[],
      options?: ContactOptions<K>
    ) => {
      if (!isSupported()) {
        return resolveError()
      }
      const abort = new AbortController()
      controller.current = abort
      try {
        const props =
          !properties || !properties.length
            ? await checkProperties()
            : properties
        const [promise, cancel] = resolveOnSignal(abort.signal)
        const data = await Promise.race([
          selectContacts(props, options),
          promise
        ])
        cancel()
        return data as SelectContact<T, K>
      } catch (e) {
        if (!mounted.current) (e as { canceled?: boolean }).canceled = true
        throw e
      }
    },
    [selectContacts, checkProperties, isSupported, mounted]
  )
  useEffect(() => cancel, [cancel])
  return { getProperties, select, isSupported, cancel }
}

import {
  useContacts as useContactsDev,
  hasContacts as hasContactsDev,
  isContactError as isContactErrorDev
} from './use-contacts.dev.mjs'
import {
  useContacts as useContactsProd,
  hasContacts as hasContactsProd,
  isContactError as isContactErrorProd
} from './use-contacts.mjs'

export const useContacts =
  process.env.NODE_ENV === 'production' ? useContactsProd : useContactsDev
export const hasContacts =
  process.env.NODE_ENV === 'production' ? hasContactsProd : hasContactsDev
export const isContactError =
  process.env.NODE_ENV === 'production' ? isContactErrorProd : isContactErrorDev

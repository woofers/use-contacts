import { useContacts as useContactsDev } from './use-contacts.dev.mjs'
import { useContacts as useContactsProd } from './use-contacts.mjs'

export const useContacts = process.env.NODE_ENV === 'production' ? useContactsProd : useContactsDev

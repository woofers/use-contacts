import { useContact as useContactDev } from './use-contacts.dev.mjs'
import { useContact as useContactProd } from './use-contacts.mjs'

export const useContact = process.env.NODE_ENV === 'production' ? useContactProd : useContactDev

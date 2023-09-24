import type {
  Contact,
  ContactKey,
  ContactOptions,
  ContactManagerOptions,
  DefinedContactKey,
  SelectContact
} from './types'

export type { Contact, SelectContact, ContactKey }

export declare const useContacts: (options?: ContactManagerOptions) => {
  getProperties: () => Promise<ContactKey[]>
  select: <T extends ContactKey = ContactKey, K extends boolean = false>(properties?: readonly DefinedContactKey<T>[] | DefinedContactKey<T>[] | undefined, options?: ContactOptions<K>) => Promise<SelectContact<T, K>>
  isSupported: () => boolean
  cancel: () => void
}

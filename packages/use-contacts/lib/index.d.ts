import type { Contact, ContactKey, ContactOptions, ContactManagerOptions } from './types'

export type { Contact }

type ContactWithFields<T extends ContactKey> = Contact<T> extends infer X ? { [K in keyof X]: Contact<T>[K] } : never

export declare const useContacts: (options?: ContactManagerOptions) => {
  getProperties: () => Promise<ContactKey[]>
  select: <T extends ContactKey, K extends boolean = false>(properties?: T[] | undefined, options?: ContactOptions<K>) => Promise<K extends false ? [ContactWithFields<T>] : ContactWithFields<T>[]>
  isSupported: () => boolean
  cancel: () => void
}

import type { Contact, ContactKey, ContactOptions, ContactManagerOptions } from './types'

export type { Contact }

type IsAny<T> = unknown extends T
  ? [keyof T] extends [never] ? false : true
  : false

type ContactWithFields<T extends ContactKey> = Contact<T> extends infer X ?
    (IsAny<T> extends true ? { [K in ContactKey]: Contact<K>[K] } : { [K in keyof X]: Contact<T>[K] })
    : never

export declare const useContacts: (options?: ContactManagerOptions) => {
  getProperties: () => Promise<ContactKey[]>
  select: <T extends ContactKey = ContactKey, K extends boolean = false>(properties?: T[] | undefined, options?: ContactOptions<K>) => Promise<K extends false ? [ContactWithFields<T>] : ContactWithFields<T>[]>
  isSupported: () => boolean
  cancel: () => void
}

import type { Contact, ContactKey, ContactOptions, ContactManagerOptions } from './types'

export type { Contact }

type IsAny<T> = unknown extends T
  ? [keyof T] extends [never] ? false : true
  : false

type DefinedContactKey<T extends ContactKey> = IsAny<T> extends true ? ContactKey : T

type ContactWithFields<T extends ContactKey> = Contact<T> extends infer X ?
  { [K in keyof X]: Contact<T>[K] }
  : never



export declare const useContacts: (options?: ContactManagerOptions) => {
  getProperties: () => Promise<ContactKey[]>
  select: <T extends ContactKey = ContactKey, K extends boolean = false>(properties?: DefinedContactKey<T>[] | undefined, options?: ContactOptions<K>) => 
    Promise<K extends false ? [ContactWithFields<DefinedContactKey<T>>] : ContactWithFields<DefinedContactKey<T>>[]>
  isSupported: () => boolean
  cancel: () => void
}

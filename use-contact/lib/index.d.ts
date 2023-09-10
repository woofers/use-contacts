import type { Contact, ContactKey, ContactOptions, ContactManagerOptions } from './types'

export type { Contact }

type ContactRet<T extends ContactKey> = Contact<T> extends infer X ? { [K in keyof X]: Contact<T>[K] } : never

export declare const useContact: (options?: ContactManagerOptions) => {
  getProperties: () => Promise<ContactKey[]>
  select: <T extends ContactKey>(properties?: T[] | undefined, options?: ContactOptions) => Promise<(Contact<T> extends infer X ? { [K in keyof X]: Contact<T>[K] } : never)[]>
  isSupported: () => boolean
  cancel: () => void
}

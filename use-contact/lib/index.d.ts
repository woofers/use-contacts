import type { Contact, ContactKey, ContactOptions, ContactManagerOptions } from './types'

export type { Contact }

type ContactRet<T extends ContactKey> = Contact<T> extends infer X ? { [K in keyof X]: Contact<T>[K] } : never

export declare const useContact: (options?: ContactManagerOptions) => {
  getProperties: () => Promise<("address" | "email" | "icon" | "name" | "tel")[]>
  select: <T extends "address" | "email" | "icon" | "name" | "tel">(properties?: T[] | undefined, options?: ContactOptions) => Promise<ContactRet<T>[]>
  isSupported: () => boolean
  cancel: () => void
}

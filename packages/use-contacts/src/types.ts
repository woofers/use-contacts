export type ContactAddress = {
  addressLine?: string[]
  city?: string
  country?: string
  dependentLocality?: string
  organization?: string
  phone?: string
  postalCode?: string
  recipient?: string
  region?: string
  sortingCode?: string
  toJSON: () => string
}

export type CompleteContact = {
  address?: ContactAddress[]
  email?: string[]
  icon?: Blob[]
  name: string[]
  tel?: string[]
}

export type ContactKey = keyof CompleteContact

export type Contact<T extends ContactKey = never> = {
  [K in [T] extends [never] ? ContactKey : T]: CompleteContact[K]
}

export type Simplify<T> = { [K in keyof T]: T[K] } & {}

export type ContactOptions<K extends boolean = boolean> = { multiple?: K }

interface ContactsManager {
  getProperties: () => Promise<ContactKey[]>
  select: (
    properties: string[],
    options?: ContactOptions
  ) => Promise<CompleteContact[]>
}

export interface Contacts extends ContactsManager {
  ContactsManager: ContactsManager
}

export type ContactManagerOptions = Record<string, never>

type IsAny<T> = unknown extends T
  ? [keyof T] extends [never]
    ? false
    : true
  : false

export type DefinedContactKey<T extends ContactKey | ContactKey[]> =
  // biome-ignore lint: Any is valid on the type level
  IsAny<T> extends true ? ContactKey : T extends any[] ? T[number] : T

type ContactWithFields<T extends ContactKey> = Contact<T> extends infer X
  ? { [K in keyof X]: Contact<T>[K] }
  : never

type GetMultiple<T> = T extends boolean
  ? IsAny<T> extends true
    ? boolean
    : T
  : T extends { multiple: infer X }
    ? X extends boolean
      ? X
      : boolean
    : boolean

export type ContactError = {
  message: string
  canceled?: boolean
}

export type SelectContact<
  T extends ContactKey | ContactKey[],
  K extends boolean | ContactOptions
> = GetMultiple<K> extends false
  ? [ContactWithFields<DefinedContactKey<T>>] | []
  : ContactWithFields<DefinedContactKey<T>>[]

export {}

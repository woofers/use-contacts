type ContactAddress = {
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
} & {}

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

export type ContactManagerOptions = {}
export {}

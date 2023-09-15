import type { ContactManagerOptions, Contacts, Contact } from '../../types'

const selectMock: Contacts['select'] = async (_properties, { multiple }) => {
  const data = { name: ['Jaxson'] } as Contact
  if (multiple) {
    return [data, data]
  }
  return [data]
}

const getPropertiesMock: Contacts['getProperties'] = async () => {
  return ['address', 'email', 'icon', 'name', 'tel']
}

class Manager {
  constructor(_options?: ContactManagerOptions) {

  }

  async select(...args: Parameters<typeof selectMock>) {
    const data = await selectMock(...args)
    return data
  }

  async getProperties(...args: Parameters<typeof getPropertiesMock>) {
    const data = await getPropertiesMock(...args)
    return data
  }
}

const cast = <T>(value: unknown) => value as T

const createContactManager = () => {
  const instance = new Manager()
  const select: Contacts['select'] = (...args) => instance.select(...args)
  const getProperties: Contacts['getProperties'] = (...args) => instance.getProperties(...args)
  return {
      ['ContactsManager']: cast<Contacts['ContactsManager']>(Manager),
      select,
      getProperties
  } as typeof window.navigator.contacts
}

export const contacts = createContactManager()

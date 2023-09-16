import type { ContactManagerOptions, Contacts, Contact } from '../../types'

const RESOLVE_DELAY = 10

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const allFields = ['address', 'email', 'icon', 'name', 'tel']

const createSelectMock = (users = [] as Contact[]) => {
  const func: Contacts['select'] = async (properties, { multiple } = {}) => {
    await delay(RESOLVE_DELAY)
    if (properties.filter(prop => !allFields.includes(prop)).length > 0) {
      throw new Error('Type error')
    }
    if (multiple) {
      const first = users.pop()
      const second = users.pop()
      return [first, second].filter(Boolean)
    }
    const user = users.pop()
    return [user].filter(Boolean)
  }
  return func
}

const getPropertiesMock: Contacts['getProperties'] = async () => {
  return ['address', 'email', 'icon', 'name', 'tel']
}

class Manager {
  private users: Contact[]

  constructor(_options?: ContactManagerOptions, users = [] as Contact[]) {
    this.users = users.reverse()
  }

  async select(...args: Parameters<Contacts['select']>) {
    const selectMock = createSelectMock(this.users)
    const data = await selectMock(...args)
    return data
  }

  async getProperties(...args: Parameters<typeof getPropertiesMock>) {
    const data = await getPropertiesMock(...args)
    return data
  }
}

const cast = <T>(value: unknown) => value as T

export const createContactManager = (users = [] as Contact[]) => {
  const instance = new Manager({}, users)
  const select: Contacts['select'] = (...args) => instance.select(...args)
  const getProperties: Contacts['getProperties'] = (...args) =>
    instance.getProperties(...args)
  return {
    ['ContactsManager']: cast<Contacts['ContactsManager']>(Manager),
    select,
    getProperties
  } as typeof window.navigator.contacts
}

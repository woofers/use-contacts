import { useCallback, useState } from 'react'
import { beforeEach, afterEach, describe, it, expect } from 'bun:test'
import {
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  screen,
  cleanup
} from '@testing-library/react'
import { useContacts } from '../'
import { createContactManager } from './mocks'
import type { Contact, SelectContact } from 'types'

const contacts = [
  {
    name: ['Jaxson', 'Van Doorn'],
    address: [],
    email: ['hey@jaxs.onl'],
    tel: ['+15555555555'],
    icon: undefined
  },
  {
    name: ['Phil', 'Vellacott'],
    address: {
      addressLine: ['123 Phil St'],
      city: 'Philvile',
      country: 'Philany',
      dependentLocality: '',
      organization: '',
      phone: '+15554255555',
      postalCode: 'M7A 1A1',
      recipient: 'Mr Phil',
      toJSON: () => ''
    },
    email: ['hi@phil.ooo'],
    tel: ['+15554255555'],
    icon: undefined
  },
  {
    name: ['Parker', 'Swinton'],
    address: [],
    email: ['example@example.com'],
    tel: ['+15555555421'],
    icon: undefined
  }
] as Contact[]

beforeEach(() => {
  globalThis.navigator.contacts = createContactManager([...contacts])
})

afterEach(() => {
  delete globalThis.navigator.contacts
  cleanup()
})

type ContactError = {
  message: string
  canceled?: boolean
}

const isError = <T,>(err: ContactError | T): err is ContactError =>
  !!err && err instanceof Error && !!err.message

const isNotCanceled = <T,>(err: ContactError | T): err is ContactError =>
  isError(err) && !err.canceled

const getArray = <T, K extends boolean = false>(
  arr: T[] | [],
  _multiple: K
) => {
  const casted = arr as (K extends false ? [T] : T[]) | []
  if (casted.length <= 0) {
    return false
  }
  return arr as K extends false ? [T] : T[]
}

const Button = <K extends boolean = false>({
  multiple,
  forceButton
}: { multiple?: K; forceButton?: boolean } = {}): JSX.Element => {
  const [fetchedContacts, setFetchedContacts] = useState(false)
  const [error, setError] = useState<ContactError | undefined>()
  const [contacts, setContacts] = useState(
    [] as SelectContact<'address' | 'email' | 'icon' | 'name' | 'tel', K>
  )
  const { isSupported, select } = useContacts()
  const onClick = useCallback(() => {
    const open = async () => {
      try {
        const results = await select(
          ['address', 'email', 'icon', 'name', 'tel'],
          { multiple }
        )
        setContacts(results)
        setFetchedContacts(true)
      } catch (e) {
        if (isNotCanceled(e)) {
          setError(e)
        }
      }
    }
    void open()
  }, [multiple])

  const list = getArray(contacts, multiple)

  return (
    <>
      {isSupported() || forceButton ? (
        <button onClick={onClick}>Open contacts drawer</button>
      ) : (
        <div>Unsupported</div>
      )}
      {!!error && <p>Error - {error.message}</p>}
      {list &&
        list.map(contact => {
          const name = contact.name.join(' ')
          const tel = contact.tel.join('-')
          return <div key={`${name}-${tel}`}>{name}</div>
        })}
      {!list && fetchedContacts && <div>No contacts selected</div>}
    </>
  )
}

describe('useContacts', () => {
  describe('select()', () => {
    it('select() resolves a single contact', async () => {
      render(<Button />)
      const button = screen.getByText('Open contacts drawer')
      expect(button).toBeDefined()
      fireEvent.click(button)
      await waitFor(() =>
        expect(screen.getByText('Jaxson Van Doorn')).toBeDefined()
      )
    })

    it('select() resolves when users cancels with no contacts', async () => {
      globalThis.navigator.contacts = createContactManager([])
      render(<Button />)
      const button = screen.getByText('Open contacts drawer')
      expect(button).toBeDefined()
      fireEvent.click(button)
      await waitFor(() =>
        expect(screen.getByText('No contacts selected')).toBeDefined()
      )
    })

    it('select() resolves multiple contacts and works with 2, 1 and no contacts selected', async () => {
      render(<Button multiple />)
      const button = screen.getByText('Open contacts drawer')
      expect(button).toBeDefined()
      fireEvent.click(button)
      await waitFor(() =>
        expect(screen.getByText('Jaxson Van Doorn')).toBeDefined()
      )
      await waitFor(() =>
        expect(screen.getByText('Phil Vellacott')).toBeDefined()
      )
      fireEvent.click(button)
      await Promise.all([
        waitForElementToBeRemoved(() => screen.queryByText('Phil Vellacott')),
        waitForElementToBeRemoved(() => screen.queryByText('Jaxson Van Doorn'))
      ])
      await waitFor(() =>
        expect(screen.getByText('Parker Swinton')).toBeDefined()
      )
      fireEvent.click(button)
      await waitForElementToBeRemoved(() =>
        screen.queryByText('Parker Swinton')
      )
      await waitFor(() =>
        expect(screen.getByText('No contacts selected')).toBeDefined()
      )
    })

    it('select() throws an error when unsupported', async () => {
      delete globalThis.navigator.contacts
      render(<Button forceButton />)
      const button = screen.getByText('Open contacts drawer')
      fireEvent.click(button)
      await waitFor(() =>
        expect(screen.getByText('Error - Unsupported browser.')).toBeDefined()
      )
    })
  })

  describe('isSupported()', () => {
    it('isSupported() returns true when supported', async () => {
      render(<Button />)
      expect(screen.getByText('Open contacts drawer')).toBeDefined()
    })
    it('isSupported() returns false when unsupported', async () => {
      delete globalThis.navigator.contacts
      render(<Button />)
      expect(screen.getByText('Unsupported')).toBeDefined()
    })
  })
})

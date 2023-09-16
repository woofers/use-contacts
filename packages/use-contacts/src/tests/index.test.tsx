import React, { useCallback, useState } from 'react'
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
import type { Contact, ContactKey, SelectContact } from 'types'

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

const Button = <C extends ContactKey = ContactKey, K extends boolean = false>({
  keys = [],
  multiple,
  forceButton
}: { keys?: C[]; multiple?: K; forceButton?: boolean } = {}): JSX.Element => {
  const [fetchedContacts, setFetchedContacts] = useState(false)
  const [error, setError] = useState<ContactError | undefined>()
  const [contacts, setContacts] = useState([] as SelectContact<ContactKey, K>)
  const { isSupported, select, cancel } = useContacts()
  const onClick = useCallback(() => {
    const open = async () => {
      try {
        const arr = (
          keys.length > 0 ? keys : ['address', 'email', 'icon', 'name', 'tel']
        ) as ContactKey[]
        const results = await select(arr, { multiple })
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
        <>
          <button onClick={onClick}>Open contacts drawer</button>
          <button onClick={cancel}>Cancel</button>
        </>
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
      await Promise.all([
        waitFor(() =>
          expect(screen.getByText('Jaxson Van Doorn')).toBeDefined()
        ),
        waitFor(() => expect(screen.getByText('Phil Vellacott')).toBeDefined())
      ])
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

    it('select() returns no contacts when cancel() is called', async () => {
      render(<Button keys={["name"]} />)
      const button = screen.getByText('Open contacts drawer')
      fireEvent.click(button)
      fireEvent.click(screen.getByText('Cancel'))
      await waitFor(() =>
        expect(screen.getByText('No contacts selected')).toBeDefined()
      )
    })

    it('select() throws type error when a field is unsupported', async () => {
      render(<Button keys={['random'] as unknown as ContactKey[]} />)
      const button = screen.getByText('Open contacts drawer')
      fireEvent.click(button)
      await waitFor(() =>
        expect(screen.getByText('Error - Type error')).toBeDefined()
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

  describe('cancel()', () => {
    it('cancel() does not affect when called before select()', async () => {
      render(<Button multiple />)
      fireEvent.click(screen.getByText('Cancel'))
      const button = screen.getByText('Open contacts drawer')
      fireEvent.click(button)
      await Promise.all([
        waitFor(() =>
          expect(screen.getByText('Jaxson Van Doorn')).toBeDefined()
        ),
        waitFor(() => expect(screen.getByText('Phil Vellacott')).toBeDefined())
      ])
      fireEvent.click(screen.getByText('Cancel'))
      fireEvent.click(button)
      await Promise.all([
        waitForElementToBeRemoved(() => screen.queryByText('Phil Vellacott')),
        waitForElementToBeRemoved(() => screen.queryByText('Jaxson Van Doorn'))
      ])
      await waitFor(() =>
        expect(screen.getByText('Parker Swinton')).toBeDefined()
      )
    })
  })
})

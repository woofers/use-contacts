# useContacts

[![img](https://github.com/woofers/use-contacts/workflows/build/badge.svg)](https://github.com/woofers/use-contacts/actions) [![img](https://badge.fury.io/js/use-contacts.svg)](https://www.npmjs.com/package/use-contacts) [![img](https://img.shields.io/npm/dt/use-contacts.svg)](https://www.npmjs.com/package/use-contacts) [![img](https://badgen.net/bundlephobia/minzip/use-contacts)](https://bundlephobia.com/result?p=use-contacts) [![img](https://img.shields.io/npm/l/use-contacts.svg)](https://github.com/woofers/use-contacts/blob/main/LICENSE)

📇 Typesafe Contact Picker API wrapper for React

Implements the [Contact Picker API](https://developer.mozilla.org/en-US/docs/Web/API/Contact_Picker_API)
into an easy-to-use React hook.  This API is currently only available in Chromium based browsers and enabled on iOS Safari via a feature flag.

## Features

- Supports Server-Side rendering.
- Test coverage with unit and integration tests.
- TypeScript support
- Under 690 bytes GZipped
- Safely detect and fallback on unsupported browsers using `isSupported` method.
- Closes eye dropper when corresponding component is unmounted.
- Provides explicit `close` method to cancel promise (contact picker still remains open).

## Installation

**pnpm**

```pnpm
pnpm add use-contacts
```

**Yarn**

```yarn
yarn add use-contacts
```

**npm**

```npm
npm install use-contacts
```

## Usage

```tsx
import React, { useCallback, useState } from 'react'
import { useContacts, type SelectContact, type ContactKey } from 'use-contacts'

type ContactError = {
  message: string
  canceled?: boolean
}

const isError = <T,>(err: ContactError | T): err is ContactError => !!err && err instanceof Error && !!err.message
const isNotCanceled = <T,>(err: ContactError | T): err is ContactError => isError(err) && !err.canceled
const hasContacts = <T,>(array: readonly T[]): array is [T, ...T[]] => array.length > 0

const properties = ['name', 'email', 'tel', 'icon', 'address'] satisfies ContactKey[]
const options = { multiple: false } as const

const App = () => {
  const { select, getProperties, isSupported, cancel } = useContacts()
  const [contacts, setContacts] = useState<SelectContact<typeof properties, typeof options>>([])
  const [error, setError] = useState<ContactError>()
  const showSupportedProperties = useCallback(() => {
    const alertProperties = async () => {
      try {
        const props = await getProperties()
        alert(`Supported contact fields are ${props.join(', ')}`)
      } catch (e) {
        setError(e)
      }
    }
    void alertProperties()
  }, [getProperties])
  const selectContact = useCallback(() => {
    const updateContacts = async () => {
      try {
        const data = await select(properties, options)
        if (data.length > 0) {
          setContacts(data)
        }
      } catch (e) {
        if (isNotCanceled(e)) setError(e)
      }
    }
    void updateContacts()
  }, [select])
  return (
    <>
      {hasContacts(contacts) && (
        <ul>
          {contacts.map(contact => (
            <li key={contact.name.join(' ')}>
              {contact.name} - {contact.tel}{' '}
              {contact.email && `(${contact.email})`}
            </li>
          ))}
        </ul>
      )}
      {isSupported() ? (
        <button type="button" onClick={selectContact}>
          {isSupported() ? 'Select a contact' : 'Unsupported'}
        </button>
      ) : (
        <div>Contacts API not supported in this browser</div>
      )}
      {isSupported() && (
        <button type="button" onClick={showSupportedProperties}>
          Show supported fields on device
        </button>
      )}
      {!!error && <div>{error.message}</div>}
    </>
  )
}
```


## Methods

- ddd

```
select<T extends "name" | "address" | "email" | "icon" | "tel">(properties: [] | T[], options?: { multiple?: K }) => Promise<Pick<{
  address?: ContactAddress[]
  email?: string[]
  icon?: Blob[]
  name: string[]
  tel?: string[]
}, T>[] | >'
```

```tsx
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
```

  Opens the EyeDropper API in supported browsers and returns a
  promise which will resolve with the selected color.  Alternatively the promise will be rejected if
  the user cancels the operation, for instance by hitting escape.
  Additionally if the browser does not support the API, the
  promise is rejected. While the spec currently indicates that a
  6-digit HEX value is returned, the current Chrome implementation
  returns a `rgba` value.

- `getProperties() => Promise<("name" | "address" | "email" | "icon" | "tel")[]>'`

  This method closes the Contact Picker API selector if it is open and
  resolves the promise from `select` with no results. Otherwise this
  performs a no-op.  **NOTE**: The Contact Picker will still remain open
  as there is no way in any browser to close this programmatically, 
  only the user can dismiss the Contact Picker, however the promise will be resolved and cleaned up.

- `cancel() => void`
  
  a

- `isSupported() => boolean`

  Determines if the Contact Picker API is supported in the current browser.

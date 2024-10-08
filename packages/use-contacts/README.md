# useContacts

[![img](https://github.com/woofers/use-contacts/workflows/build/badge.svg)](https://github.com/woofers/use-contacts/actions) [![img](https://badge.fury.io/js/use-contacts.svg)](https://www.npmjs.com/package/use-contacts) [![img](https://img.shields.io/npm/dt/use-contacts.svg)](https://www.npmjs.com/package/use-contacts) [![img](https://badgen.net/bundlephobia/minzip/use-contacts)](https://bundlephobia.com/result?p=use-contacts) [![img](https://img.shields.io/npm/l/use-contacts.svg)](https://github.com/woofers/use-contacts/blob/main/LICENSE)

📇 Typesafe Contact Picker API wrapper for React

Implements the [Contact Picker API](https://developer.mozilla.org/en-US/docs/Web/API/Contact_Picker_API)
into an easy-to-use React hook.  This API is currently only available in Chromium based browsers and enabled on iOS Safari via a feature flag.


https://github.com/woofers/react-sheet-slide/assets/7284672/9ad2f50d-7c1e-451b-88e4-4f7ccb34ccb0


## Features

- Supports Server-Side rendering.
- Test coverage with unit tests.
- TypeScript support with type inference based on parameters.
- Under 690 bytes GZipped.
- Safely detect and fallback on unsupported browsers using `isSupported` method.
- Cancels `select` when component is unmounted.
- Provides explicit `cancel` method to abort the promise (contact picker still remains open).

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
import { useContacts, hasContacts, isContactError } from 'use-contacts'

const App = () => {
  const { select, getProperties, isSupported, cancel } = useContacts()
  const selectAllContactValues = useCallback(() => {
    return select(['name', 'email', 'tel', 'icon', 'address'], { multiple: false })
  }, [select])
  const [contacts, setContacts] = useState<Awaited<ReturnType<typeof selectAllContactValues>>>([])
  const [error, setError] = useState<{ message: string }>()
  const selectContact = useCallback(() => {
    const updateContacts = async () => {
      try {
        const data = await selectAllContactValues()
        if (hasContacts(data)) {
          setContacts(data)
        }
      } catch (e) {
        if (isContactError(e)) setError(e)
      }
    }
    void updateContacts()
  }, [selectAllContactValues])
  const showSupportedProperties = useCallback(() => {
    const alertProperties = async () => {
      try {
        const props = await getProperties()
        if (typeof window !== 'undefined') {
          alert(`Supported contact fields are ${props.join(', ')}`)
        }
      } catch (e) {
        setError(e)
      }
    }
    void alertProperties()
  }, [getProperties])
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
          Select a contact
        </button>
      ) : (
        <div>Contact Picker API not supported in this browser</div>
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

  ```tsx
  select<T extends "name" | "address" | "email" | "icon" | "tel">(properties: [] | T[], options?: { multiple?: boolean }) =>
    Promise<Pick<{
      address?: ContactAddress[]
      email?: string[]
      icon?: Blob[]
      name: string[]
      tel?: string[]
    }, T>[] | []>'
  ```

  - `select`

    Opens the Contact Picker API in supported browsers and returns a
    promise which will resolve with an array of contacts.

    You can specify a list of properties as string keys using
    with the `properties` arg.  If you pass an unsupported property,
    this will throw a Type error. If you want to auto-detect and use all supported properties
    call this without a `properties` argument or an empty array `[]`.

    The `options` arg can be used to specify if the Contact Picker
    should be a multi-select using `multiple`.

    If you are using TypeScript, the correct array/contact object will be inferred
    from the arguments that you pass.  For instance `select(['name', 'tel'], { multiple: false })`
    will be typed as `[{ name: string[]; tel?: string[] }]`.

- `getProperties() => Promise<("name" | "address" | "email" | "icon" | "tel")[]>'`

  Returns the available properties supported by the current browser and device as an array.

- `cancel() => void`

  Used to cancel the promise returned from `select`, it will resolve with an empty array of contacts.
  Otherwise if the promise is not pending, this performs a no-op.
  **NOTE**: The Contact Picker will still remain open
  as there is no way in any browser to close this programmatically,
  only the user can dismiss the Contact Picker
  however the promise will be resolved and cleaned up.

- `isSupported() => boolean`

  Determines if the Contact Picker API is supported in the current browser.

### Types

You import the following types from `import type { Contact, SelectContact, ContactKey, ContactAddress } from 'use-contacts'`

- `SelectContact<T extends ContactKey[] | ContactKey, K extends { multiple?: boolean }>`

  Can be used to type useState by inferring or specifying the args passed to `select`.

  For instance `SelectContact<'name' | 'tel', { multiple: true }>` maps to `{ name: string[]; tel?: string[] }[]`.

Alternatively you can leverage the full-types as-well:

```tsx
type Contact = {
  address?: ContactAddress[]
  email?: string[]
  icon?: Blob[]
  name: string[]
  tel?: string[]
}

type ContactKey = 'name' | 'address' | 'email' | 'icon' | 'tel'

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

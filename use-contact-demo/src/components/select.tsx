'use client'
import { useEffect, useState, useCallback } from 'react'
import { useContact, type Contact } from './use-contact'
import { Text } from 'components/text'

export const Select: React.FC<{}> = () => {
  const { isSupported, select } = useContact()
  const [v, setV] = useState('')
  const [contacts, setContacts] = useState([] as Contact[])

  useEffect(() => {
    if (typeof window === 'undefined') return
    setV(JSON.stringify(Object.keys(window.navigator.contacts ?? { none: false })) + '-' + typeof window.navigator?.contacts?.ContactsManager)
  }, [])

  const getContact = useCallback(async () => {
      try {
        const data = await (window?.navigator?.contacts as any)?.select?.(['name'])
        setContacts(data)
      } catch (e) {
        alert((e as any)?.message ?? "no error")
      }
  }, [select])
  return (
    <>
      <Text as="button" type="button" onClick={getContact} className="text-left px-3 py-2 bg-slate-200 text-slate-900 !text-base rounded-lg">{isSupported() ? 'Select a contact' : 'Unsupported'}</Text>
        <div>
          {contacts.map(contact => (
            <div key={contact.name.join('-')}>
              <div>{contact.name?.[0] ?? "none"}</div>
              <div>{JSON.stringify(contact)}</div>
            </div>
          ))}
          <div>{v}</div>
        </div>
    </>
  )
}

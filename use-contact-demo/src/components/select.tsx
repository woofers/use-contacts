'use client'
import { useState, useCallback } from 'react'
import { useContact } from './use-contact'
import { Text } from 'components/text'

export const Select: React.FC<{}> = () => {
  const { isSupported, select } = useContact()
  const [contacts, setContacts] = useState([])
  const getContact = useCallback(async () => {
      try {
        const data = await select()
        setContacts([data])
      } catch (e) {
        alert(e.message ?? "no error")
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
        </div>
    </>
  )
}

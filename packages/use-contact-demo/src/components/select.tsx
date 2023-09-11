'use client'
import { useState, useCallback } from 'react'
import { useContacts, type SelectContact, type Contact } from 'use-contacts'
import { Box } from 'components/box'
import { Text } from 'components/text'

const fields = ['name', 'address', 'email', 'icon', 'tel'] as const

type Data = {
  [X in keyof Contact | 'auto' | 'multiple']?: boolean
}

export const Select: React.FC<{}> = () => {
  const { isSupported, select } = useContacts()
  const [contacts, setContacts] = useState([] as Contact[])

  const [data, setData] = useState<Data>({ auto: true })
  const handleChange = useCallback((key: keyof Data) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(data => ({ ...data, [key]: e.target.checked }))
  }, [])
  const getProperties = useCallback(() => {
    const { auto, multiple, ...rest } = data
    if (auto) return []
    return (Object.keys(rest) as (keyof typeof rest)[]).filter(key => rest[key])
  }, [data])

  const multiple = data.multiple
  const getContact = useCallback(async () => {
      try {
          const data = await select(getProperties(), { multiple })
        setContacts(data)
      } catch (e) {
        alert((e as any)?.message ?? "no error")
      }
  }, [select, getProperties, multiple])
  const disabled = !!data.auto
  return (
    <>
      <Box className="flex flex-col gap-y-[2px] max-w-xs rounded-lg overflow-hidden">
        <Text as="button" type="button" onClick={getContact} className="text-left px-3 py-2 bg-slate-200 text-slate-900 !text-base w-full">{isSupported() ? 'Select a contact' : 'Unsupported'}</Text>
        {contacts.map(contact => (
          <Text as="div" key={contact.name.join('-')} className="text-left px-3 py-2 bg-slate-200 text-slate-900 !text-base w-full">
            <span>{contact.name?.[0] ?? "none"}</span> - <span>{JSON.stringify(contact)}</span>
          </Text>
        ))}
      </Box>
      <Box className="max-w-xs flex px-3 pt-4">
        <Text as="label" className="select-none text-left text-slate-900 !text-base w-full" htmlFor="multiple">Multiple?</Text>
        <input id="multiple" name="multiple" type="checkbox" className="accent-lime-400" onChange={handleChange('multiple')} checked={!!data['multiple']} />
      </Box>
      <Box className="max-w-xs flex px-3 py-1">
        <Text as="label" className="select-none text-left text-slate-900 !text-base w-full" htmlFor="auto">Auto detect fields?</Text>
        <input id="auto" name="auto" type="checkbox" className="accent-lime-400" onChange={handleChange('auto')} checked={!!data['auto']} />
      </Box>
      <Box className="flex flex-col gap-y-[2px] max-w-xs rounded-lg overflow-hidden" style={{ opacity: disabled ? 0.65 : 1 }}>
        {fields.map(field => (
          <Text key={`field-${field}`} as="div" className="text-left px-3 py-2 bg-slate-200 text-slate-900 !text-base w-full flex justify-between">
            <label htmlFor={field} className="select-none">{field}</label>
            <input id={field} name={field} type="checkbox" className="accent-lime-400" onChange={handleChange(field)} checked={!!data[field]} disabled={disabled} />
          </Text>)
        )}
      </Box>
    </>
  )
}

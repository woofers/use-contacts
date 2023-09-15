/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import React, { useState } from 'react'
import { renderToString } from 'react-dom/server'
import {
  act,
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  screen
} from '@testing-library/react'
import { contacts } from '../tests/mocks'
import { useContacts } from '../src'
import { expect, describe, it, beforeEach, afterEach } from 'bun:test'




beforeEach(() => {
  window.navigator.contacts = contacts
})

afterEach(() => {
  delete global.window.navigator.contacts
})

const Button: React.FC<{}> = () => {
  const [text, setText] = useState('Button')
  return <button onClick={() => setText('Clicked')}>{text}</button>
}

describe('useContacts', () => {
  describe('open()', () => {
    it('open() resolves color', async () => {
      render(<Button />)
      const button = screen.getByText('Button')
      expect(button).toBeDefined()
      fireEvent.click(button)
      await waitFor(() =>
        expect(screen.getByText('Clicked')).toBeDefined()
      )
    })
  })
})

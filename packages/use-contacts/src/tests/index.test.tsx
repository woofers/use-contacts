import React, { useState } from 'react'
import { beforeEach, afterEach, describe, it, expect } from 'bun:test'
import {
  render,
  fireEvent,
  waitFor,
  screen
} from '@testing-library/react'
// import { useContacts } from '../'
import { contacts } from './mocks'

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

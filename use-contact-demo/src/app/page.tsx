import Image from 'next/image'
import { Text } from 'components/text'

const Home: React.FC<Nothing> = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-3 py-24">
      <div className="w-full flex flex-col gap-y-2">
        <Text className="px-3">useContact</Text>
        <Text as="button" type="button" className="text-left px-3 py-2 bg-slate-200 text-slate-900 !text-base rounded-lg">Select a contact</Text>
      </div>
    </main>
  )
}

export default Home

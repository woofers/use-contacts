import Image from 'next/image'
import { Text } from 'components/text'
import { Select } from 'components/select'

const Home: React.FC<Nothing> = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-3 py-24">
      <div className="w-full flex flex-col gap-y-2">
        <Text className="px-3">useContact</Text>
        <Select />
      </div>
    </main>
  )
}

export default Home

import { api } from '@/lib/api'
import { ArrowLeft } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'

import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import Link from 'next/link'
import { UpdatedMemoryForm } from '@/components/UpdatedMemoryForm'
import { DeleteMemory } from '@/components/DeleteMemory'

dayjs.locale(ptBr)

export default async function Memory({ params }: { params: { id: string } }) {
  const token = cookies().get('token')?.value
  const { id } = params

  const response = await api.get(`/memories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memory = response.data

  console.log(response.data)

  return (
    <div className="flex flex-col gap-10 p-8">
      <div key={memory.id} className="relative space-y-4">
        <DeleteMemory id={memory.id} />
        <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
          {dayjs(memory.createdAt).format('D[ de ]MMMM[ de ]YYYY')}
        </time>

        <Image
          src={memory.coverUrl}
          width={592}
          height={280}
          className="aspect-video w-full rounded-lg object-cover"
          alt=""
        />
        <p className="text-lg leading-relaxed text-gray-50">{memory.excerpt}</p>
        <UpdatedMemoryForm id={memory.id} />

        <Link
          href={`/`}
          className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
        >
          Voltar
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

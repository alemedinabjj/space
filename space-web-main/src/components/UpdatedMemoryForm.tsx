'use client'

import { api } from '@/lib/api'
import { FormEvent, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { MediaPicker } from './MediaPicker'
import { Camera } from 'lucide-react'

interface UpdatedMemoryFormProps {
  id: string
}

export function UpdatedMemoryForm({ id }: UpdatedMemoryFormProps) {
  const router = useRouter()
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  const token = Cookies.get('token')

  async function handleEditMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)

    const fileToUpload = formData.get('coverUrl')

    let coverUrl = ''

    if (fileToUpload) {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)

      const uploadResponse = await api.post('/upload', uploadFormData)

      coverUrl = uploadResponse.data.fileUrl
    }

    await api.put(
      `/memories/${id}`,
      {
        coverUrl,
        content: formData.get('content'),
        isPublic: formData.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    setLoading(false)
    router.push('/')
  }

  return edit ? (
    <form onSubmit={handleEditMemory} className=" flex flex-1 flex-col gap-2 ">
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Anexar mídia
        </label>
        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            value="true"
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
          />
          Tornar memória pública
        </label>
      </div>

      <MediaPicker />

      <textarea
        name="content"
        spellCheck={false}
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Escreva sua memória aqui..."
      />

      <button
        type="submit"
        className=" inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        {!loading ? 'Salvar' : 'Salvando...'}
      </button>
    </form>
  ) : (
    <div className="flex justify-end">
      <button
        onClick={() => setEdit(true)}
        className="inline-block self-end  rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        Editar
      </button>
    </div>
  )
}

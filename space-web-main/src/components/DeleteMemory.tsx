'use client'

import { api } from '@/lib/api'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface MemoryIdProps {
  id: string
}

export function DeleteMemory({ id }: MemoryIdProps) {
  const [loading, setLoading] = useState(false)
  const token = Cookies.get('token')
  const router = useRouter()

  async function deleteMemory() {
    setLoading(true)
    await api.delete(`/memories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setLoading(false)
    router.push('/')
  }

  return !loading ? (
    <button
      onClick={deleteMemory}
      className="absolute right-4 top-4 text-gray-100 hover:text-gray-50"
    >
      Excluir
    </button>
  ) : (
    <div className="absolute right-4 top-4 text-gray-100 hover:text-gray-50">
      Excluindo...
    </div>
  )
}

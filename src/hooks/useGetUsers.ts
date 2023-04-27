import { useEffect, useRef, useState } from 'react'
import { type User } from '../types'

// interface UseDataProps {
//   fetchUrl: string
//   page: number
// }

export default function useGetUsers ({ page = 1 }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const originalUsers = useRef<User[]>([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)

    fetch(`https://randomuser.me/api/?results=30&seed=ricmiber$page=${page}`)
      .then(async res => {
        if (!res.ok) throw new Error('Error fetching random user')
        return await res.json()
      })
      .then((res) => {
        setUsers(prevUsers => {
          const newUsers = prevUsers.concat(res.results)
          originalUsers.current = newUsers
          return newUsers
        })
        setHasMore(res.results.length > 0)
      })

      .catch(err => { setError(err.message) })
      .finally(() => {
        setLoading(false)
      })
    console.log(hasMore)
  }, [page])

  return { users, setUsers, originalUsers, loading, error, hasMore }
}

import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import UsersList from './components/UsersList'
import Spinner from './components/Spinner/Spinner'
import ErrorComponent from './components/ErrorComponent/ErrorComponent'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const originalUsers = useRef<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const toogleColors = () => {
    setShowColors(!showColors)
  }

  const toogleShortByCountry = () => {
    const newSortBy = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortBy)
  }

  const handleDeleted = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
  }

  const handleChangeSorting = (sort: SortBy) => {
    setSorting(sort)
  }
  const handleReset = () => {
    setUsers(originalUsers.current)
    setSorting(SortBy.NONE)
  }

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`https://randomuser.me/api/?results=10&seed=ricmiber$page=${currentPage}`)
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
      })
      .catch(err => { setError(err.message) })
      .finally(() => {
        setLoading(false)
      })
  }, [currentPage])

  const filterUsersByCountry = useMemo(() => {
    return typeof filterCountry === 'string' && filterCountry.length > 0
      ? users.filter((user) => {
        return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
      })
      : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    const sortByCountry = (a: User, b: User) =>
      a.location.country.localeCompare(b.location.country)
    const sortByName = (a: User, b: User) =>
      a.name.first.localeCompare(b.name.first)
    const sortByLastName = (a: User, b: User) =>
      a.name.last.localeCompare(b.name.last)

    let sortedFunction
    if (sorting === SortBy.NAME) {
      sortedFunction = sortByName
    } else if (sorting === SortBy.LAST_NAME) {
      sortedFunction = sortByLastName
    } else {
      sortedFunction = sortByCountry
    }

    return sorting === SortBy.NONE
      ? filterUsersByCountry
      : filterUsersByCountry.toSorted(sortedFunction)
  }, [filterUsersByCountry, sorting])

  return (
    <>
      <h1>Prueba Tecnica</h1>
      <header>
        <div>
          <button onClick={toogleColors}>Colour Rows</button>
          <button onClick={toogleShortByCountry}>Short by Country</button>
          <button onClick={handleReset}>Reset Users</button>
          <input placeholder="Filter by country" onChange={(e) => { setFilterCountry(e.target.value) }} />
        </div>
        <h5>Total users: {users.length}</h5>
      </header>
      <main>
        {loading && <Spinner />}
        {error && <ErrorComponent message={error} />}
        {users.length === 0 ? <p>No users found.</p> : <UsersList handleChangeSorting={handleChangeSorting} handleDeleted={handleDeleted} showColors={showColors} users={sortedUsers} />}
        {!loading && !error && <button onClick={() => { setCurrentPage(currentPage + 1) }}>More users</button>}
      </main>
    </>
  )
}

export default App

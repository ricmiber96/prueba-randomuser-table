import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import UsersList from './components/UsersList'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const originalUsers = useRef<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const [error, setError] = useState(null)

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
    fetch('https://randomuser.me/api/?results=100')
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
        originalUsers.current = res.results
      })
      .catch(err => { setError(err) })
  }, [])

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
        <UsersList handleChangeSorting={handleChangeSorting} handleDeleted={handleDeleted} showColors={showColors} users={sortedUsers}></UsersList>
      </main>
    </>
  )
}

export default App

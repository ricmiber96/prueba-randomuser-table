import { useCallback, useMemo, useRef, useState } from 'react'
import './App.css'
import ErrorComponent from './components/ErrorComponent/ErrorComponent'
import Spinner from './components/Spinner/Spinner'
import UsersList from './components/UsersList'
import useGetUsers from './hooks/useGetUsers'
import { SortBy, type User } from './types.d'

function App () {
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const { users, setUsers, originalUsers, loading, error, hasMore } = useGetUsers(page)

  // INFINITE SCROLL
  const observer = useRef<IntersectionObserver | null>(null)
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (observer.current != null) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1)
        }
      })
      if (node != null) observer.current.observe(node)
      console.log(page)
    },
    [loading, hasMore]
  )

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
        {/* {!loading && !error && <button onClick={() => { setCurrentPage(currentPage + 1) }}>More users</button>} */}
        <div ref={lastElementRef} style={{ width: '100%', height: '20px' }}></div>
      </main>
    </>
  )
}

export default App

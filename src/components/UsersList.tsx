import React from 'react'
import { SortBy, type User } from '../types.d'

interface Props {
  // TODO: Define the component props
  handleChangeSorting: (sort: SortBy) => void
  handleDeleted: (email: string) => void
  showColors: boolean
  users: User[]
}

export const UsersList: React.FC<Props> = ({ handleChangeSorting, handleDeleted, showColors, users }) => {
  console.log(showColors)

  return (
    <>
      <table width={'100%'}>
        <thead>
          <tr>
            <th>Image</th>
            <th className='pointer' onClick={() => { handleChangeSorting(SortBy.NAME) }}>Name</th>
            <th className='pointer' onClick={() => { handleChangeSorting(SortBy.LAST_NAME) }}>Last Name</th>
            <th className='pointer' onClick={() => { handleChangeSorting(SortBy.COUNTRY) }}>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => {
            const backgroundColor = i % 2 === 0 ? '#333' : '#555'
            const colorStyle = showColors ? backgroundColor : 'transparent'
            return (
              <tr key={user.email} style={{ backgroundColor: colorStyle }}>
                <td>
                  <img src={user.picture.thumbnail} />
                </td>
                <td>{user.name.first}</td>
                <td>{user.name.last}</td>
                <td>{user.location.country}</td>
                <td><button onClick={() => { handleDeleted(user.email) }}>Delete</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default UsersList

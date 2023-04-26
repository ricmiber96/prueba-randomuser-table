import React from 'react'

interface Props {
  // TODO: Define the component props
  message: string | boolean
}

export const ErrorComponent: React.FC<Props> = ({ message }) => {
  return (
    <div>
      <h2>Oops, something went wrong</h2>
      <p>{message}</p>
    </div>
  )
}

export default ErrorComponent

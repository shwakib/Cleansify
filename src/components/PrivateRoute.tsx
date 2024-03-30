import React, { PropsWithChildren, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import UserContext from '../state/user/user.context'

type ProtectedRouteProps = PropsWithChildren

const PrivateRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useContext(UserContext)

  console.log(user)

  if (!user) {
    return <Navigate to={'/'} />
  }

  return children
}
export default PrivateRoute

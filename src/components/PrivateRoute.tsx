import React, { PropsWithChildren, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import UserContext from '../state/user/user.context'

type ProtectedRouteProps = PropsWithChildren

const PrivateRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useContext(UserContext)

  if (user) {
    return children
  }

  return <Navigate to={'/'} />
}
export default PrivateRoute

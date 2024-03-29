import { OrgUser, PersonalUser } from '../../models/user.model'
import React, { ReactNode, useState } from 'react'
import UserContext from './user.context'

interface UserProviderProps {
  children: ReactNode
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<OrgUser | PersonalUser | null>(null)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider

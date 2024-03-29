import { Dispatch, SetStateAction, createContext } from 'react'
import { OrgUser, PersonalUser } from '../../models/user.model'

interface UserContextType {
  user: OrgUser | PersonalUser | null
  setUser: Dispatch<SetStateAction<OrgUser | PersonalUser | null>>
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => undefined
})

export default UserContext

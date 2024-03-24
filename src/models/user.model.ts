import { AccountTypes } from 'constants/common'

export interface FamilyMembers {
  fullName: string
  nationalId: string
  dateOfBirth: {
    day: string
    month: string
    year: string
  }
}

export interface PersonalUser {
  accountType: AccountTypes.PERSONAL | AccountTypes.ORGANIZATION
  userId: string
  fullName: string
  dateOfBirth: {
    day: string
    month: string
    year: string
  }
  nationalId: string
  address: {
    fullAddress: string
    state: string
  }
  email: string
  phoneNumber: string
  familyMembers?: FamilyMembers[]
}

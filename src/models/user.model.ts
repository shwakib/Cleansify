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
  accountType: AccountTypes.PERSONAL
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

export interface OrgUser {
  accountType: AccountTypes.ORGANIZATION
  userId: string
  orgName: string
  productType: string
  address: {
    fullAddress: string
    state: string
  }
  email: string
  phoneNumber: string
  file: File
  filePath?: string
}

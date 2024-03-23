import { GenericItem } from '../types/common'

export enum AccountTypes {
  PERSONAL = 'Personal',
  ORGANIZATION = 'Organization'
}

export const accountTypes: GenericItem[] = [
  {
    name: AccountTypes.PERSONAL,
    value: AccountTypes.PERSONAL
  },
  {
    name: AccountTypes.ORGANIZATION,
    value: AccountTypes.ORGANIZATION
  }
]

export const StateNames: GenericItem[] = [
  {
    name: 'City_A',
    value: 'City_A'
  },
  {
    name: 'City_B',
    value: 'City_B'
  },
  {
    name: 'City_C',
    value: 'City_C'
  }
]

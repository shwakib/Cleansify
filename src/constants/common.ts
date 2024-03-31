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
    name: 'Dhaka',
    value: 'Dhaka'
  },
  {
    name: 'Chittagong',
    value: 'Chittagong'
  },
  {
    name: 'Barishal',
    value: 'Barishal'
  },
  {
    name: 'Khulna',
    value: 'Khulna'
  },
  {
    name: 'Sylhet',
    value: 'Sylhet'
  },
  {
    name: 'Mymensingh',
    value: 'Mymensingh'
  },
  {
    name: 'Rangpur',
    value: 'Rangpur'
  },
  {
    name: 'Rajshahi',
    value: 'Rajshahi'
  }
]

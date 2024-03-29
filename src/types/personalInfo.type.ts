export interface PersonalInfoProps {
  name: string
  dateOfBirth?: {
    day: string
    month: string
    year: string
  }
  nationalId?: string
  email: string
  phoneNumber: string
  address: string
}

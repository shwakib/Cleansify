import { DocumentData } from 'firebase/firestore'
import { FormData } from '../components/DataForm'

export interface DataDoc
  extends Omit<
    FormData,
    'electricityBill' | 'gasBill' | 'fuelBill' | 'carBill'
  > {
  userId: string
  accountType: string
  carbonFootPrint: string
  date: string
  city: string
  electricityBillFilePath: string
  gasBillFilePath: string
  fuelBillFilePath: string
  carBillFilePath: string
}

export interface DataTable {
  [year: string]: DocumentData[]
}

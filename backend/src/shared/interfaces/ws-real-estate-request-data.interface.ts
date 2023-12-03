export interface WsRealEstateRequestData {
  districts: string[]
  minPrice?: number
  maxPrice?: number
  minRooms?: number
  maxRooms?: number
  propertyType?: 'rent' | 'sale'
  fromOwner?: boolean
  propertySwapOption?: boolean
}
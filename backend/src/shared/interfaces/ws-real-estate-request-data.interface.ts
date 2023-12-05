export interface WsRealEstateRequestData {
  districts: string[]
  minPrice?: number
  maxPrice?: number
  minRooms?: number
  maxRooms?: number
  propertyType?: 'rent' | 'sale'
  fromOwner?: boolean
  propertySwapOption?: boolean
  /**
   * Kinnisvara24 has a property of objectTypes which represents the type of the property
   * @example
   * "object_types": ["apartment"]
   */
  objectTypes: string[]
  url?: string
}
/**
 * Represents the request data sent by the CLIENT for a real estate search via WebSocket.
 *
 * @interface WsRealEstateRequestData
 */
export interface WsRealEstateRequestData {
  /**
   * An array of district names for filtering real estate search.
   * @example
   * ['Kristiine', 'Vanalinn']
   *
   * @type {string[]}
   */
  districts: string[]
  /**
   * The minimum price filter for real estate search.
   *
   * @type {number}
   */
  minPrice?: number
  /**
   * The maximum price filter for real estate search.
   *
   * @type {number}
   */
  maxPrice?: number
  /**
   * The minimum number of rooms filter for real estate search.
   *
   * @type {number}
   */
  minRooms?: number
  /**
   * The maximum number of rooms filter for real estate search.
   *
   * @memberof WsRealEstateRequestData
   */
  maxRooms?: number
  /**
   * The type of property, either 'rent' or 'sale'.
   *
   * @type {('rent' | 'sale')}
   */
  propertyType?: 'rent' | 'sale'
  /**
   * Indicates whether the property listing is directly from the owner. Usually this means no extra commission.
   *
   * @type {boolean}
   */
  fromOwner?: boolean
  /**
   * Indicates whether the property has a swap option.
   *
   * @type {boolean}
   */
  propertySwapOption?: boolean
  /**
   * Kinnisvara24-specific property representing the type of the property.
   * An array of object types for filtering real estate search.
   *
   * @type {string[]}
   * @example
   * "objectTypes": ["apartment"]
   */
  objectTypes: string[]
  /**
   * The URL for the listing. Can either be permanent or temporary.
   *
   * @type {string}
   */
  url?: string
}
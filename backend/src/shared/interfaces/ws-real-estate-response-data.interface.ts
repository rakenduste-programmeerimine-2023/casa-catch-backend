/**
 * Represents the response data sent to the CLIENT after a real estate search via WebSocket.
 *
 * @interface WsRealEstateResponseData
 */
export interface WsRealEstateResponseData {
  /**
   * The URL of the main image associated with the real estate property.
   *
   * @type {string}
   */
  imageUrl: string;

  /**
   * The display title of the real estate property.
   *
   * @type {string}
   */
  propertyTitle: string;

  /**
   * The price of the real estate property. Can either be monthly rent or buy out price.
   *
   * @type {number}
   */
  price: number;

  /**
   * The area of the real estate property in square meters.
   *
   * @type {number}
   */
  propertyAreaInSquareM: number;

  /**
   * The address of the real estate property.
   *
   * @type {string}
   */
  address: string;

  /**
   * The number of rooms in the real estate property.
   *
   * @type {number}
   */
  rooms: number;

  /**
   * The optional URL for additional information related to the real estate property.
   * Can either be permanent or temporary.
   *
   * @type {string}
   */
  url?: string;
}

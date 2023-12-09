/**
 * Represents an address with dynamic keys.
 * @interface Kinnisvara24Address
 * @Deprecated - API works without proper formatting, hence why deprecated
 */
interface Kinnisvara24Address {
  [key: string]: string
}

/**
 * Represents the parameters for a Kinnisvara24 API search.
 * @interface Kinnisvara24ApiSearchParams
 * @property {null} hash - A null value for the hash.
 * @property {Kinnisvara24Address[]} addresses - An array of addresses with dynamic keys.
 * @property {string} area_min - The minimum area for the search.
 * @property {string} area_max - The maximum area for the search.
 * @property {string[]} deal_types - The types of deals to include in the search.
 * @property {boolean} from_owner - Indicates whether the property is from an owner.
 * @property {string[]} object_types - The types of objects to include in the search.
 * @property {number} price_max - The maximum price for the search.
 * @property {number} price_min - The minimum price for the search.
 * @property {null | number} rooms_max - The maximum number of rooms for the search.
 * @property {null | number} rooms_min - The minimum number of rooms for the search.
 * @property {string} sort_by - The field to sort the results by.
 * @property {string} sort_order - The sort order for the results.
 * @property {number} page - The page number for the search results.
 */
interface Kinnisvara24ApiSearchParams {
  addresses: any
  area_min?: string
  area_max?: string
  deal_types?: string[]
  from_owner?: boolean
  object_types?: string[]
  price_max?: number
  price_min?: number
  rooms_max?: null | number
  rooms_min?: null | number
  sort_by?: string
  sort_order?: string
  page?: number
}

// interface RendinDistricts {
//   districts: ["Põhja-Tallinn", "Haabersti", "Kesklinn", "Kristiine", "Lasnamäe", "Mustamäe", "Nõmme", "Pirita"]
// }

type RendinDistricts = "Põhja-Tallinn" | "Haabersti" | "Kesklinn" | "Kristiine" | "Lasnamäe" | "Mustamäe" | "Nõmme" | "Pirita"
/**
 * Represents the parameters for a Rendin API search.
 * @interface RendinApiSearchParams
 * @property {number} priceMin - The minimum price for the search.
 * @property {number} priceMax - The maximum price for the search.
 * @property {number} roomsMin - The minimum number of rooms for the search.
 * @property {number} roomsMax - The maximum number of rooms for the search.
 * @property {string[]} districts - The districts to include in the search.
 * @property {string} country - The country code (e.g., "EE").
 * @property {string} city - The city name.
 */
interface RendinApiSearchParams {
  data: {
    priceMin?: number
    priceMax?: number
    roomsMin?: number
    roomsMax?: number
    districts: RendinDistricts[]
    country: "EE"
    city: "Tallinn"
  }
}

/**
 * Represents the city codes used in the City24SearchParameters interface for making API calls to City24.
 * @interface City24CityCodes
 * @property {number} 2670 - City code for Nõmme linnaosa.
 * @property {number} 3039 - City code for Pirita linnaosa.
 * @property {number} 540 - City code for Haabersti linnaosa.
 * @property {number} 1240 - City code for Kesklinna linnaosa.
 * @property {number} 1897 - City code for Lasnamäe linnaosa.
 * @property {number} 2413 - City code for Mustamäe linnaosa.
 * @property {number} 3166 - City code for Põhja-Tallinna linnaosa.
 *
 * These city codes are used in the address[city][] parameter when making API calls to City24.
 * They represent different city districts within Tallinn.
 */
interface City24CityCodes {
  2670: "Nõmme linnaosa";
  3039: "Pirita linnaosa";
  540: "Haabersti linnaosa";
  1240: "Kesklinna linnaosa";
  1897: "Lasnamäe linnaosa";
  2413: "Mustamäe linnaosa";
  3166: "Põhja-Tallinna linnaosa";
}


/**
 * Represents the parameters for a City24 API search.
 * @interface City24SearchParameters
 * @property {number} cc - The country code (e.g., 1).
 * @property {City24CityCodes[]} city - The city codes.
 * @property {string} tsType - The type of the search (e.g., "rent").
 * @property {string} unitType - The type of unit (e.g., "Apartment").
 * @property {number} price - The price range.
 * @property {number} roomCount - The number of rooms.
 * @property {number} itemsPerPage - The number of items per page.
 * @property {number} page - The page number.
 */
interface City24SearchParameters {
  address: {
    cc: 1
    city: City24CityCodes[]
  }
  tsType: "rent"
  unitType: "Apartment"
  price?: {
    gte: number
    lte: number
  }
  roomCount?: number
  itemsPerPage?: number
  page?: number
}


/**
 * Represents property title which is used as a display name.
 * @type {string} propertyTitle
 * @example Vabriku tn 47, Kalamaja, Põhja-Tallinn
 */
type propertyTitle = string

/**
 * Represents property area in square meters.
 * @type {string} propertyArea
 * @example 28
 * @example 20.12
 */
type propertyArea = number

/**
 * Represents the response structure from the Kinnisvara24 API search.
 * @interface Kinnisvara24ApiSearchResponse
 *
 * @property {Array} data - An array of property data objects containing details of each property in the search result.
 *   @property {number} hind - The price of the property.
 *   @property {string} permalink - Permanent link for the listing.
 *   @property {Object} address - Address details of the property.
 *     @property {propertyTitle} short_address - A short version of the property address used for display.
 *     @property {string} city_country - Short description of properties' city and country.
 *   @property {Array} images - An array of images for the property, including URLs for medium and small sizes.
 *     @property {string} url_medium - URL for the medium-sized image of the property.
 *     @property {string} url_small - URL for the small-sized image of the property.
 *   @property {string} lisainfo - Additional information about the property.
 *   @property {number} rooms - The number of rooms in the property.
 *   @property {propertyArea} area - The area of the property.
 *
 * @property {Kinnisvara24ApiSearchParams} filters - The search filters used in the API request.
 *
 * @example
 * // Sample response:
 * const sampleResponse: Kinnisvara24ApiSearchResponse = {
 *   data: [
 *     {
 *       hind: 500,
 *       permalink: "https://kinnisvara24.ee/korter-yyr-tallinn/240720692",
 *       address: {
 *         short_address: "Example Street 12, Põhja-Tallinn",
 *         city_country: "Narva linn, Ida-Viru maakond"
 *       },
 *       images: [
 *         {
 *           url_medium: "mediumImage.jpg",
 *           url_small: "smallImage.jpg",
 *         },
 *         // ... additional images
 *       ],
 *       lisainfo: "Additional information about the property.",
 *       rooms: 2,
 *       area: 75.5,
 *     },
 *     // ... additional property data objects
 *   ],
 *   filters: {
 *     // ... Kinnisvara24ApiSearchParams object
 *   },
 * };
 */
interface Kinnisvara24ApiSearchResponse {
  data: {
    hind: number
    permalink: string
    address: {
      short_address: propertyTitle
      city_country: string
    }
    images: {
      url_medium: string
      url_small: string
    }[]
    lisainfo: string
    rooms: number
    area: propertyArea
  }[]
  filters: Kinnisvara24ApiSearchParams
}


/**
 * Represents the response structure from the Rendin API search.
 * @interface RendinApiSearchResponse
 *
 * @property {Object} result - Information about the search result.
 *   @property {number} count - The count of found apartments.
 *   @property {Array} foundApartments - An array of found apartments.
 *     @property {Array} images - List of other property images. The first image {image[0]} is also the main image.
 *     @property {string} image - The main image of the property.
 *     @property {number} price - The price of the property.
 *     @property {propertyArea} objectArea - The area of the property.
 *     @property {string} link - The url for the listing (not permanent)
 *     @property {number} rooms - The number of rooms in the property.
 *     @property {string} city - The city of the property.
 *     @property {string} address - The address of the property.
 *
 * @example
 * const sampleResponse: RendinApiSearchResponse = {
 *   result: {
 *     count: 90,
 *     foundApartments: [
 *       {
 *         images: [
 *           "mainImage.jpg",
 *           "image2.jpg",
 *           // ... additional images
 *         ],
 *         image: "mainImage.jpg",
 *         price: 500,
 *         objectArea: 75.5,
 *         link: "https://rendin.ee/invite/form/2V1W",
 *         rooms: 2,
 *         // [address] + "," + [city] === propertyTitle
 *         city: "Tallinn",
 *         address: "Example Street 12, Põhja-Tallinn",
 *       },
 *       // ... additional found apartments
 *     ],
 *   },
 * };
 */
interface RendinApiSearchResponse {
  result: {
    count: 90
    foundApartments: {
      // List of other property images. The first image {image[0]} is also the main image.
      images: string[]
      // The main image
      image: string
      price: number
      objectArea: propertyArea
      link: string
      rooms: number
      // [address] + "," + [city] === propertyTitle
      city: string
      // [address] + "," + [city] === propertyTitle
      address: string
    }[]
  }
}


/**
 * Represents the response structure from the City24 API search.
 * @interface City24ApiSearchResponse
 *
 * @property {Object} main_image - Information about the main image of the property.
 *   @property {string} url - The URL of the main image.
 *
 * @property {number} price - The price of the property.
 * @property {number} room_count - The number of rooms in the property.
 * @property {propertyArea} property_size - The size of the property.
 *
 * @property {Object} address - Information about the address of the property.
 *   @property {string} house_number - The house number of the property.
 *   @property {Object} street - Information about the street of the property.
 *     @property {string} name - The name of the street.
 *
 * @example
 * const sampleResponse: City24ApiSearchResponse = {
 *   main_image: {
 *     url: "mainImage.jpg",
 *   },
 *   price: 500,
 *   room_count: 2,
 *   property_size: 75.5,
 *   address: {
 *     // [name] + " " + [house_number] === propertyTitle
 *     house_number: "12",
 *     street: {
 *       name: "Example Street",
 *     },
 *   },
 * };
 */
interface City24ApiSearchResponse {
  main_image: {
    url: string
  }
  price: number
  room_count: number
  property_size: propertyArea
  address: {
    // [name] + " " + [house_number] === propertyTitle
    house_number: string
    street: {
      // [name] + " " + [house_number] === propertyTitle
      name: string
    }
  }
}
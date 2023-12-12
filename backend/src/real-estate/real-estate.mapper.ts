import {WsRealEstateRequestData} from "../shared/interfaces/ws-real-estate-request-data.interface";
import {Injectable, Logger} from "@nestjs/common";

// TODO create a project based logger
const customLogger = (info: any) => {
  return `${info.timestamp} [${info.context}] ${info.level} [${info.line}] ${info.message}`
}

/**
 * Mapper service for transforming CLIENT's request data to API's request data.
 *
 * @class RealEstateMapper
 */
@Injectable()
export class RealEstateMapper {
  private readonly logger: Logger = new Logger(RealEstateMapper.name)

  /**
   * Maps the CLIENT's request data to the Kinnisvara24 APIs request data.
   *
   * @param {WsRealEstateRequestData} requestData - The CLIENT's request data.
   * @returns {Kinnisvara24ApiSearchParams} - The Kinnisvara24 APIs request data object.
   * @memberof RealEstateMapper
   */
  public kinnisvara24Mapper(requestData: WsRealEstateRequestData): Kinnisvara24ApiSearchParams {
    const districtsWithTallinn: string[] = ['Tallinn', 'Harju maakond', ...requestData.districts]

    return {
      // addresses: [this.mapToKinnisvara24Addresses(requestData.districts)],
      addresses: districtsWithTallinn,
      deal_types: this.mapToDealTypes(requestData.propertyType),
      from_owner: requestData.fromOwner || false,
      object_types: ["apartment"],
      price_max: requestData.maxPrice,
      price_min: requestData.minPrice,
      rooms_max: requestData.maxRooms,
      rooms_min: requestData.minRooms,
      sort_by: 'relevance',
      sort_order: 'desc',
    }
  }

  /**
   * Maps the CLIENT's request data to the Rendin APIs request data.
   *
   * @param {WsRealEstateRequestData} requestData - The CLIENT's request data.
   * @returns {RendinApiSearchParams} - The Rendin APIs request data object.
   * @memberof RealEstateMapper
   */
  public rendinMapper(requestData: WsRealEstateRequestData): RendinApiSearchParams {
    return {
      data: {
        city: "Tallinn",
        country: "EE",
        districts: this.mapToRendinDistricts(requestData.districts),
        priceMax: requestData.maxPrice,
        priceMin: requestData.minPrice,
        roomsMax: requestData.maxRooms,
        roomsMin: requestData.minRooms
      }
    }
  }

  /**
   * Maps the CLIENT's request data to the City24 APIs request URL. Creates `searchParameters` from user provided
   * parameters. Calls `this.buildCity24QueryString` to create the necessary URL and encodes it.
   *
   * @param {WsRealEstateRequestData} requestData - The CLIENT's request data.
   * @returns {string} - The City24 APIs request URL.
   * @memberof RealEstateMapper
   */
  public city24Mapper(requestData: WsRealEstateRequestData): string {
    const cityCodesArray: City24CityCodes[] = this.mapToCity24Districts(requestData.districts);

    const searchParameters: City24SearchParameters = {
      address: {
        cc: 1,
        city: cityCodesArray as unknown as number[],
      },
      tsType: "rent",
      unitType: "Apartment",
      price: {
        gte: requestData.minPrice || undefined,
        lte: requestData.maxPrice || undefined,
      },
      roomCount: requestData.minRooms && requestData.maxRooms
        ? Array.from({ length: requestData.maxRooms - requestData.minRooms + 1 }, (_, i: number) => requestData.minRooms + i).join(',')
        : undefined,
      // Increase the limit if necessary, but since the clientside doesn't support paging it wouldn't be wise to go very high
      itemsPerPage: 100,
      page: 1,
    };

    const queryString: string = this.buildCity24QueryString(searchParameters);

    return encodeURI(`https://api.city24.ee/et_EE/search/realties?${queryString}`);
  }

  /**
   * Transforms the CLIENT's request data into a City24 APIs request URL.
   * The URL includes information such as city codes, price range, room count, etc.
   * @param {City24SearchParameters} params - The CLIENT's request data in City24SearchParameters format.
   * @returns {string} - The formatted City24 APIs request URL.
   */
  private buildCity24QueryString(params: City24SearchParameters): string {
    const addressQuery: string = `address[cc]=${params.address.cc}&address[city][]=${params.address.city.join("&address[city][]=")}`;

    // const priceQuery: string | undefined = params.price
    //   ? `price[gte]=${params.price.gte}&price[lte]=${params.price.lte}`
    //   : undefined;

    const minPriceQuery: string | undefined = params.price.lte
      ? `price[lte]=${params.price.lte}`
      : undefined

    const maxPriceQuery: string | undefined = params.price.gte
      ? `price[gte]=${params.price.gte}`
      : undefined

    const otherParams: string[] = Object.entries(params)
      .filter(([key, value]) => key !== "address" && key !== "price" && value !== undefined)
      .map(([key, value]): string => `${key}=${value}`);

    return [addressQuery, minPriceQuery, maxPriceQuery, ...otherParams].filter(Boolean).join("&");
  }

  /**
   * Maps CLIENT's district names to corresponding City24 city codes.
   * @param {string[]} clientDistricts - An array of CLIENT's district names.
   * @returns {City24CityCodes[]} - An array of City24 city codes.
   */
  private mapToCity24Districts(clientDistricts: string[]): City24CityCodes[] {
    const districtMapping: Record<string, number> = {
      "Haabersti": 540,
      "Kadriorg": 64717,
      "Kesklinn": 1240,
      "Kristiine": 1535,
      "Lasnamäe": 1897,
      "Mustamäe": 2413,
      "Nõmme": 2670,
      "Pirita": 3039,
      "Põhja-Tallinn": 3166,
      "Vanalinn": 64718,
    }

    return clientDistricts.map((district: string) => districtMapping[district] as unknown as City24CityCodes)
  }


  /**
   * @Deprecated Turns out their API is a big pile of shit, and you don't even need this...
   * @param {string[]} districts - An array of districts (string) provided by the client
   * @private
   */
  private mapToKinnisvara24Addresses(districts: string[]): Kinnisvara24Address {
    this.logger.debug(districts)
    const addressKeys: string[] = this.generateAddressKeys(districts.length)

    const addressObjects = districts.map((district: string, index: number) => ({
      [addressKeys[index]]: district,
    }));

    return Object.assign({}, ...addressObjects)
  }

  /**
   * Generates address keys for mapping CLIENT's districts to Kinnisvara24 addresses.
   * @deprecated no actual need for this helper method at the moment.
   *
   * @example
   * Sample response:
   * "A1",
   * "A2",
   * "A3",
   * "A4",
   *
   * @param {number} count - The number of address keys to generate.
   * @returns {string[]} - An array of generated address keys.
   * @memberof RealEstateMapper
   * @private
   */
  private generateAddressKeys(count: number): string[] {
    const letters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const addressKeys: string[] = []

    for (let i: number = 0; i < count; i++) {
      const letterIndex: number = Math.floor(i / 10)
      const number: number = i % 10 + 1

      const letter: string = letters.charAt(letterIndex)
      const addressKey: string = `${letter}${number}`

      addressKeys.push(addressKey)
    }

    return addressKeys
  }

  /**
   * Maps CLIENT's districts to Rendin districts using a predefined mapping.
   *
   * @param {string[]} clientDistricts - An array of CLIENT's districts.
   * @returns {RendinDistricts[]} - An array of Rendin districts.
   * @example
   * // maps "Kalamaja" to "Põhja-Tallinn", because of Rendin APIs accepted districts
   * @memberof RealEstateMapper
   * @private
   */
  private mapToRendinDistricts(clientDistricts: string[]): RendinDistricts[] {
    const districtMapping: Record<string, RendinDistricts> = {
      "Kalamaja": "Põhja-Tallinn",
      "Vanalinn": "Kesklinn",
      "Kadriorg": "Põhja-Tallinn",
    };

    return clientDistricts.map((district: string) => districtMapping[district] || district as RendinDistricts);
  }


  /**
   * Maps CLIENT's property type to Kinnisvara24 deal types.
   *
   * @param {'rent' | 'sale' | undefined} propertyType - The CLIENT's property type.
   * @returns {string[]} - An array of Kinnisvara24 deal types.
   * @example
   * // returns a list, i.e. ['rent']; ['rent', 'sale']
   * @memberof RealEstateMapper
   * @private
   */
  private mapToDealTypes(propertyType: 'rent' | 'sale' | undefined): string[] {
    if (propertyType === 'rent') {
      return ['rent'];
    } else if (propertyType === 'sale') {
      return ['sale'];
    } else {
      return ['rent', 'sale'];
    }
  }

  /**
   * @deprecated Currently not used as only apartment types are allowed.
   *
   * Maps CLIENT's object type to Kinnisvara24 object types.
   *
   * @param {'apartment' | 'house' | undefined} objectType - The CLIENT's object type.
   * @returns {string[]} - An array of Kinnisvara24 object types.
   * @example
   * // returns a list, i.e. ['apartment']; ['apartment', 'house']
   * @memberof RealEstateMapper
   * @private
   */
  private mapToObjectTypes(objectType: 'apartment' | 'house' | undefined): string[] {
    if (objectType === 'apartment') {
      return ['apartment']
    } else if (objectType === 'house') {
      return ['house'];
    } else {
      return ['apartment', 'house'];
    }
  }
}
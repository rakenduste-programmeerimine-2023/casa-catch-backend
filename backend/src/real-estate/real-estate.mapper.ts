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
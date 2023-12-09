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
  public kinnisvara24Mapper(requestData: WsRealEstateRequestData): any {
    const districtsWithTallinn: string[] = ['Tallinn', 'Harju maakond', ...requestData.districts];
    const districtsWithTallinn2: string[] = requestData.districts.map(district => `Tallinn, Harju maakond, ${district}`);

    return {
      hash: null,
      // This needs to be A4 in order to work, no idea why...
      addresses: [
        {
          'A1': 'Harju maakond',
          'A4': 'Kadriorg',
        },
      ],
      area_min: '',
      area_max: '',
      land_area_min: '',
      land_area_max: '',
      around_point: null,
      bounds: [],
      broker_id: '',
      bureau_id: null,
      build_year_min: '',
      build_year_max: '',
      client_day_date_max: '',
      client_day_date_min: '',
      comforts: [],
      commercial_types: [],
      deal_types: ['rent'],
      developments_only: false,
      energy_classes: [],
      exclusives: false,
      uniques: false,
      extras: [],
      floor_min: '',
      floor_max: '',
      from_owner: false,
      with_detail_planning_only: false,
      with_building_permit_only: false,
      with_360_tour_only: false,
      with_video_only: false,
      intended_uses: [],
      keywords: [],
      materials: [],
      object_types: ['apartment'],
      price_max: 600,
      price_min: 200,
      price_per_m2_max: '',
      price_per_m2_min: '',
      land_price_per_m2_max: '',
      land_price_per_m2_min: '',
      water_supplies: [],
      heating_types: [],
      energy_sources: [],
      rooms_max: 3,
      rooms_min: 1,
      sewage_types: [],
      sort_by: 'relevance',
      sort_order: 'desc',
      page: 1,
      utility_join_fees_paid: false,
      has_repairs_canal: false,
      is_development_lot: false,
      is_top_floor: false,
      has_water_border: false,
      pets_allowed: false,
      with_usage_permit: false,
      has_client_day: false,
      free: false,
      amount: '',
      rooms: '',
      period: '',
      has_furniture: '',
      has_washing: false,
      are_pets_allowed: false,
      show_deactivated: false,
      price_without_utilities: false,
      has_kitchen: false,
      has_job_possibility: false,
      additional: [],
      house_part_types: [],
      conditions: [],
      neighbours: [],
      road_conditions: [],
      address: [],
    };
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
  private mapToKinnisvara24Addresses(districts: string[]): Record<string, string> {
    this.logger.debug(districts);
    const addressKeys: string[] = this.generateAddressKeys(districts.length * 2);

    return addressKeys.reduce((acc, key, index) => {
      const cityAndCounty = index % 2 === 0 ? 'Harju maakond' : 'Tallinn';
      const districtIndex = Math.floor(index / 2);
      const district = districts[districtIndex];
      acc[key] = index % 2 === 0 ? cityAndCounty : district;
      return acc;
    }, {});
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
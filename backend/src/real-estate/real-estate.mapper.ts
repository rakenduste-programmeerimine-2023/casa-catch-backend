import {WsRealEstateRequestData} from "../shared/interfaces/ws-real-estate-request-data.interface";
import {Injectable, Logger} from "@nestjs/common";

const customLogger = (info: any) => {
  return `${info.timestamp} [${info.context}] ${info.level} [${info.line}] ${info.message}`
}

@Injectable()
export class RealEstateMapper {
  private readonly logger: Logger = new Logger(RealEstateMapper.name)

  public kinnisvara24Mapper(requestData: WsRealEstateRequestData): Kinnisvara24ApiSearchParams {
    return {
      // addresses: [this.mapToKinnisvara24Addresses(requestData.districts)],
      addresses: requestData.districts,
      // area_max: requestData...toString(),
      // area_min: requestData...toString(),
      deal_types: this.mapToDealTypes(requestData.propertyType),
      from_owner: requestData.fromOwner || false,
      // object_types: this.mapToObjectTypes(requestData.propertyType),
      // page: 1,
      price_max: requestData.maxPrice,
      price_min: requestData.minPrice,
      rooms_max: requestData.maxRooms,
      rooms_min: requestData.minRooms,
      sort_by: 'price',
      sort_order: 'asc',
    }
  }

  public rendinMapper(requestData: WsRealEstateRequestData): RendinApiSearchParams {
    return {
      city: "Tallinn",
      country: "EE",
      districts: this.mapToRendinDistricts(requestData.districts),
      priceMax: requestData.maxPrice,
      priceMin: requestData.minPrice,
      roomsMax: requestData.maxRooms,
      roomsMin: requestData.minRooms
    }
  }

  // TODO docuemntation
  // Turns out their APIs are a big pile of shit and you don't even need this...
  private mapToKinnisvara24Addresses(districts: string[]): Kinnisvara24Address {
    this.logger.debug(districts)
    const addressKeys: string[] = this.generateAddressKeys(districts.length)

    const addressObjects = districts.map((district: string, index: number) => ({
      [addressKeys[index]]: district,
    }));

    return Object.assign({}, ...addressObjects)
  }

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

  private mapToRendinDistricts(clientDistricts: string[]): RendinDistricts[] {
    const districtMapping: Record<string, RendinDistricts> = {
      "Kalamaja": "Põhja-Tallinn",
      "Vanalinn": "Kesklinn",
      "Kadriorg": "Põhja-Tallinn",
    };

    return clientDistricts.map((district: string) => districtMapping[district] || district as RendinDistricts);
  }


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
   * @Deprecated No {objectType} is allowed to be provided atm
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
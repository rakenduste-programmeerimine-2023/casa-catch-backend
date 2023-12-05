import {Injectable, Logger} from '@nestjs/common';
import {WsRealEstateRequestData} from "../shared/interfaces/ws-real-estate-request-data.interface";
import {RealEstateMapper} from "./real-estate.mapper";
import {WsRealEstateResponseData} from "../shared/interfaces/ws-real-estate-response-data.interface";
import {Socket} from "socket.io";

type apiRequestOptions = Kinnisvara24ApiSearchParams | RendinApiSearchParams | City24SearchParameters

@Injectable()
export class RealEstateService {
  private readonly logger: Logger = new Logger(RealEstateService.name)

  constructor(private readonly realEstateMapper: RealEstateMapper) {}

  public async getDataFromKinnisvara24(apiRequest: WsRealEstateRequestData, client: Socket): Promise<WsRealEstateResponseData | string> {
    const URL: string = 'https://kinnisvara24.ee/search'
    const requestBody: Kinnisvara24ApiSearchParams = this.createApiRequest('Kinnisvara24', apiRequest)
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    }

    const fetchRes: Response = await this.fetchDataFromAPI(URL, options)
    if (!fetchRes.ok) {
      const errorMessage: string = await fetchRes.text()
      return errorMessage
    }

    let responseBody: Kinnisvara24ApiSearchResponse | null = null;
    try {
      responseBody = await fetchRes.json()
    } catch (error) {
      return `An error occurred when parsing the response: {Kinnisvara24ApiSearchResponse} body, error: ${error}`
    }

    // irl it would need a data pipeline to filter through duplicate data but as of now this should do the job
    // TODO add the url property as well
    responseBody.data.forEach((property) => {
      const dataBackTOClient: WsRealEstateResponseData = {
        address: JSON.stringify(property.address.city_country),
        imageUrl: JSON.stringify(property.images[0].url_small),
        price: property.hind,
        propertyAreaInSquareM: property.area,
        propertyTitle: JSON.stringify(property.address.short_address),
        rooms: property.rooms,
        url: property.permalink
      }
      client.emit('real-estate-json-data-response', dataBackTOClient)
    })
  }

  private async fetchDataFromAPI(url: string, options: {}): Promise<Response> {
    try {
      return await fetch(url, options)
    } catch (error) {
      this.logger.error(`There was an error fetching the resource: ${error}`)
    }
  }

  // Overloading the `createApiRequest` method, SO link: https://stackoverflow.com/a/43959949
  private createApiRequest(apiType: "Kinnisvara24", requestData: WsRealEstateRequestData): Kinnisvara24ApiSearchParams
  private createApiRequest(apiType: "Rendin", requestData: WsRealEstateRequestData): RendinApiSearchParams
  // private createApiRequest(apiType: "City24", requestData: WsRealEstateRequestData): City24SearchParameters
  private createApiRequest(apiType: string, requestData: WsRealEstateRequestData): apiRequestOptions {
    switch (apiType) {
      case 'Kinnisvara24':
        return this.realEstateMapper.kinnisvara24Mapper(requestData) as Kinnisvara24ApiSearchParams;
      case 'Rendin':
        return this.realEstateMapper.rendinMapper(requestData) as RendinApiSearchParams;
      // case 'City24':
      //   return new City24ApiRequest(requestData);
      default:
        throw new Error(`Unsupported API type: ${apiType}`);
    }
  }

}

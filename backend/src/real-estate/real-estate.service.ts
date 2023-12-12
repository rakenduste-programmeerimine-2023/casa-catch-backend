import {Injectable, Logger} from '@nestjs/common';
import {WsRealEstateRequestData} from "../shared/interfaces/ws-real-estate-request-data.interface";
import {RealEstateMapper} from "./real-estate.mapper";
import {WsRealEstateResponseData} from "../shared/interfaces/ws-real-estate-response-data.interface";
import {Socket} from "socket.io";

type apiRequestOptions = Kinnisvara24ApiSearchParams | RendinApiSearchParams | City24SearchParameters | string

/**
 * Service for handling real estate-related operations: API calls, data manipulation and sending the data
 * back to the client via websocket.
 *
 * @class RealEstateService
 */
@Injectable()
export class RealEstateService {
  private readonly logger: Logger = new Logger(RealEstateService.name)

  constructor(private readonly realEstateMapper: RealEstateMapper) {}

  /**
   * Retrieves real estate data from the Kinnisvara24 API.
   *
   * @param {WsRealEstateRequestData} apiRequest - Request data for the real estate API (sent by the client).
   * @param {Socket} client - The WebSocket client instance.
   * @returns {Promise<WsRealEstateResponseData | string>} - A promise that resolves to real estate data or an error message.
   * @memberof RealEstateService
   */
  public async getDataFromKinnisvara24(apiRequest: WsRealEstateRequestData, client: Socket): Promise<WsRealEstateResponseData | string> {
    const URL: string = 'https://kinnisvara24.ee/search'
    const requestBody: Kinnisvara24ApiSearchParams = this.createApiRequest('Kinnisvara24', apiRequest)
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    }

    // const startTime = Date.now()
    const fetchRes: Response = await this.fetchDataFromAPI(URL, options)
    // await new Promise(resolve => setTimeout(resolve, 2000))
    // const endTime = Date.now()
    // this.logger.debug(`Kinnisvara24 request took ${endTime - startTime} milliseconds`);
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
    responseBody.data.forEach((property) => {
      const dataBackToClient: WsRealEstateResponseData = {
        address: JSON.stringify(property.address.city_country),
        imageUrl: JSON.stringify(property.images[0].url_small),
        price: property.hind,
        propertyAreaInSquareM: property.area,
        propertyTitle: JSON.stringify(property.address.short_address),
        rooms: property.rooms,
        url: property.permalink
      }
      client.emit('real-estate-json-data-response', dataBackToClient)
    })
  }

  /**
   * Retrieves real estate data from the Rendin API.
   *
   * @param {WsRealEstateRequestData} apiRequest - Request data for the real estate API (sent by the client).
   * @param {Socket} client - The WebSocket client instance.
   * @returns {Promise<WsRealEstateResponseData | string>} - A promise that resolves to real estate data or an error message.
   * @memberof RealEstateService
   */
  public async getDataFromRendin(apiRequest: WsRealEstateRequestData, client: Socket): Promise<WsRealEstateResponseData | string> {
    const URL: string = 'https://europe-west1-rendin-production.cloudfunctions.net/getSearchApartments'
    const requestBody: RendinApiSearchParams = this.createApiRequest('Rendin', apiRequest)
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    }

    // const startTime = Date.now()
    const fetchRes: Response = await this.fetchDataFromAPI(URL, options)
    // const endTime = Date.now()
    // this.logger.debug(`Rendin request took ${endTime - startTime} milliseconds`);
    if (!fetchRes.ok) {
      const errorMessage: string = await fetchRes.text()
      return errorMessage
    }

    let responseBody: RendinApiSearchResponse | null = null
    try {
      responseBody = await fetchRes.json()
    } catch (error) {
      return `An error occurred when parsing the response: {RendinApiSearchResponse} body, error: ${error}`
    }

    responseBody.result.foundApartments.forEach((apartment) => {
      const dataBackToClient: WsRealEstateResponseData = {
        address: apartment.city,
        imageUrl: apartment.image,
        price: apartment.price,
        propertyAreaInSquareM: apartment.objectArea,
        propertyTitle: JSON.stringify(`${apartment.address},${apartment.city}`),
        rooms: apartment.rooms,
        url: apartment.link
      }
      client.emit('real-estate-json-data-response', dataBackToClient)
    })
  }

  /**
   * Retrieves real estate data from the City24 API.
   *
   * @param {WsRealEstateRequestData} apiRequest - Request data for the real estate API (sent by the client).
   * @param {Socket} client - The WebSocket client instance.
   * @returns {Promise<WsRealEstateResponseData | string>} - A promise that resolves to real estate data or an error message.
   * @memberof RealEstateService
   */
  public async getDataFromCity24(apiRequest: WsRealEstateRequestData, client: Socket): Promise<WsRealEstateResponseData | string> {
    const urlRequestParams: string = this.createApiRequest("City24", apiRequest)
    // const urlRequestParams: string = 'https://api.city24.ee/et_EE/search/realties?address[cc]=1&address[city][]=1240&address[city][]=2413&price[gte]=100&price[lte]=300&tsType=rent&unitType=Apartment&roomCount=1,3&itemsPerPage=50&page=1'
    // this.logger.debug(urlRequestParams)
    const options: RequestInit = {
      method: 'GET',
    }

    const fetchRes: Response = await this.fetchDataFromAPI(urlRequestParams, options)
    if (!fetchRes.ok) {
      const errorMessage: string = await fetchRes.text()
      return errorMessage
    }

    let responseBody: City24ApiSearchResponseArray | null = null
    try {
      responseBody = await fetchRes.json()
    } catch (error) {
      return `An error occurred when parsing the response: {City24ApiSearchResponse} body, error: ${error}`
    }

    responseBody.forEach((apartment: City24ApiSearchResponse): void => {
      const dataBackToClient: WsRealEstateResponseData = {
        address: JSON.stringify(`${apartment.address.city_name} ${apartment.address.street_name} ${apartment.address.house_number}`),
        imageUrl: apartment.main_image.url,
        price: parseInt(apartment.price),
        propertyAreaInSquareM: apartment.property_size,
        propertyTitle: JSON.stringify(`${apartment.address.street_name} ${apartment.address.house_number}`),
        rooms: apartment.room_count,
        url: apartment.main_image.url
      }
      // console.log(dataBackToClient)
      client.emit('real-estate-json-data-response', dataBackToClient)
    })
  }

  /**
   * Fetches data from a given API using the provided URL and request options.
   *
   * @private
   * @param {string} url - The URL of the API.
   * @param {RequestInit} options - The request options.
   * @returns {Promise<Response>} - A promise that resolves to the API response.
   * @memberof RealEstateService
   */
  private async fetchDataFromAPI(url: string, options: RequestInit): Promise<Response> {
    try {
      return await fetch(url, options)
    } catch (error) {
      // TODO Throw HttpException
      this.logger.error(`There was an error fetching the resource: ${error}`)
    }
  }

  /**
   * Creates an API request object based on the specified API type and request data. Method is overridden
   * multiple times in order to respond to different API types
   *
   * @private
   * @param {"Kinnisvara24" | "Rendin" | "City24"} apiType - The type of the real estate API.
   * @param {WsRealEstateRequestData} requestData - Request data for the real estate API.
   * @returns {Kinnisvara24ApiSearchParams | RendinApiSearchParams | string} - The API request parameters.
   * @throws {Error} - Throws an error if the API type is not supported.
   * @memberof RealEstateService
   * @link https://stackoverflow.com/a/43959949
   */
  private createApiRequest(apiType: "Kinnisvara24", requestData: WsRealEstateRequestData): Kinnisvara24ApiSearchParams
  private createApiRequest(apiType: "Rendin", requestData: WsRealEstateRequestData): RendinApiSearchParams
  private createApiRequest(apiType: "City24", requestData: WsRealEstateRequestData): string
  private createApiRequest(apiType: string, requestData: WsRealEstateRequestData): apiRequestOptions {
    switch (apiType) {
      case 'Kinnisvara24':
        return this.realEstateMapper.kinnisvara24Mapper(requestData)
      case 'Rendin':
        return this.realEstateMapper.rendinMapper(requestData)
      case 'City24':
        return this.realEstateMapper.city24Mapper(requestData)
      default:
        // TODO Throw custom exception
        throw new Error(`Unsupported API type: ${apiType}`)
    }
  }
}

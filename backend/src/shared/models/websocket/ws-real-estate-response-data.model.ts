import {WsRealEstateResponseData} from "../../interfaces/ws-real-estate-response-data.interface";

export class WsRealEstateResponseDataModel implements WsRealEstateResponseData {
  private _address: string;
  private _imageUrl: string;
  private _price: number;
  private _propertyAreaInSquareM: number;
  private _propertyTitle: string;
  private _rooms: number;


  constructor(address: string, imageUrl: string, price: number, propertyAreaInSquareM: number, propertyTitle: string, rooms: number) {
    this._address = address;
    this._imageUrl = imageUrl;
    this._price = price;
    this._propertyAreaInSquareM = propertyAreaInSquareM;
    this._propertyTitle = propertyTitle;
    this._rooms = rooms;
  }


  get address(): string {
    return this._address;
  }

  set address(value: string) {
    this._address = value;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  set imageUrl(value: string) {
    this._imageUrl = value;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
  }

  get propertyAreaInSquareM(): number {
    return this._propertyAreaInSquareM;
  }

  set propertyAreaInSquareM(value: number) {
    this._propertyAreaInSquareM = value;
  }

  get propertyTitle(): string {
    return this._propertyTitle;
  }

  set propertyTitle(value: string) {
    this._propertyTitle = value;
  }

  get rooms(): number {
    return this._rooms;
  }

  set rooms(value: number) {
    this._rooms = value;
  }
}
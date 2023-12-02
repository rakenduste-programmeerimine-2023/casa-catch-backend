import {WsRealEstateRequestData} from "../../interfaces/ws-real-estate-request-data.interface";

export class WsRealEstateRequestDataModel implements WsRealEstateRequestData {
  private _districts: string[];
  private _fromOwner: boolean;
  private _maxPrice: number;
  private _maxRooms: number;
  private _minPrice: number;
  private _minRooms: number;
  private _propertySwapOption: boolean;
  private _propertyType: "rent" | "sale";


  constructor(districts: string[], fromOwner: boolean, maxPrice: number, maxRooms: number, minPrice: number, minRooms: number, propertySwapOption: boolean, propertyType: "rent" | "sale") {
    this._districts = districts;
    this._fromOwner = fromOwner;
    this._maxPrice = maxPrice;
    this._maxRooms = maxRooms;
    this._minPrice = minPrice;
    this._minRooms = minRooms;
    this._propertySwapOption = propertySwapOption;
    this._propertyType = propertyType;
  }


  get districts(): string[] {
    return this._districts;
  }

  set districts(value: string[]) {
    this._districts = value;
  }

  get fromOwner(): boolean {
    return this._fromOwner;
  }

  set fromOwner(value: boolean) {
    this._fromOwner = value;
  }

  get maxPrice(): number {
    return this._maxPrice;
  }

  set maxPrice(value: number) {
    this._maxPrice = value;
  }

  get maxRooms(): number {
    return this._maxRooms;
  }

  set maxRooms(value: number) {
    this._maxRooms = value;
  }

  get minPrice(): number {
    return this._minPrice;
  }

  set minPrice(value: number) {
    this._minPrice = value;
  }

  get minRooms(): number {
    return this._minRooms;
  }

  set minRooms(value: number) {
    this._minRooms = value;
  }

  get propertySwapOption(): boolean {
    return this._propertySwapOption;
  }

  set propertySwapOption(value: boolean) {
    this._propertySwapOption = value;
  }

  get propertyType(): "rent" | "sale" {
    return this._propertyType;
  }

  set propertyType(value: "rent" | "sale") {
    this._propertyType = value;
  }
}
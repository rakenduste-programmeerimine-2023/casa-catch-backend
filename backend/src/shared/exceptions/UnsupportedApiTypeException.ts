export class UnsupportedApiTypeException extends Error {
  constructor(apiType: string) {
    super(`Unsupported Api Type: ${apiType}`)
    this.name = 'UnsupportedApiTypeException'
  }
}
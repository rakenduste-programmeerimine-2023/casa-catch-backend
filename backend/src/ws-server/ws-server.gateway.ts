import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket } from 'socket.io'
import {Logger} from "@nestjs/common";
import {WebsocketConnectionPoolManager} from "./ws-server.socket-manager";
import {WsRealEstateRequestData} from "../shared/interfaces/ws-real-estate-request-data.interface";
import {RealEstateService} from "../real-estate/real-estate.service";


/**
 * WebSocket Gateway for handling websocket connections, mainly real-estate API data
 *
 * @class WsServerGateway
 * @implements {OnGatewayConnection}
 * @implements {OnGatewayDisconnect}
 * @implements {OnGatewayInit}
 */
@WebSocketGateway({ cors: { origin: "*" } })
export class WsServerGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  private readonly logger: Logger = new Logger(WsServerGateway.name)

  // Most of the time only @WebSocketGateway is used, but this comes in handy when there is a need to use ws server
  //outside of the @WebSocketGateway
  // @WebSocketServer()
  // private server: Server

  constructor(
    private readonly connectionPoolManager: WebsocketConnectionPoolManager,
    private readonly realEstateService: RealEstateService
  ) {}

  afterInit(): void {
    this.logger.log(`Websocket server initialized`)
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log(`Socket connected: ${client.id}`)
    this.connectionPoolManager.addConnection(client)
    this.logger.log(`Connected clients: ${this.connectionPoolManager.getConnectionPoolSze()}`)
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`Socket disconnected: ${client.id}`)
    this.connectionPoolManager.removeConnection(client)
  }

  /**
   * Handles a real estate-related WebSocket request. Subscribes to a message "real-estate".
   * As soon as the client creates a connection with a websocket the external calls to the real estate APIs are made
   * concurrently.
   *
   * @param {Socket} client - The WebSocket client.
   * @param {WsRealEstateRequestData} payload - The payload containing real estate request data from client.
   * @returns {void}
   * @memberof WsServerGateway
   */
  @SubscribeMessage('real-estate')
  public async handleRealEstateRequest(client: Socket, payload: WsRealEstateRequestData): Promise<void> {
    // Payload is sent to services
    this.logger.log(`received a request for data: ${JSON.stringify(payload)}, client: ${client.id}`)
    try {
      const [kinnisvara24Data, rendinData, city24Data] = await Promise.all([
        this.realEstateService.getDataFromRendin(payload, client),
        this.realEstateService.getDataFromKinnisvara24(payload, client),
        this.realEstateService.getDataFromCity24(payload, client)
      ])

      // String response indicates an error
      if (typeof kinnisvara24Data === 'string') client.emit('real-estate-json-data-response', kinnisvara24Data)
      if (typeof rendinData === 'string') client.emit('real-estate-json-data-response', rendinData)
      if (typeof city24Data === 'string') client.emit('real-estate-json-data-response', city24Data)
    } catch (error) {
      const errorMessage: string = `There was an error with one of the concurrent api request, e: ${error}`
      client.emit('real-estate-json-data-response', errorMessage)
    }
    client.disconnect(true)
  }

  @SubscribeMessage('test-manager')
  handleManagerMessages(client: Socket): void {
    const wsClient: Socket = this.connectionPoolManager.getClientFromConnectionPool(client)
    wsClient.emit("")
  }
}

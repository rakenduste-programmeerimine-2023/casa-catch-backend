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
import {WsRealEstateResponseDataModel} from "../shared/models/websocket/ws-real-estate-response-data.model";
import {RealEstateService} from "../real-estate/real-estate.service";

@WebSocketGateway()
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
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`Socket disconnected: ${client.id}`)
    this.connectionPoolManager.removeConnection(client)
  }

  @SubscribeMessage('message')
  handleServerHelloMessage(client: Socket): void {
    client.emit("hello", "Server hello")
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    console.log(payload)
    client.emit("hello", "Server hello")
  }

  // TODO definitely write documentation
  @SubscribeMessage('real-estate')
  public handleRealEstateRequest(client: Socket, payload: WsRealEstateRequestData): void {
    // Payload is sent to services
    this.logger.log(`received a request for data: ${payload}`)
    // ... TODO send data for processing ...
    this.realEstateService.getDataFromKinnisvara24(payload, client)
    client.emit("real-estate-json-data-response", WsRealEstateResponseDataModel)
  }

  @SubscribeMessage('test-manager')
  handleManagerMessages(client: Socket): void {
    const wsClient: Socket = this.connectionPoolManager.getClientFromConnectionPool(client)
    wsClient.emit("")
  }
}

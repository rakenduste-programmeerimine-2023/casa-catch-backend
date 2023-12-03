import {Module} from "@nestjs/common";
import {WsServerGateway} from "./ws-server.gateway";
import {WebsocketConnectionPoolManager} from "./ws-server.socket-manager";
import {RealEstateModule} from "../real-estate/real-estate.module";

@Module({
  imports: [RealEstateModule],
  providers: [WsServerGateway, WebsocketConnectionPoolManager],
  exports: [WsServerGateway, WebsocketConnectionPoolManager]
})
export class WsServerModule {}
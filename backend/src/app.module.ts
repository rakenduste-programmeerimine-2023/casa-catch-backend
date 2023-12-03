import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {WsServerModule} from "./ws-server/ws-server.module";
import {RealEstateModule} from "./real-estate/real-estate.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WsServerModule,
    RealEstateModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

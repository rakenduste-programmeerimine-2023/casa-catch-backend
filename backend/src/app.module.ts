import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import { RealEstateModule } from './real-estate/real-estate.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RealEstateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

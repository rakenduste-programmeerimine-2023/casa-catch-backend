import { Module } from '@nestjs/common';
import { RealEstateService } from './real-estate.service';
import {RealEstateMapper} from "./real-estate.mapper";

@Module({
  providers: [RealEstateService, RealEstateMapper],
})
export class RealEstateModule {}

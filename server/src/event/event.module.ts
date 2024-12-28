import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventsService } from './event.service';
import { EventsGateway } from './event.gateway';

@Module({
  controllers: [EventController],
  providers: [EventsService, EventsGateway],
  exports: [EventsGateway]
})
export class EventModule {}

import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventsService } from './event.service';
import EventDetailsDto from './dto/event-details.dto';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private eventsService;
    server: Server;
    constructor(eventsService: EventsService);
    private fileChangedListener;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleEvent(client: Socket, eventDetailsDto: EventDetailsDto): void;
    onModuleDestroy(): Promise<void>;
}

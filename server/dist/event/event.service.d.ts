import { OnModuleDestroy } from '@nestjs/common';
import { EventEmitter } from 'events';
export declare class EventsService extends EventEmitter implements OnModuleDestroy {
    private events;
    private fileWatcher;
    constructor();
    private loadEvents;
    getAllEvents(): any[];
    getEventDetails(eventId: string): any;
    onModuleDestroy(): void;
}

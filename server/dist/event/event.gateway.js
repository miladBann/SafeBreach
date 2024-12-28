"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const event_service_1 = require("./event.service");
const event_details_dto_1 = require("./dto/event-details.dto");
let EventsGateway = class EventsGateway {
    constructor(eventsService) {
        this.eventsService = eventsService;
        this.fileChangedListener = this.fileChangedListener.bind(this);
        this.eventsService.on('file_changed', this.fileChangedListener);
    }
    fileChangedListener(updatedEvents) {
        try {
            this.server.emit('all_events', updatedEvents);
        }
        catch (error) {
            console.error('Error emitting all_events:', error);
        }
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
        try {
            const events = this.eventsService.getAllEvents();
            if (!events || !Array.isArray(events)) {
                console.warn(`No events available for client: ${client.id}`);
                client.emit('event_error', { message: 'No events available at this time.' });
                return;
            }
            client.emit('all_events', events);
            this.server.emit('connection_status', { status: 'connected', clientId: client.id });
        }
        catch (error) {
            console.error(`Error handling client connection (${client.id}):`, error);
            client.emit('event_error', { message: 'Error initializing connection.' });
        }
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        try {
            this.server.emit('connection_status', { status: 'disconnected', clientId: client.id });
        }
        catch (error) {
            console.error(`Error handling client disconnection (${client.id}):`, error);
        }
    }
    handleEvent(client, eventDetailsDto) {
        try {
            if (!eventDetailsDto || typeof eventDetailsDto !== 'object') {
                client.emit('event_error', { message: 'Invalid request format.' });
                return;
            }
            const { eventId } = eventDetailsDto;
            if (!eventId || typeof eventId !== 'string') {
                client.emit('event_error', { message: 'Invalid event ID provided.' });
                return;
            }
            const eventDetails = this.eventsService.getEventDetails(eventId);
            if (eventDetails) {
                client.emit('event_details', eventDetails);
            }
            else {
                client.emit('event_error', { message: 'Event not found.' });
            }
        }
        catch (error) {
            console.error('Error handling get_event:', error);
            client.emit('event_error', { message: 'An error occurred while processing your request.' });
        }
    }
    async onModuleDestroy() {
        try {
            this.eventsService.off('file_changed', this.fileChangedListener);
            console.log('Removed file_changed listener to prevent memory leaks.');
        }
        catch (error) {
            console.error('Error removing event listeners:', error);
        }
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_event'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, event_details_dto_1.default]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleEvent", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:3000',
        },
        transports: ['websocket'],
    }),
    __metadata("design:paramtypes", [event_service_1.EventsService])
], EventsGateway);
//# sourceMappingURL=event.gateway.js.map
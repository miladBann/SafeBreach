import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventsService } from './event.service';
import EventDetailsDto from './dto/event-details.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
  transports: ['websocket'], // Force WebSocket transport
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private eventsService: EventsService) {
    // Bind the listener to a named function to allow cleanup
    this.fileChangedListener = this.fileChangedListener.bind(this);

    // Listen for file changes and broadcast new events to all clients
    this.eventsService.on('file_changed', this.fileChangedListener);
  }

  // Named function for file change events
  private fileChangedListener(updatedEvents: any) {
    try {
      this.server.emit('all_events', updatedEvents);
    } catch (error) {
      console.error('Error emitting all_events:', error);
    }
  }

  // Emit all events when a client connects
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    try {
      // Send the initial set of events to the connected client
      const events = this.eventsService.getAllEvents();

      if (!events || !Array.isArray(events)) {
        console.warn(`No events available for client: ${client.id}`);
        client.emit('event_error', { message: 'No events available at this time.' });
        return;
      }

      client.emit('all_events', events);
      this.server.emit('connection_status', { status: 'connected', clientId: client.id });
    } catch (error) {
      console.error(`Error handling client connection (${client.id}):`, error);
      client.emit('event_error', { message: 'Error initializing connection.' });
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    try {
      this.server.emit('connection_status', { status: 'disconnected', clientId: client.id });
    } catch (error) {
      console.error(`Error handling client disconnection (${client.id}):`, error);
    }
  }

  // Handle requests for specific event details
  @SubscribeMessage('get_event')
  handleEvent(client: Socket, eventDetailsDto: EventDetailsDto) {
    try {
      // Validate input
      if (!eventDetailsDto || typeof eventDetailsDto !== 'object') {
        client.emit('event_error', { message: 'Invalid request format.' });
        return;
      }

      const { eventId } = eventDetailsDto;

      if (!eventId || typeof eventId !== 'string') {
        client.emit('event_error', { message: 'Invalid event ID provided.' });
        return;
      }

      // Retrieve event details
      const eventDetails = this.eventsService.getEventDetails(eventId);
      if (eventDetails) {
        client.emit('event_details', eventDetails);
      } else {
        client.emit('event_error', { message: 'Event not found.' });
      }
    } catch (error) {
      console.error('Error handling get_event:', error);
      client.emit('event_error', { message: 'An error occurred while processing your request.' });
    }
  }

  // Remove the listener when the gateway is destroyed
  async onModuleDestroy() {
    try {
      this.eventsService.off('file_changed', this.fileChangedListener);
      console.log('Removed file_changed listener to prevent memory leaks.');
    } catch (error) {
      console.error('Error removing event listeners:', error);
    }
  }
}

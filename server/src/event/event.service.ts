import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import { debounce } from 'lodash'; // Use lodash for debouncing

@Injectable()
export class EventsService extends EventEmitter implements OnModuleDestroy {
  private events = [];
  private fileWatcher: fs.FSWatcher;

  constructor() {
    super();
    try {
      const isProduction = process.env.NODE_ENV === 'production';
      const filePath = isProduction
        ? path.resolve(__dirname, '..', 'tracking_events.json')
        : path.resolve(__dirname, '..', '..', 'tracking_events.json');

      // Debounced file reload function to avoid redundant loads
      const debouncedLoadEvents = debounce(() => {
        console.log('Debounced file reload triggered');
        this.loadEvents(filePath);
        this.emit('file_changed', this.events); // Notify listeners about the change
      }, 100); // 100ms debounce interval

      // Initial load of events
      this.loadEvents(filePath);

      // Set up file watcher with debounce
      this.fileWatcher = fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
          debouncedLoadEvents();
        }
      });

    } catch (error) {
      console.error('Error in EventsService constructor:', error);
    }
  }

  private loadEvents(filePath: string) {
    try {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileData);

      // Validate the structure of loaded data
      if (Array.isArray(jsonData.events)) {
        this.events = jsonData.events;
      } else {
        console.error('Invalid data format in tracking_events.json');
        this.events = [];
      }
    } catch (error) {
      console.error('Error reading or parsing the file:', error);
      this.events = [];
    }
  }

  getAllEvents() {
    return this.events;
  }

  getEventDetails(eventId: string) {
    return this.events.find((event) => event.id === eventId);
  }

  onModuleDestroy() {
    try {
      if (this.fileWatcher) {
        this.fileWatcher.close();
        console.log('File watcher closed.');
      }
    } catch (error) {
      console.error('Error cleaning up file watcher:', error);
    }
  }
}

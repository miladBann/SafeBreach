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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const events_1 = require("events");
const fs = require("fs");
const path = require("path");
const lodash_1 = require("lodash");
let EventsService = class EventsService extends events_1.EventEmitter {
    constructor() {
        super();
        this.events = [];
        try {
            const isProduction = process.env.NODE_ENV === 'production';
            const filePath = isProduction
                ? path.resolve(__dirname, '..', 'tracking_events.json')
                : path.resolve(__dirname, '..', '..', 'tracking_events.json');
            const debouncedLoadEvents = (0, lodash_1.debounce)(() => {
                console.log('Debounced file reload triggered');
                this.loadEvents(filePath);
                this.emit('file_changed', this.events);
            }, 100);
            this.loadEvents(filePath);
            this.fileWatcher = fs.watch(filePath, (eventType) => {
                if (eventType === 'change') {
                    debouncedLoadEvents();
                }
            });
        }
        catch (error) {
            console.error('Error in EventsService constructor:', error);
        }
    }
    loadEvents(filePath) {
        try {
            const fileData = fs.readFileSync(filePath, 'utf-8');
            const jsonData = JSON.parse(fileData);
            if (Array.isArray(jsonData.events)) {
                this.events = jsonData.events;
            }
            else {
                console.error('Invalid data format in tracking_events.json');
                this.events = [];
            }
        }
        catch (error) {
            console.error('Error reading or parsing the file:', error);
            this.events = [];
        }
    }
    getAllEvents() {
        return this.events;
    }
    getEventDetails(eventId) {
        return this.events.find((event) => event.id === eventId);
    }
    onModuleDestroy() {
        try {
            if (this.fileWatcher) {
                this.fileWatcher.close();
                console.log('File watcher closed.');
            }
        }
        catch (error) {
            console.error('Error cleaning up file watcher:', error);
        }
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EventsService);
//# sourceMappingURL=event.service.js.map
declare class LocationDetails {
    address: string;
    area: string;
    building?: string;
}
export declare class TrackingEventDto {
    id: string;
    device_id: string;
    latitude: number;
    longitude: number;
    timestamp: number;
    accuracy: number;
    battery: number;
    location_details: LocationDetails;
    connection_type: 'wifi' | 'cellular' | 'bluetooth';
    signal_strength: number;
    movement_speed: number;
}
export {};

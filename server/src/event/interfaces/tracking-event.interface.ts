export interface TrackingEvent {
    id: string;
    device_id: string;
    latitude: number;
    longitude: number;
    timestamp: number;
    accuracy: number;
    battery: number;
    location_details: {
      address: string;
      area: string;
      building?: string;
    };
    connection_type: 'wifi' | 'cellular' | 'bluetooth';
    signal_strength: number;
    movement_speed: number;
  }
  
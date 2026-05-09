// Telematics device adapters for Geotab, Samsara, Cartrack
export interface TelematicsEvent {
  deviceId: string;
  vehicleId: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  ignition: boolean;
  fuelLevel: number;
  odometer: number;
  engineRpm?: number;
  rawData?: any;
}

export interface TelematicsAlert {
  type: 'HARSH_BRAKING' | 'SPEEDING' | 'IDLING' | 'UNAUTHORIZED_USE' | 'CRASH' | 'LOW_FUEL';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  timestamp: Date;
  location: { lat: number; lng: number };
}

// Base adapter class
export abstract class TelematicsAdapter {
  abstract name: string;
  abstract parseEvent(rawData: any): TelematicsEvent;
  abstract checkAlerts(event: TelematicsEvent): TelematicsAlert[];
  async sendCommand(deviceId: string, command: string): Promise<any> {
    throw new Error('Not implemented');
  }
}

// Geotab adapter
export class GeotabAdapter extends TelematicsAdapter {
  name = 'Geotab';
  
  parseEvent(rawData: any): TelematicsEvent {
    return {
      deviceId: rawData.device?.id || rawData.vehicleId,
      vehicleId: rawData.vehicleId,
      timestamp: new Date(rawData.dateTime),
      latitude: rawData.latitude,
      longitude: rawData.longitude,
      speed: rawData.speed,
      heading: rawData.heading || 0,
      ignition: rawData.ignitionOn,
      fuelLevel: rawData.fuelLevel || 0,
      odometer: rawData.odometer,
      engineRpm: rawData.engineRpm,
      rawData
    };
  }
  
  checkAlerts(event: TelematicsEvent): TelematicsAlert[] {
    const alerts: TelematicsAlert[] = [];
    
    if (event.speed > 80) {
      alerts.push({
        type: 'SPEEDING',
        severity: 'HIGH',
        message: Vehicle speeding at  km/h,
        timestamp: event.timestamp,
        location: { lat: event.latitude, lng: event.longitude }
      });
    }
    
    if (event.fuelLevel < 15) {
      alerts.push({
        type: 'LOW_FUEL',
        severity: 'MEDIUM',
        message: Low fuel level: %,
        timestamp: event.timestamp,
        location: { lat: event.latitude, lng: event.longitude }
      });
    }
    
    return alerts;
  }
}

// Samsara adapter
export class SamsaraAdapter extends TelematicsAdapter {
  name = 'Samsara';
  
  parseEvent(rawData: any): TelematicsEvent {
    return {
      deviceId: rawData.deviceId,
      vehicleId: rawData.vehicleId,
      timestamp: new Date(rawData.time),
      latitude: rawData.gps?.latitude,
      longitude: rawData.gps?.longitude,
      speed: rawData.gps?.speed || 0,
      heading: rawData.gps?.heading || 0,
      ignition: rawData.engine?.ignition,
      fuelLevel: rawData.fuel?.percent || 0,
      odometer: rawData.engine?.odometer,
      rawData
    };
  }
  
  checkAlerts(event: TelematicsEvent): TelematicsAlert[] {
    const alerts: TelematicsAlert[] = [];
    
    if (event.speed > 100) {
      alerts.push({
        type: 'SPEEDING',
        severity: 'HIGH',
        message: Vehicle speeding at  km/h,
        timestamp: event.timestamp,
        location: { lat: event.latitude, lng: event.longitude }
      });
    }
    
    return alerts;
  }
}

// Cartrack adapter (South Africa specific)
export class CartrackAdapter extends TelematicsAdapter {
  name = 'Cartrack';
  
  parseEvent(rawData: any): TelematicsEvent {
    return {
      deviceId: rawData.device_id,
      vehicleId: rawData.vehicle_id,
      timestamp: new Date(rawData.event_time),
      latitude: rawData.lat,
      longitude: rawData.lng,
      speed: rawData.speed,
      heading: rawData.heading,
      ignition: rawData.ignition === 'on',
      fuelLevel: rawData.fuel_level || 0,
      odometer: rawData.odometer,
      rawData
    };
  }
  
  checkAlerts(event: TelematicsEvent): TelematicsAlert[] {
    const alerts: TelematicsAlert[] = [];
    
    // Check for harsh braking
    if (event.rawData?.harsh_braking) {
      alerts.push({
        type: 'HARSH_BRAKING',
        severity: 'MEDIUM',
        message: 'Harsh braking detected',
        timestamp: event.timestamp,
        location: { lat: event.latitude, lng: event.longitude }
      });
    }
    
    return alerts;
  }
}

export const telematicsAdapters = {
  geotab: new GeotabAdapter(),
  samsara: new SamsaraAdapter(),
  cartrack: new CartrackAdapter()
};

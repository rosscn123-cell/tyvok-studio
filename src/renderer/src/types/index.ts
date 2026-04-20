export type ProcessMode = 'line' | 'fill' | 'image';
export type GraphicKind = 'rect' | 'ellipse' | 'path';

export interface MaterialPreset {
  id: string;
  name: string;
  mode: ProcessMode;
  power: number;
  speed: number;
  passes: number;
  interval?: number;
}

export interface LayerProcess {
  mode: ProcessMode;
  power: number;
  speed: number;
  passes: number;
  interval?: number;
}

export interface GraphicObject {
  id: string;
  name: string;
  kind: GraphicKind;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  pathData?: string;
  process: LayerProcess;
}

export interface DeviceState {
  connected: boolean;
  status: 'idle' | 'framing' | 'running' | 'paused' | 'stopped' | 'error' | 'connected' | 'connecting';
  progress: number;
  lastMessage: string;
  portPath: string | null;
}

export interface DeviceStatus {
  connected: boolean;
  portPath: string | null;
  message: string;
  state: DeviceState['status'];
}

export interface DeviceLogEvent {
  level: 'info' | 'warn' | 'error' | 'rx' | 'tx';
  message: string;
}

export interface SerialPortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  vendorId?: string;
  productId?: string;
  friendlyName: string;
}

export interface ProjectFile {
  version: 1;
  name: string;
  canvas: {
    width: number;
    height: number;
  };
  objects: GraphicObject[];
}

export interface StudioLogEntry {
  id: string;
  time: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

declare global {
  interface Window {
    tyvok?: {
      saveProject: (suggestedName: string, content: string) => Promise<string | null>;
      openProject: () => Promise<{ filePath: string; content: string } | null>;
      importSvg: () => Promise<{ filePath: string; content: string } | null>;
      exportGcode: (suggestedName: string, content: string) => Promise<string | null>;
      listPorts: () => Promise<SerialPortInfo[]>;
      connectDevice: (path: string, baudRate: number) => Promise<DeviceStatus>;
      disconnectDevice: () => Promise<DeviceStatus>;
      startJob: (gcode: string) => Promise<DeviceStatus>;
      frameJob: (bounds: { minX: number; minY: number; maxX: number; maxY: number }, feed: number) => Promise<DeviceStatus>;
      pauseJob: () => Promise<DeviceStatus>;
      resumeJob: () => Promise<DeviceStatus>;
      stopJob: () => Promise<DeviceStatus>;
      onDeviceStatus: (handler: (payload: DeviceStatus) => void) => (() => void) | void;
      onDeviceLog: (handler: (payload: DeviceLogEvent) => void) => (() => void) | void;
    };
  }
}

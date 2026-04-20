import type { DeviceLogEvent, DeviceStatus, SerialPortInfo } from '../types';

export async function listSerialPorts(): Promise<SerialPortInfo[]> {
  return window.tyvok?.listPorts?.() ?? [];
}

export async function connectSerialDevice(path: string, baudRate: number): Promise<DeviceStatus> {
  const result = await window.tyvok?.connectDevice?.(path, baudRate);
  if (!result) throw new Error('Unable to connect device');
  return result;
}

export async function disconnectSerialDevice(): Promise<DeviceStatus> {
  const result = await window.tyvok?.disconnectDevice?.();
  if (!result) throw new Error('Unable to disconnect device');
  return result;
}

export async function startDeviceJob(gcode: string): Promise<DeviceStatus> {
  const result = await window.tyvok?.startJob?.(gcode);
  if (!result) throw new Error('Unable to start device job');
  return result;
}

export async function frameDeviceJob(bounds: { minX: number; minY: number; maxX: number; maxY: number }, feed = 3000): Promise<DeviceStatus> {
  const result = await window.tyvok?.frameJob?.(bounds, feed);
  if (!result) throw new Error('Unable to frame device job');
  return result;
}

export async function pauseDeviceJob(): Promise<DeviceStatus> {
  const result = await window.tyvok?.pauseJob?.();
  if (!result) throw new Error('Unable to pause device job');
  return result;
}

export async function resumeDeviceJob(): Promise<DeviceStatus> {
  const result = await window.tyvok?.resumeJob?.();
  if (!result) throw new Error('Unable to resume device job');
  return result;
}

export async function stopDeviceJob(): Promise<DeviceStatus> {
  const result = await window.tyvok?.stopJob?.();
  if (!result) throw new Error('Unable to stop device job');
  return result;
}

export function subscribeDeviceStatus(handler: (payload: DeviceStatus) => void) {
  return window.tyvok?.onDeviceStatus?.((payload) => handler(payload as DeviceStatus));
}

export function subscribeDeviceLog(handler: (payload: DeviceLogEvent) => void) {
  return window.tyvok?.onDeviceLog?.((payload) => handler(payload as DeviceLogEvent));
}

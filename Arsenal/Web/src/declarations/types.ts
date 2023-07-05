export enum ConflictStrategy {
  Overwrite,
  Rename,
  Reject,
}

export interface WatermarkSettings {
  fillStyle: string;
  font: string;
  fontSize: number;
  fontFamily: string;
  text: string;
  x: number;
  y: number;
}

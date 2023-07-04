export enum ConflictStrategy {
  Overwrite,
  Rename,
  Reject,
}

export interface WatermarkSettings {
  FillStyle: string;
  Font: string;
  FontSize: number;
  FontFamily: string;
  Text: string;
  X: number;
  Y: number;
}

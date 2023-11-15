export enum ConflictStrategy {
  Overwrite,
  Rename,
  Reject,
}

export interface WatermarkSettings {
  fillStyle: string;
  fontSize: number;
  fontFamily: string;
  text: string;
  x: number;
  y: number;
}

export interface ImgCropSettings {
  quality: number;
  resetText: string;
  cropShape: 'rect' | 'round';
  modalTitle: string;
  modalOk: string;
  modalCancel: string;
  showGrid: boolean;
  rotationSlider: boolean;
  aspectSlider: boolean;
  showReset: boolean;
  centered: boolean;
}

export enum ToolBarStatus {
  Show,
  Hide,
}

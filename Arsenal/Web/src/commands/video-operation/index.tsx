import FileUploadEngine from '../../common/file-upload-engine';
import isInternalFile from '../../common/is-internal-file';

interface ICommandParam {
  targetCell: string;
  operationType: OperationType;
  playRate?: string;
  newVolume?: string;
  volumeResult?: string;
  poster?: string;
  durationResult?: string;
  newCurrentTime?: string;
  currentTimeResult?: string;
  newPlaybackRate?: string;
  playbackRateResult?: string;
  playStateResult?: string;
}

export enum OperationType {
  Play = 0,
  Pause = 100,
  Mute = 200,
  Unmute = 300,
  GetVolume = 400,
  SetVolume = 500,
  SetPoster = 600,
  GetDuration = 700,
  GetPlaybackRate = 1000,
  SetPlaybackRate = 1100,
  GetPlayState = 1200,
  Download = 1300,
  RequestFullScreen = 1400,
  ExitFullScreen = 1500,
}

const videoOperationCommand = async (ctx: Forguncy.Plugin.CommandBase) => {
  const commandParam = ctx.CommandParam as ICommandParam;
  const cell = Forguncy.Helper.getCellLocation(commandParam.targetCell, ctx.getFormulaCalcContext());
  const id = `r${cell.Row}c${cell.Column}${cell.PageID}`;
  const els = $('video', `#${id}_div`);
  if (!els.length) {
    throw new Error(`找不到视频元素：${id}`);
  }

  const video = els[0] as HTMLVideoElement;

  if (commandParam.operationType === OperationType.Play) {
    await video.play();
    return;
  }

  if (commandParam.operationType === OperationType.Pause) {
    video.pause();
    return;
  }

  if (commandParam.operationType === OperationType.Mute) {
    video.muted = true;
    return;
  }

  if (commandParam.operationType === OperationType.Unmute) {
    video.muted = false;
    return;
  }

  if (commandParam.operationType === OperationType.GetVolume) {
    if (commandParam.volumeResult) {
      Forguncy.CommandHelper.setVariableValue(commandParam.volumeResult, video.volume.toString());
    }
    return;
  }

  if (commandParam.operationType === OperationType.SetVolume) {
    if (commandParam.newVolume) {
      const newVolume = Number(ctx.evaluateFormula(commandParam.newVolume));
      if (isNaN(newVolume)) {
        throw new Error(`音量不是有效的数字：${commandParam.newVolume}`);
      }
      video.volume = newVolume;
    }
    return;
  }

  if (commandParam.operationType === OperationType.SetPoster) {
    if (commandParam.poster) {
      const poster = ctx.evaluateFormula(commandParam.poster);
      if (isInternalFile(poster)) {
        video.poster = FileUploadEngine.getAccessUrl(poster);
      } else {
        video.poster = poster;
      }
    }
    return;
  }

  if (commandParam.operationType === OperationType.GetDuration) {
    if (commandParam.durationResult) {
      Forguncy.CommandHelper.setVariableValue(commandParam.durationResult, video.duration);
    }
    return;
  }

  if (commandParam.operationType === OperationType.GetPlaybackRate) {
    if (commandParam.playbackRateResult) {
      Forguncy.CommandHelper.setVariableValue(commandParam.playbackRateResult, video.playbackRate.toString());
    }
    return;
  }

  if (commandParam.operationType === OperationType.SetPlaybackRate) {
    if (commandParam.newPlaybackRate) {
      const newPlaybackRate = Number(ctx.evaluateFormula(commandParam.newPlaybackRate));
      if (isNaN(newPlaybackRate)) {
        throw new Error(`播放速度不是有效的数字：${commandParam.newPlaybackRate}`);
      }
      video.playbackRate = newPlaybackRate;
    }
    return;
  }

  if (commandParam.operationType === OperationType.GetPlayState) {
    if (commandParam.playStateResult) {
      Forguncy.CommandHelper.setVariableValue(commandParam.playStateResult, video.paused ? 'paused' : 'playing');
    }
    return;
  }

  if (commandParam.operationType === OperationType.Download) {
    FileUploadEngine.download(video.src);
    return;
  }

  if (commandParam.operationType === OperationType.RequestFullScreen) {
    await video.requestFullscreen();
    return;
  }

  if (commandParam.operationType === OperationType.ExitFullScreen) {
    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen();
    }
    return;
  }

  throw new Error(`不支持的操作类型：${commandParam.operationType}`);
};

export default videoOperationCommand;

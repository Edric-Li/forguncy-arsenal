using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("文件管理")]
[OrderWeight((int)ClientCommandOrderWeight.VideoOperationCommand)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/video.png")]
public class VideoOperationCommand : Command
{
    [DisplayName("目标单元格")]
    [JsonProperty("targetCell")]
    [Description("视频所在单元格，如果存在多个视频，只会操作第一个视频")]
    [Required]
    [FormulaProperty]
    public object TargetCell { get; set; }

    [DisplayName("操作类型")]
    [JsonProperty("operationType")]
    public OperationType OperationType { get; set; }

    [DisplayName("音量")]
    [JsonProperty("newVolume")]
    [Description("取值范围为0-1")]
    [FormulaProperty]
    public object NewVolume { get; set; }

    [DisplayName("保存音量至")]
    [JsonProperty("volumeResult")]
    public string VolumeResult { get; set; }

    [DisplayName("封面")]
    [FormulaProperty]
    [JsonProperty("poster")]
    public object Poster { get; set; }

    [DisplayName("保存视频时长至")]
    [JsonProperty("durationResult")]
    [Description("单位为秒")]
    [ResultToProperty]
    public string DurationResult { get; set; }

    [DisplayName("播放速度")]
    [JsonProperty("newPlaybackRate")]
    [FormulaProperty]
    public object NewPlaybackRate { get; set; }

    [DisplayName("保存播放速度至")]
    [JsonProperty("playbackRateResult")]
    [ResultToProperty]
    public string PlaybackRateResult { get; set; }

    [DisplayName("保存播放状态至")]
    [JsonProperty("playStateResult")]
    [Description("将播放状态保存至变量中，变量类型为字符串，值为：playing、paused")]
    [ResultToProperty]
    public string PlayStateResult { get; set; }

    public override bool GetDesignerPropertyVisible(string propertyName, CommandScope commandScope)
    {
        return propertyName switch
        {
            nameof(NewVolume) => OperationType == OperationType.SetVolume,
            nameof(VolumeResult) => OperationType == OperationType.GetVolume,
            nameof(Poster) => OperationType == OperationType.SetPoster,
            nameof(DurationResult) => OperationType == OperationType.GetDuration,
            nameof(NewPlaybackRate) => OperationType == OperationType.SetPlaybackRate,
            nameof(PlaybackRateResult) => OperationType == OperationType.GetPlaybackRate,
            nameof(PlayStateResult) => OperationType == OperationType.GetPlayState,
            _ => base.GetDesignerPropertyVisible(propertyName, commandScope)
        };
    }

    public override string ToString()
    {
        return "视频操作";
    }
}

public enum OperationType
{
    [Description("播放")] Play = 0,

    [Description("暂停")] Pause = 100,

    [Description("静音")] Mute = 200,

    [Description("取消静音")] Unmute = 300,

    [Description("获取音量")] GetVolume = 400,

    [Description("设置音量")] SetVolume = 500,

    [Description("设置封面")] SetPoster = 600,

    [Description("获取视频时长")] GetDuration = 700,

    [Description("获取播放速度")] GetPlaybackRate = 1000,

    [Description("设置播放速度")] SetPlaybackRate = 1100,

    [Description("获取播放状态")] GetPlayState = 1200,

    [Description("下载")] Download = 1300,

    [Description("全屏")] RequestFullScreen = 1400,

    [Description("退出全屏")] ExitFullScreen = 1500,
}
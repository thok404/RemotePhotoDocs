---
title: RemotePhotoManager
---
# RemotePhotoManager

![446](../../assets/Pasted-image-20260507000125.png)

RemotePhotoManager 控制整个系统：导入图库 JSON、设置播放模式、设置加载模式，并连接 Groups。

> 一个场景中只应存在一个 RemotePhotoManager。

## 参数

| 参数 | 说明 |
|---|---|
| Language (语言) | 切换该组件的编辑器语言。 |
| Gallery Config JSON (图库配置 JSON) | 导入网页工具生成的 JSON 并创建图库。图库会按 Landscape / Portrait 分开，以匹配对应 Frames。 |
| Play Mode (播放模式) | 设置图库顺序。全局只选择一种模式：随机、正序或倒序。 |
| Loading Mode (加载模式) | 在 Preload 与 NonPreload 加载方式之间切换。 |
| Load Once On Start (开始时加载一次) | 实例启动时，自动为所有受管 Frames 加载一次照片。 |
| Load Once Delay Seconds (首次加载延迟秒数) | 实例启动后，等待多久再执行 `Load Once On Start`。 |
| Retry Attempts (重试次数) | 图片加载失败后的最大重试次数。 |
| Retry Delay Seconds (重试间隔秒数) | 图片加载失败后，每次重试之间的等待时间。 |
| Debug Logs (调试日志) | 输出调试日志。 |
| Managed Groups (受管组) | 由该 Manager 管理的 Groups。只有列在这里的 Groups 会生效。 |

## 仅 Preload

| 参数 | 说明 |
|---|---|
| Landscape Cache Size (横图缓存数量) | 预加载缓存中保留的 Landscape 照片数量。 |
| Portrait Cache Size (竖图缓存数量) | 预加载缓存中保留的 Portrait 照片数量。 |

---
title: 配置
---
## 核心结构

RemotePhotoSystem 由四类组件组成：

| 组件 | 能力 |
| -------------------- | ------------------------ |
| `RemotePhotoManager` | 管理图库、播放模式、加载模式、预加载缓存和受管组 |
| `RemotePhotoGroup` | 管理一组相框，并提供换图事件 |
| `RemotePhotoFrame` | 在网格材质上显示远程图片 |
| `RemotePhotoButton` | 将按钮操作转发到 Group 事件 |

RemotePhotoSystem 将照片从世界文件转移到远程 URL，但运行时仍然需要支付下载、Texture、显存、材质实例、draw call 和同步成本。



## 1. Manager

一个场景只使用一个 `RemotePhotoManager`。多个 Manager 未经过测试，可能导致致命 bug。

`RemotePhotoManager` 集中管理图库、播放、加载、Group 顺序和 Shader 检查。

| 功能 | 说明 |
| -------------------------- | ----------------------------- |
| `Language` | 切换本项目 Inspector 文案语言，不影响游戏内显示 |
| `Gallery Config JSON` | 接收 WebTool 导出的图库 JSON |
| `Import JSON Into Gallery` | 将 JSON Bake 到运行时 URL 数组 |
| `Play Mode` | 控制 Group 触发时如何选择 URL |
| `Loading Mode` | 控制图片是否进入预加载缓存 |
| `Load Once On Start` | 世界启动后自动触发所有受管 Group 一次 |
| `Managed Groups` | Manager 管理的 Group 列表 |

Unity 只记录 `url` 和 `orientation` 以节省内存。JSON 中的 `id`、`tags`、`note` 和 `metadata` 由 WebTool 读取，用来让图库管理更方便。

创建更大的图库主要会增加 Bake 后的 JSON 数组、Unity 序列化数据和维护成本。

当前正在显示的图片，以及被 `Preload` 缓存的图片，拥有最大的性能成本。

## 2. Gallery

| WebTool 能力 | 说明 |
| ------------- | ------------------------------------ |
| 导入 URL | 接收少量手动输入或大量批量 URL |
| 标签 / 备注 | 只用于图库维护，不进入运行时数组 |
| 探测图片尺寸 | 可以辅助判断 `Landscape` / `Portrait` |
| 导出 Unity JSON | 供 Manager 的 `Gallery Config JSON` 使用 |

WebTool 详细文档可以在[这里](../webtool/)查看。

图片 URL 必须满足 VRChat 图片加载要求。相关限制见官方文档：  
https://creators.vrchat.com/worlds/udon/image-loading/

个人图床相关内容可以在[这里](../self-hosted-image-solution/)详细查看。

每个 Frame 只从匹配自身方向的图库取图：

| Frame 方向 | 使用图库 |
|---|---|
| `Landscape` | 横图图库 |
| `Portrait` | 竖图图库 |

不要依赖旋转 Landscape 图片来解决 Portrait 相框。图库中的竖图应标记为 `Portrait`，Frame 也应设置为 `Portrait`。

将 Landscape 相框转换为 Portrait 相框时，请**将相框物体逆时针旋转 90°**以获得正确的图片方向。

如果某个方向的图库为空，该方向的 Frame 就没有可用图片。

## 3. Playback

`Play Mode` 决定 Group 触发时如何选择 URL。

| 模式 | 能力 | 可用事件 |
| ------------------------------------- | --------------------------------- | ------------------------------------- |
| `Random` | 为 Group 内的 Frame 随机分配图片，同一批次同方向尽量避免重复 | `TriggerRandom()` |
| `SequenceForward`/  `SequenceReverse` | 按图库正序/倒序翻页 | `TriggerPrevious()` / `TriggerNext()` |

随机模式和顺序模式互斥。

顺序模式中，Landscape Frame 只推进 Landscape 队列，Portrait Frame 只推进 Portrait 队列。一个 Group 可以混合 Landscape 和 Portrait Frame。

## 4. Loading

`Loading Mode` 控制图片下载路径。

| 模式 | 能力 |
| ------------ | -------------------------- |
| `NonPreload` | 需要图片时直接下载，不维护预加载缓存 |
| `Preload` | 提前将一部分图片下载进缓存。命中缓存时可以更快显示 |

`Preload` 用内存、显存和下载队列压力换取显示速度。缓存越大，运行时资源占用越高。

`NonPreload` 不维护缓存，只有显示图片数量和分辨率会影响性能


粗略 Texture 成本：

| 分辨率 | RGBA 纹理约占 |
|---|---|
| 1024 x 1024 | 约 4 MB |
| 2048 x 2048 | 约 16 MB |
| 4096 x 4096 | 约 64 MB |

超大图片叠加大缓存会快速增加内存和显存压力。Android 上风险更高。


启用 `Load Once On Start` 后，会在 `Load Once Delay Seconds` 后按 `Managed Groups` 顺序触发所有受管 Group 一次。

`Retry Attempts` 和 `Retry Delay Seconds` 是下载失败时的全局重试设置。

## 5. Groups

`RemotePhotoGroup` 定义一个可以独立刷新的相框区域。

| 功能 | 说明 |
|---|---|
| `Permission Mode` | 控制谁可以触发该 Group |
| `Trigger Cooldown Seconds` | 限制成功触发之间的最短间隔 |
| `Frames` | 该 Group 控制的 Frame 列表 |

Group 和 Frame 都会按照上级管理列表的顺序请求 URL 并加载图片。

如果点击一个按钮会刷新玩家当前位置看不到的相框，那就是浪费。毕竟 VRChat 只允许我们每 5 秒最多加载一张图片。按区域划分 Group 是很好的选择。

多人连续触发会增加同步状态和下载队列压力。冷却用于限制成功触发频率。5 秒是不错的选择。

## 6. Frames

`RemotePhotoFrame` 负责将远程图片写入当前物体的 `MeshRenderer` 材质。

| 功能 | 说明 |
|---|---|
| `Orientation` | 决定 Frame 使用 Landscape 还是 Portrait 图库 |
| `Material Slot` | 指定写入哪个材质槽 |
| `Texture Property` | 指定写入哪个贴图属性，项目专用 Shader 通常保持 `_MainTex` |
| `Default Texture` | 启动时显示的默认贴图 |
| `Use Fallback Texture` | 控制加载失败时是否显示 Fallback |
| `Fallback Texture` | 加载失败时显示的回退贴图 |
| `Background Color` | `Contain` 留边和 `Box` 侧面的填充色 |

关闭 `Use Fallback Texture` 时，加载失败不会覆盖当前画面；开启时，加载失败会显示 `Fallback Texture`。

### 图片适配

| `Photo Fit Mode` | 作用 |
| ---------------- | -------------------------------- |
| `Crop` | 按相框比例裁切图片，让画面填满相框 |
| `Contain` | 保留完整图片，空白区域使用 `Background Color` |
| `Stretch` | 直接将图片拉伸到相框比例 |
| `Tile` | 重复平铺图片 |

### 投射方式

| `Projection Mode` | 作用 |
| ----------------- | ----------------------------------------- |
| `Mesh UV` | 使用模型自身 UV 显示图片 |
| `Box` | 将最短边视为厚度，在正反面投射图片，侧面使用 `Background Color` |

`Horizontal Flip` 只作用于 `Box`，用于水平翻转 Box 投射结果。

### 比例和旋转

| 功能 | 说明 |
|---|---|
| `Manual` | 使用 `Manual Aspect Ratio` 作为固定宽高比 |
| `Auto` | 根据当前网格自动计算宽高比 |
| `Reference Box` | 使用自定义 Reference Box 计算宽高比 |
| `Photo Rotation Offset` | 对最终图片显示结果增加旋转补偿，支持 `Mesh UV` 和 `Box` |

## 7. Shader

照片显示材质必须使用项目专用 Shader：

| Shader | 用途 |
| --------------------------------------------- | ------------------------ |
| `RemotePhotoSystem/Photo Frame Display Unlit` | 不计算场景光照，像屏幕一样显示，性能友好 |
| `RemotePhotoSystem/Photo Frame Display Lit` | 计算场景光照，更融入环境，并带来更多 drawcall |

每个 `RemotePhotoFrame` 在运行时都需要独立材质实例来显示不同图片。

相框数量增加会带来 Drawcall 增加

Manager 会扫描 `Managed Groups -> Frames` 覆盖到的相框。如果相框材质没有使用项目专用 Shader，Inspector 会显示警告。

警告区提供两个快速设置按钮
这两个按钮只处理当前 Manager 通过 `Managed Groups` 连接到的 Frame 材质。

## 8. Buttons

`RemotePhotoButton` 将 `Button Action` 映射到目标 Group 事件。

| `Button Action` | 调用事件 | 可用播放模式 |
|---|---|---|
| `Random` | `TriggerRandom()` | `Random` |
| `Previous` | `TriggerPrevious()` | `SequenceForward` / `SequenceReverse` |
| `Next` | `TriggerNext()` | `SequenceForward` / `SequenceReverse` |

外部 VRC 按钮、开关、菜单和触发器资产可以直接连接到 `RemotePhotoGroup` 的公开事件：

| 操作 | 事件 |
|---|---|
| 随机换图 | `TriggerRandom()` |
| 翻到上一页 | `TriggerPrevious()` |
| 翻到下一页 | `TriggerNext()` |

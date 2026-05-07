---
title: RemotePhotoGroup
---
# RemotePhotoGroup

![512](../../assets/images/Pasted-image-20260507002012.png)

RemotePhotoGroup 设置一个组的互动权限、触发冷却和连接的 Frames。

## 参数

| 参数 | 说明 |
|---|---|
| Permission Mode (触发权限) | 控制谁可以与该 Group 互动。可选 `Everyone`、`Owner Only`、`Master Only`。多数情况使用 `Everyone`。 |
| Trigger Cooldown Seconds (触发冷却秒数) | 两次成功换图触发之间需要等待的秒数，也就是重复按按钮的间隔。 |
| Frames (相框) | 连接到该 Group 的 Frames。只有被 RemotePhotoManager 管理的 Groups 中的 Frames 会生效。这里的顺序决定照片从图库分配到 Frames 的顺序。 |

## 事件

| 事件 | 说明 |
|---|---|
| TriggerRandom() | 触发随机换图。仅在 Random 模式下有效。 |
| TriggerPrevious() | 翻到上一页。仅在顺序 / 倒序模式下有效。 |
| TriggerNext() | 翻到下一页。仅在顺序 / 倒序模式下有效。 |

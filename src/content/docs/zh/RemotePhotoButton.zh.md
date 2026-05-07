---
title: RemotePhotoButton
---
# RemotePhotoButton

![562](Pasted%20image%2020260507120138.png)

RemotePhotoButton 用于预制按钮。

> 如果使用外部按钮资产，请直接使用 RemotePhotoGroup 上的 `TriggerRandom()`、`TriggerPrevious()`、`TriggerNext()` 事件，而不是使用这个组件。

如果仍然想用这个组件制作自己的按钮，请调用它的 `TriggerSelectedAction()` 事件。例如，在 Button 组件的 On Click 列表中引用该组件，并将 `UdonBehaviour.SendCustomEvent` 设置为 `TriggerSelectedAction`。

![564](Pasted%20image%2020260507121858.png)

## 参数

| 参数 | 说明 |
|---|---|
| Remote Photo Group (相框组) | 该按钮控制的 Group。使用带有 RemotePhotoGroup 组件的 GameObject。 |
| Button Action (按钮动作) | 选择该按钮触发的事件。 |

## Button Action

| 选项 | 说明 |
|---|---|
| Random | 触发 Group 的 `TriggerRandom()` 事件。用于随机按钮。 |
| Previous | 触发 Group 的 `TriggerPrevious()` 事件。用于上一页按钮。 |
| Next | 触发 Group 的 `TriggerNext()` 事件。用于下一页按钮。 |

## 事件

| 事件 | 说明 |
|---|---|
| TriggerSelectedAction() | 桥接三种内置 `Button Action` 事件。 |

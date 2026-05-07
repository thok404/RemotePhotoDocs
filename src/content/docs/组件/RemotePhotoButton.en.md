---
title: RemotePhotoButton
---
# RemotePhotoButton

![562](../../assets/Pasted-image-20260507120138.png)

RemotePhotoButton is used for prefab buttons.

> If you use an external button asset, use the `TriggerRandom()`, `TriggerPrevious()`, and `TriggerNext()` events on RemotePhotoGroup instead of this component.

If you want to build your own button with this component anyway, call its `TriggerSelectedAction()` event. For example, reference this component from the Button component's On Click list, and set `UdonBehaviour.SendCustomEvent` to `TriggerSelectedAction`.

![564](../../assets/Pasted-image-20260507121858.png)

## Parameters

| Parameter | Description |
|---|---|
| Remote Photo Group | The Group controlled by this button. Use a GameObject with a RemotePhotoGroup component. |
| Button Action | Selects the event this button triggers. |

## Button Action

| Option | Description |
|---|---|
| Random | Triggers the Group's `TriggerRandom()` event. Use this for a random button. |
| Previous | Triggers the Group's `TriggerPrevious()` event. Use this for a previous-page button. |
| Next | Triggers the Group's `TriggerNext()` event. Use this for a next-page button. |

## Events

| Event | Description |
|---|---|
| TriggerSelectedAction() | Bridges the three built-in `Button Action` events. |

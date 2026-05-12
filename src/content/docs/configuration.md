---
title: Configuration
---
## Core structure

RemotePhotoSystem consists of four types of components:

| Component | Capability |
| -------------------- | ------------------------ |
| `RemotePhotoManager` | Manages the gallery, play mode, loading mode, preload cache, and managed groups |
| `RemotePhotoGroup` | Manages a group of frames and provides photo-changing events |
| `RemotePhotoFrame` | Displays remote images on a mesh material |
| `RemotePhotoButton` | Forwards button operations to Group events |

RemotePhotoSystem moves photos from the world file to remote URLs, but at runtime you still pay download, Texture, VRAM, material instance, draw call, and sync costs.



## 1. Manager

Use only one `RemotePhotoManager` in one scene. Multiple Managers have not been tested and may cause fatal bugs.

`RemotePhotoManager` centrally manages the gallery, playback, loading, Group order, and Shader checks.

| Feature | Description |
| -------------------------- | ----------------------------- |
| `Language` | Switches this project's Inspector text language. It does not affect in-game display |
| `Gallery Config JSON` | Receives the gallery JSON exported by WebTool |
| `Import JSON Into Gallery` | Bakes the JSON into runtime URL arrays |
| `Play Mode` | Controls how URLs are selected when a Group is triggered |
| `Loading Mode` | Controls whether images enter the preload cache |
| `Load Once On Start` | Automatically triggers all managed Groups once after the world starts |
| `Managed Groups` | The list of Groups managed by the Manager |

Unity only records `url` and `orientation` to save memory. `id`, `tags`, `note`, and `metadata` in the JSON are read by WebTool to make gallery management easier.

Creating a larger gallery mainly increases the baked JSON arrays, Unity serialized data, and maintenance cost.

Images currently displayed and images cached by `Preload` have the largest performance cost.

## 2. Gallery

| WebTool capability | Description |
| ------------- | ------------------------------------ |
| Import URLs | Accepts a small amount of manual input or large batches of URLs |
| Tags / Notes | Only used for gallery maintenance and not included in runtime arrays |
| Probe image sizes | Can help determine `Landscape` / `Portrait` |
| Export Unity JSON | Used by the Manager's `Gallery Config JSON` |

Detailed WebTool documentation can be viewed [here](../webtool/).

Image URLs must meet VRChat image loading requirements. See the official documentation for related limits:  
https://creators.vrchat.com/worlds/udon/image-loading/

Personal image hosting content can be viewed in detail [here](../self-hosted-image-solution/).

Each Frame only takes images from the gallery matching its orientation:

| Frame orientation | Gallery used |
|---|---|
| `Landscape` | Landscape gallery |
| `Portrait` | Portrait gallery |

Do not rely on rotating Landscape images to solve Portrait frames. Portrait images in the gallery should be marked as `Portrait`, and the Frame should also be set to `Portrait`.

When converting a Landscape frame into a Portrait frame, **rotate the frame object 90° counterclockwise** to get the correct image orientation.

If the gallery for an orientation is empty, Frames of that orientation have no available images.

## 3. Playback

`Play Mode` decides how URLs are selected when a Group is triggered.

| Mode | Capability | Available event |
| ------------------------------------- | --------------------------------- | ------------------------------------- |
| `Random` | Randomly assigns images to Frames in the Group, avoiding repeats in the same orientation within one batch as much as possible | `TriggerRandom()` |
| `SequenceForward`/  `SequenceReverse` | Pages through the gallery in forward/reverse order | `TriggerPrevious()` / `TriggerNext()` |

Random mode and sequence mode are mutually exclusive.

In sequence mode, Landscape Frames only advance the Landscape queue, and Portrait Frames only advance the Portrait queue. One Group can mix Landscape and Portrait Frames.

## 4. Loading

`Loading Mode` controls the image download path.

| Mode | Capability |
| ------------ | -------------------------- |
| `NonPreload` | Downloads directly when images are needed, without maintaining a preload cache |
| `Preload` | Downloads some images into cache in advance. Cache hits can display faster |

`Preload` trades memory, VRAM, and download queue pressure for display speed. The larger the cache, the higher the runtime resource usage.

`NonPreload` does not maintain cache. Only the number and resolution of displayed images affect performance


Rough Texture cost:

| Resolution | Approximate RGBA texture cost |
|---|---|
| 1024 x 1024 | About 4 MB |
| 2048 x 2048 | About 16 MB |
| 4096 x 4096 | About 64 MB |

Oversized images combined with a large cache will quickly increase memory and VRAM pressure. The risk is higher on Android.


When `Load Once On Start` is enabled, all managed Groups are triggered once in `Managed Groups` order after `Load Once Delay Seconds`.

`Retry Attempts` and `Retry Delay Seconds` are global retry settings for failed downloads.

## 5. Groups

`RemotePhotoGroup` defines a frame area that can be refreshed independently.

| Feature | Description |
|---|---|
| `Permission Mode` | Controls who can trigger this Group |
| `Trigger Cooldown Seconds` | Limits the shortest interval between successful triggers |
| `Frames` | The list of Frames controlled by this Group |

Groups and Frames both request URLs and load images according to the order of their parent management lists.

If clicking one button refreshes frames that players cannot see from their current position, that is wasteful. After all, VRChat only allows us to load at most one image every 5 seconds. Dividing Groups by area is a good choice.

Repeated multiplayer triggers increase sync state and download queue pressure. Cooldown is used to limit successful trigger frequency. 5 seconds is a good choice.

## 6. Frames

`RemotePhotoFrame` is responsible for writing remote images into the current object's `MeshRenderer` material.

| Feature | Description |
|---|---|
| `Orientation` | Decides whether the Frame uses the Landscape or Portrait gallery |
| `Material Slot` | Specifies which material slot to write to |
| `Texture Property` | Specifies which texture property to write to. The project shader usually keeps `_MainTex` |
| `Default Texture` | Default texture displayed on start |
| `Use Fallback Texture` | Controls whether Fallback is displayed when loading fails |
| `Fallback Texture` | Fallback texture displayed when loading fails |
| `Background Color` | Fill color for `Contain` padding and `Box` side faces |

When `Use Fallback Texture` is off, loading failure does not overwrite the current display; when it is on, loading failure displays `Fallback Texture`.

### Image fit

| `Photo Fit Mode` | Effect |
| ---------------- | -------------------------------- |
| `Crop` | Crops the image to the frame ratio so the image fills the frame |
| `Contain` | Keeps the full image, and uses `Background Color` for empty areas |
| `Stretch` | Directly stretches the image to the frame ratio |
| `Tile` | Repeats the image as tiles |

### Projection mode

| `Projection Mode` | Effect |
| ----------------- | ----------------------------------------- |
| `Mesh UV` | Uses the model's own UVs to display the image |
| `Box` | Treats the shortest side as thickness, projects the image onto front/back faces, and uses `Background Color` on side faces |

`Horizontal Flip` only affects `Box`, and is used to horizontally flip the Box projection result.

### Aspect and rotation

| Feature | Description |
|---|---|
| `Manual` | Uses `Manual Aspect Ratio` as a fixed width-height ratio |
| `Auto` | Automatically calculates the width-height ratio from the current mesh |
| `Reference Box` | Uses a custom Reference Box to calculate the width-height ratio |
| `Photo Rotation Offset` | Adds rotation compensation to the final image display result, supporting both `Mesh UV` and `Box` |

## 7. Shader

The photo display material must use the project shader:

| Shader | Purpose |
| --------------------------------------------- | ------------------------ |
| `RemotePhotoSystem/Photo Frame Display Unlit` | Does not calculate scene lighting, displays like a screen, and is performance-friendly |
| `RemotePhotoSystem/Photo Frame Display Lit` | Calculates scene lighting, blends better into the environment, and has more draw calls |

Each `RemotePhotoFrame` needs an independent material instance at runtime to display a different image.

Increasing the number of frames increases draw calls

Manager scans frames covered by `Managed Groups -> Frames`. If a frame material does not use the project shader, the Inspector shows a warning.

The warning area provides two quick setup buttons
These two buttons only process Frame materials connected to the current Manager through `Managed Groups`.

## 8. Buttons

`RemotePhotoButton` maps `Button Action` to the target Group event.

| `Button Action` | Called event | Available play mode |
|---|---|---|
| `Random` | `TriggerRandom()` | `Random` |
| `Previous` | `TriggerPrevious()` | `SequenceForward` / `SequenceReverse` |
| `Next` | `TriggerNext()` | `SequenceForward` / `SequenceReverse` |

External VRC button, switch, menu, and trigger assets can directly connect to public events on `RemotePhotoGroup`:

| Operation | Event |
|---|---|
| Random photo change | `TriggerRandom()` |
| Go to previous page | `TriggerPrevious()` |
| Go to next page | `TriggerNext()` |

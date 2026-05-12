---
title: Quick Start
---
Quick Start does only one thing: **first make a random photo button successfully load remote images in the scene**.

This will not explain too much theory. You can finish the steps first, confirm that it runs successfully, then come back to read other content.

## 0. Requirements

Prepare several direct image links with resolution <=2048 x 2048. Direct links often end with an image format such as `.jpg`, `.png`, `.gif`, `.webp`. For more detailed image requirements, see the official VRChat documentation https://creators.vrchat.com/worlds/udon/image-loading/

Using jpg format and images around 1024 resolution is recommended for better network transmission, storage, and game performance experience

You can search the web to get direct image links, upload your own images to an image host to get direct links, or use a GitHub repository or CloudFlareR2 to create a long-term stable personal image host. [Click here](self-hosted-image-solution.md) to learn more about personal image hosting.


Please use the following versions or higher as much as possible:

| Dependency | Version |
| ------------------- | ------------- |
| Unity | `2022.3.22f1` |
| VRChat SDK - Worlds | `3.10.3` or higher |
| VRChat SDK - Base | `3.10.3` or higher |

> Lower version environments may also run, but fatal errors may exist.

## 1. Import RemotePhotoSystem

Import the `unitypackage` of `RemotePhotoSystem` into your Unity project.

![](../../assets/images/Pasted%20image%2020260508212908.png)

## 2. Place frames and buttons

Find the frame and button prefabs in the `Prefab` folder, and drag them into the scene.

This tutorial only demonstrates one random button. Random mode and sequence page mode should not be mixed in the same Manager.

![](../../assets/images/Pasted%20image%2020260508213732.png)

## 3. Create Manager

Right-click an empty area in `Hierarchy`, then choose:

`Remote Photo System -> Create Manager`

This creates an object in the scene with a `RemotePhotoManager` component.

![236](../../assets/images/Pasted%20image%2020260508214533.png)

## 4. Use WebTool to create gallery JSON

Open the `WebTool` folder in the project, and open `index.html` with a browser.

Paste image direct links into `Bulk URL Import`, one URL per line, then click `Import Pasted URLs`.

![](../../assets/images/Pasted%20image%2020260508215209.png)

## 5. Automatically detect Landscape / Portrait

Scroll down the page, set `Probe Scope` to `Missing Metadata`, then click `Probe Image Sizes`.

The web tool will try to read image dimensions and automatically fill `Orientation`.

![](../../assets/images/Pasted%20image%2020260508215426.png)

> If some images cannot be detected automatically, manually set them to `Landscape` or `Portrait`.

## 6. Export Unity JSON

After confirming that the image list has no issues, return to the top of the page and click `Export Unity JSON` in the upper-right corner.

The browser will download a gallery config file. Put this JSON file anywhere you like inside the Unity project's `Assets` directory.

![](../../assets/images/Pasted%20image%2020260508215653.png)

## 7. Import gallery into Manager

Return to Unity and select the Manager created in step 3.

Drag the JSON file you just exported into `Gallery Config JSON`, then click:

`Import JSON Into Gallery`

If `Total photos` below becomes the number of images you imported, the gallery import succeeded.

![](../../assets/images/Pasted%20image%2020260508220510.png)

## 8. Create Group

Find `Managed Groups` at the bottom of the Manager Inspector, then click:

`Add Group`

The system will create a new child object under the Manager and automatically attach `RemotePhotoGroup`.

![](../../assets/images/Pasted%20image%2020260508220830.png)

## 9. Add frames to Group

Expand the frame prefab hierarchy and find the `Photo` child object that actually displays photos.

Select the Group you just created, and drag these `Photo` child objects into the Group's `Frames` list.

> The order of `Frames` is the photo assignment and loading order. At first, just place them in an intuitive order such as left to right or near to far in the scene.

![](../../assets/images/Pasted%20image%2020260508221218.png)

## 10. Connect button

Select the button object and drag the Group you just created into the button component's `Remote Photo Group`.

Then confirm that `Button Action` is set to:

`Random`

![](../../assets/images/Pasted%20image%2020260508221624.png)

## 11. Runtime test

Enter Play Mode and click the button.

If the configuration is correct, the frames will start loading remote images.

![](../../assets/images/Pasted%20image%2020260508222815.png)

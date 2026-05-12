---
title: 快速开始
---

# 快速开始

快速开始只做一件事：**先让一个随机照片按钮在场景里成功加载远程图片**。

这里不会解释太多原理。你可以先按步骤做完，确认运行成功后，再回头阅读其他内容。

## 0. 环境要求

准备数张分辨率<=2048 x 2048的图片直链。直链通常以 `.jpg`、`.png`、`.gif`、`.webp` 等图片格式结尾。更详细的图片要求请参阅 VRChat 官方文档 https://creators.vrchat.com/worlds/udon/image-loading/

推荐使用 jpg 格式和 1024 左右分辨率的图片，以获得更好的网络传输、储存和游戏性能体验

你可以在网页上搜索获取图片直链，也可以把自己的图片上传至图床获取直链，还可以使用 GitHub 仓库或 CloudFlareR2 创建长期稳定的个人图床。关于个人图床可以[点击此处](../self-hosted-image-solution/)详细了解。


请尽量使用以下版本或更高版本：

| 依赖 | 版本 |
| ------------------- | ------------- |
| Unity | `2022.3.22f1` |
| VRChat SDK - Worlds | `3.10.3` 或更高 |
| VRChat SDK - Base | `3.10.3` 或更高 |

> 更低版本的环境可能也能运行，但可能存在致命错误。

## 1. 导入 RemotePhotoSystem

将 `RemotePhotoSystem` 的 `unitypackage` 导入到你的 Unity 项目中。

![](../../../assets/images/Pasted%20image%2020260508212908.png)

## 2. 放入相框和按钮

在 `Prefab` 文件夹中找到相框和按钮预制件，把它们拖入场景。

本教程只演示一个随机按钮。随机模式和顺序翻页模式不要在同一个 Manager 里混用。

![](../../../assets/images/Pasted%20image%2020260508213732.png)

## 3. 创建 Manager

在 `Hierarchy` 空白处右键，选择：

`Remote Photo System -> Create Manager`

这会在场景中创建一个带有 `RemotePhotoManager` 组件的对象。

![236](../../../assets/images/Pasted%20image%2020260508214533.png)

## 4. 用 WebTool 制作图库 JSON

打开项目中的 `WebTool` 文件夹，用浏览器打开 `index.html`。

把图片直链粘贴到 `Bulk URL Import`，每行一个 URL，然后点击 `Import Pasted URLs`。

![](../../../assets/images/Pasted%20image%2020260508215209.png)

## 5. 自动识别 Landscape / Portrait

向下滚动网页，将 `Probe Scope` 设置为 `Missing Metadata`，然后点击 `Probe Image Sizes`。

网页工具会尝试读取图片尺寸，并自动填写 `Orientation`。

![](../../../assets/images/Pasted%20image%2020260508215426.png)

> 如果某些图片无法自动识别，手动把它们设为 `Landscape` 或 `Portrait` 即可。

## 6. 导出 Unity JSON

确认图片列表没有问题后，回到网页顶部，点击右上角的 `Export Unity JSON`。

浏览器会下载一个图库配置文件。把这个 JSON 文件放进 Unity 项目的 `Assets` 目录中任意你喜欢的位置。

![](../../../assets/images/Pasted%20image%2020260508215653.png)

## 7. 导入图库到 Manager

回到 Unity，选中第 3 步创建的 Manager。

将刚刚导出的 JSON 文件拖到 `Gallery Config JSON`，然后点击：

`Import JSON Into Gallery`

如果下方的 `Total photos` 变成你导入的图片数量，就表示图库导入成功。

![](../../../assets/images/Pasted%20image%2020260508220510.png)

## 8. 创建 Group

在 Manager Inspector 下方找到 `Managed Groups`，点击：

`Add Group`

系统会在 Manager 下面创建一个新的子对象，并自动挂上 `RemotePhotoGroup`。

![](../../../assets/images/Pasted%20image%2020260508220830.png)

## 9. 把相框加入 Group

展开相框预制件层级，找到真正显示照片的 `Photo` 子对象。

选中刚刚创建的 Group，把这些 `Photo` 子对象拖入 Group 的 `Frames` 列表。

> `Frames` 的顺序就是图片分配和加载的顺序。先按场景里从左到右、从近到远之类的直觉顺序放就可以。

![](../../../assets/images/Pasted%20image%2020260508221218.png)

## 10. 连接按钮

选中按钮对象，把刚刚创建的 Group 拖到按钮组件的 `Remote Photo Group`。

然后确认 `Button Action` 设置为：

`Random`

![](../../../assets/images/Pasted%20image%2020260508221624.png)

## 11. 运行测试

进入 Play Mode，点击按钮。

如果配置正确，相框会开始加载远程图片。

![](../../../assets/images/Pasted%20image%2020260508222815.png)

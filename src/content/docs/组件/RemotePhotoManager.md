---
title: RemotePhotoManager
---
![446](../../assets/Pasted%20image%2020260507000125.png)

***RemotePhotoManager***用来管理整个系统的行为，导入画廊JSON、设置加载模式和连接组。==\*一个场景中只能同时存在一个Manager\*==

## 参数

**Language (语言):** 切换组件在编辑器内的语言

**Gallery Config JSON (图库配置 JSON):** 用于导入使用网页工具生成的JSON，创建画廊，画廊会根据横向/纵向构图分为两个图池，分别供两种构图方向的相框使用


**Play Mode (播放模式):** 切换画廊中图像的排列模式，有随机/正序/倒序三种模式，全局只能选择使用一种模式
**Loading Mode(加载模式) :** 切换预加载模式与非预加载模式
**Load Once On Start(开始时加载一次) :** 实例开始时自动为所有受管理的相框加载图片
**Load Once Delay Seconds (首次加载延迟秒数):** 实例开始后延迟多少秒再开始**Load Once On Start**
**Retry Attempts(重试次数) :** 加载失败的图片最多重试加载次数
**Retry Delay Seconds(重试间隔秒数) :** 加载失败的图片重试加载间隔

*------------Preload Only------------*
**Landscape Cache Size(横图缓存数量) :** 预加载缓存池要保持的横向构图数量
**Portrait Cache Size (竖图缓存数量):** 预加载缓存池要保持的纵向构图数量
*------------Preload Only------------*

**Debug Logs (调试日志):** 输出调试日志


**Managed Groups(受管组) :** 管理场景中的组(带有RemotePhotoGroup组件的游戏对象)，只有被添加进这里的组才会算作生效


---
title: RemotePhotoButton
---
![562](../../assets/images/Pasted-image-20260507120138.png)

***RemotePhotoButton***供预制件按钮使用。

==**如果你使用外部按钮资产，使用RemotePhotoGroup的TriggerRandom、TriggerPrevious、TriggerNext事件制作这三种按钮，而不是这个组件**==

如果你确实想要使用这个组件构建你自己的按钮，调用本组件的TriggerSelectedAction事件，比如在Button组件的On Click内引用本组件，设置UdonBehaviour.SendCustomEvent为TriggerSelectedAction
![564](../../assets/images/Pasted-image-20260507121858.png)

## 参数

Remote Photo Group (相框组): 放入要被这个按钮作用的组(带有RemotePhotoGroup组件的游戏对象)

Button Action (按钮动作): 选择这个按钮会触发的事件
	Random : 触发组的TriggerRandom事件，随机按钮应该使用它
	Previous : 触发组的TriggerPrevious事件，上一页按钮应该使用它
	Next : 触发组的TriggerNext事件，下一页按钮应该使用它


## 事件

TriggerSelectedAction() : 桥接Button Action的三种内置事件
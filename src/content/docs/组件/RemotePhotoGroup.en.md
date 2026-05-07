# RemotePhotoGroup

![512](Pasted%20image%2020260507002012.png)

RemotePhotoGroup sets the interaction permission, trigger cooldown, and connected Frames for one group.

## Parameters

| Parameter | Description |
|---|---|
| Permission Mode | Controls who can interact with this Group. Choose from `Everyone`, `Owner Only`, and `Master Only`. Use `Everyone` for most cases. |
| Trigger Cooldown Seconds | Seconds to wait before the next photo-change trigger is allowed. This is the interval between repeated button presses. |
| Frames | Frames connected to this Group. Only Frames in Groups managed by RemotePhotoManager are active. The order here decides the order photos are taken from the gallery. |

## Events

| Event | Description |
|---|---|
| TriggerRandom() | Triggers a random photo change. Valid only in Random mode. |
| TriggerPrevious() | Moves to the previous page. Valid only in sequence / reverse sequence modes. |
| TriggerNext() | Moves to the next page. Valid only in sequence / reverse sequence modes. |

---
title: RemotePhotoGroup
---
# RemotePhotoGroup

![512](Pasted%20image%2020260507002012.png)

RemotePhotoGroup은 각 Group의 상호작용 권한, 버튼 쿨다운, 연결할 Frame을 설정합니다.

## 파라미터

| 파라미터 | 설명 |
|---|---|
| Permission Mode (권한 모드) | 이 Group과 상호작용할 수 있는 사용자를 설정합니다. `Everyone`, `Owner Only`, `Master Only` 중 선택합니다. 대부분의 경우 `Everyone`을 사용합니다. |
| Trigger Cooldown Seconds (트리거 쿨다운 초) | 사진 변경 이벤트 후 다음 트리거가 가능해질 때까지의 초 단위 시간입니다. 연속 버튼 클릭 간격으로 볼 수 있습니다. |
| Frames (프레임) | 이 Group에 연결할 Frame을 관리합니다. RemotePhotoManager가 관리하는 Group 안의 Frame만 활성화됩니다. 이 순서가 갤러리에서 사진을 가져오는 순서가 됩니다. |

## 이벤트

| 이벤트 | 설명 |
|---|---|
| TriggerRandom() | 랜덤 사진 변경을 실행합니다. Random 모드에서만 유효합니다. |
| TriggerPrevious() | 이전 페이지로 이동합니다. Sequence / Reverse Sequence 모드에서만 유효합니다. |
| TriggerNext() | 다음 페이지로 이동합니다. Sequence / Reverse Sequence 모드에서만 유효합니다. |

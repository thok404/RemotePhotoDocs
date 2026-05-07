---
title: RemotePhotoManager
---
# RemotePhotoManager

![446](../../assets/Pasted%20image%2020260507000125.png)

RemotePhotoManager는 전체 시스템 동작을 관리합니다. 갤러리 JSON 가져오기, 재생 모드, 로딩 모드, Group 연결을 설정합니다.

> 한 씬에는 RemotePhotoManager가 하나만 있어야 합니다.

## 파라미터

| 파라미터 | 설명 |
|---|---|
| Language (언어) | 컴포넌트의 에디터 표시 언어를 바꿉니다. |
| Gallery Config JSON (갤러리 설정 JSON) | 웹 도구에서 만든 JSON을 가져와 갤러리를 생성합니다. 갤러리는 Landscape / Portrait 방향별로 나뉘며, 해당 방향의 Frame에서 사용됩니다. |
| Play Mode (재생 모드) | 갤러리 안의 사진 순서를 바꿉니다. Random / Sequence Forward / Sequence Reverse 중 전체에서 하나만 사용합니다. |
| Loading Mode (로딩 모드) | Preload와 NonPreload를 전환합니다. |
| Load Once On Start (시작 시 한 번 로드) | 인스턴스가 시작될 때 관리 중인 모든 Frame에 사진을 자동으로 로드합니다. |
| Load Once Delay Seconds (1회 로드 지연 초) | 인스턴스 시작 후 `Load Once On Start`를 실행하기 전까지의 지연 시간입니다. |
| Retry Attempts (재시도 횟수) | 이미지 로드 실패 시 최대 재시도 횟수입니다. |
| Retry Delay Seconds (재시도 간격 초) | 이미지 로드 실패 후 다시 시도하기까지의 간격입니다. |
| Debug Logs (디버그 로그) | 디버그 로그를 출력합니다. |
| Managed Groups (관리 그룹) | 씬 안의 Group을 관리합니다. 여기에 추가된 Group만 활성화됩니다. |

## Preload Only

| 파라미터 | 설명 |
|---|---|
| Landscape Cache Size (가로 캐시 수) | Preload 캐시가 유지할 Landscape 사진 수입니다. |
| Portrait Cache Size (세로 캐시 수) | Preload 캐시가 유지할 Portrait 사진 수입니다. |

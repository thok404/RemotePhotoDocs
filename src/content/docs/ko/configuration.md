---
title: 설정
---
## 핵심 구조

RemotePhotoSystem은 네 종류의 컴포넌트로 구성됩니다:

| 컴포넌트 | 기능 |
| -------------------- | ------------------------ |
| `RemotePhotoManager` | 갤러리, 재생 모드, 로딩 모드, 프리로드 캐시, 관리 그룹을 관리 |
| `RemotePhotoGroup` | 프레임 그룹을 관리하고 사진 변경 이벤트를 제공 |
| `RemotePhotoFrame` | 메시 머티리얼에 원격 이미지를 표시 |
| `RemotePhotoButton` | 버튼 동작을 Group 이벤트로 전달 |

RemotePhotoSystem은 사진을 월드 파일에서 원격 URL로 옮기지만, 런타임에서는 여전히 다운로드, Texture, VRAM, 머티리얼 인스턴스, draw call, 동기화 비용을 지불해야 합니다.



## 1. Manager

한 씬에는 `RemotePhotoManager`를 하나만 사용합니다. 여러 Manager는 테스트되지 않았으며 치명적인 bug를 일으킬 수 있습니다.

`RemotePhotoManager`는 갤러리, 재생, 로딩, Group 순서, Shader 검사를 통합 관리합니다.

| 기능 | 설명 |
| -------------------------- | ----------------------------- |
| `Language` | 이 프로젝트의 Inspector 문구 언어를 전환하며, 게임 내 표시에는 영향을 주지 않습니다 |
| `Gallery Config JSON` | WebTool이 내보낸 갤러리 JSON을 받습니다 |
| `Import JSON Into Gallery` | JSON을 런타임 URL 배열로 Bake합니다 |
| `Play Mode` | Group이 트리거될 때의 이미지 선택 방식을 제어합니다 |
| `Loading Mode` | 이미지가 프리로드 캐시에 들어갈지 제어합니다 |
| `Load Once On Start` | 월드 시작 후 모든 관리 Group을 한 번 자동 트리거합니다 |
| `Managed Groups` | Manager가 관리하는 Group 목록 |

Unity는 메모리 절약을 위해 `url`과 `orientation`만 기록합니다. JSON 안의 `id`, `tags`, `note`, `metadata`는 WebTool이 갤러리 관리를 쉽게 하기 위해 읽습니다.

더 큰 갤러리를 만들면 주로 JSON Bake 후의 배열, Unity 직렬화 데이터, 유지 관리 비용이 증가합니다.

현재 표시 중인 이미지와 `Preload`에 캐시된 이미지가 가장 큰 성능 비용을 사용합니다.

## 2. Gallery

| WebTool 기능 | 설명 |
| ------------- | ------------------------------------ |
| URL 가져오기 | 소량 수동 입력 또는 대량 URL 일괄 입력을 받습니다 |
| 태그 / 메모 | 갤러리 유지 관리에만 사용되며 런타임 배열에는 들어가지 않습니다 |
| 이미지 크기 탐지 | `Landscape` / `Portrait` 판단을 보조할 수 있습니다 |
| Unity JSON 내보내기 | Manager의 `Gallery Config JSON`에서 사용합니다 |

WebTool 상세 설명은 여기에서 볼 수 있습니다.

이미지 URL은 VRChat 이미지 로딩 요구사항을 충족해야 합니다. 관련 제한은 공식 문서를 참조하세요:  
https://creators.vrchat.com/worlds/udon/image-loading/

개인 이미지 호스팅 관련 내용은 여기에서 자세히 볼 수 있습니다.

각 Frame은 해당 방향의 갤러리에서만 이미지를 가져옵니다:

| Frame 방향 | 사용하는 갤러리 |
|---|---|
| `Landscape` | 가로 이미지 갤러리 |
| `Portrait` | 세로 이미지 갤러리 |

세로 프레임을 가로 이미지 회전으로 해결하려고 하지 마세요. 갤러리의 세로 이미지는 `Portrait`로 표시해야 하며, Frame도 `Portrait`로 설정해야 합니다.

Landscape 프레임을 Portrait 프레임으로 바꿀 때는 올바른 이미지 방향을 얻기 위해 **프레임 오브젝트를 반시계 방향으로 90° 회전**하세요.

어떤 방향의 갤러리가 비어 있으면, 해당 방향의 Frame에는 사용할 수 있는 이미지가 없습니다.

## 3. Playback

`Play Mode`는 Group이 트리거될 때 URL을 어떻게 선택할지 결정합니다.

| 모드 | 기능 | 사용 가능한 이벤트 |
| ------------------------------------- | --------------------------------- | ------------------------------------- |
| `Random` | Group 안의 Frame에 이미지를 랜덤으로 할당하며, 같은 배치의 같은 방향에서는 가능한 한 중복을 피합니다 | `TriggerRandom()` |
| `SequenceForward`/  `SequenceReverse` | 갤러리를 정방향/역방향으로 페이지 넘김합니다 | `TriggerPrevious()` / `TriggerNext()` |

랜덤 모드와 순서 모드는 서로 배타적입니다.

순서 모드에서 가로 Frame은 Landscape 큐만 진행하고, 세로 Frame은 Portrait 큐만 진행합니다. 하나의 Group은 가로/세로 Frame을 섞을 수 있습니다.

## 4. Loading

`Loading Mode`는 이미지 다운로드 경로를 제어합니다.

| 모드 | 기능 |
| ------------ | -------------------------- |
| `NonPreload` | 이미지가 필요할 때 직접 다운로드하며, 프리로드 캐시를 유지하지 않습니다 |
| `Preload` | 일부 이미지를 미리 캐시에 다운로드하며, 로딩 시 캐시에 있으면 더 빠르게 표시할 수 있습니다 |

`Preload`는 메모리, VRAM, 다운로드 큐를 표시 속도와 교환합니다. 캐시가 클수록 런타임 리소스 사용량이 높아집니다.

`NonPreload`는 캐시를 유지하지 않으며, 표시되는 이미지 수와 해상도만 성능에 영향을 줍니다


대략적인 Texture 비용:

| 해상도 | RGBA 텍스처 대략 사용량 |
|---|---|
| 1024 x 1024 | 약 4 MB |
| 2048 x 2048 | 약 16 MB |
| 4096 x 4096 | 약 64 MB |

초대형 이미지와 큰 캐시가 겹치면 메모리와 VRAM 압력이 빠르게 커집니다. Android 쪽 위험이 더 높습니다.


`Load Once On Start`를 켜면 `Load Once Delay Seconds` 후 `Managed Groups` 순서대로 모든 관리 Group을 한 번 트리거합니다.

`Retry Attempts`와 `Retry Delay Seconds`는 다운로드 실패 재시도에 대한 전역 설정입니다.

## 5. Groups

`RemotePhotoGroup`은 독립적으로 새로고침할 수 있는 프레임 영역을 계획합니다.

| 기능 | 설명 |
|---|---|
| `Permission Mode` | 누가 이 Group을 트리거할 수 있는지 제어합니다 |
| `Trigger Cooldown Seconds` | 성공 트리거 사이의 최소 간격을 제한합니다 |
| `Frames` | 이 Group이 제어하는 Frame 목록 |

Group과 Frame은 모두 상위 관리 목록의 순서에 따라 URL을 가져와 이미지를 로드합니다.

버튼 하나를 클릭했을 때 플레이어 현재 위치에서 보이지 않는 프레임까지 새로고침된다면 낭비입니다. 결국 VRChat은 5초마다 최대 한 장의 이미지만 로드하도록 허용하므로, 영역별로 Group을 나누는 것은 좋은 선택입니다.

여러 플레이어가 연속으로 트리거하면 동기화 상태와 다운로드 큐 압력이 증가합니다. 쿨다운 시간은 성공 트리거 빈도를 제한하는 데 사용되며, 5초는 좋은 선택입니다.

## 6. Frames

`RemotePhotoFrame`은 원격 이미지를 현재 오브젝트의 `MeshRenderer` 머티리얼에 쓰는 역할을 합니다.

| 기능 | 설명 |
|---|---|
| `Orientation` | Frame이 Landscape 또는 Portrait 갤러리 중 무엇을 사용할지 결정합니다 |
| `Material Slot` | 어느 머티리얼 슬롯에 쓸지 지정합니다 |
| `Texture Property` | 어느 텍스처 속성에 쓸지 지정하며, 프로젝트 전용 Shader는 보통 `_MainTex`를 유지합니다 |
| `Default Texture` | 시작 시 표시되는 기본 텍스처 |
| `Use Fallback Texture` | 로딩 실패 시 Fallback을 표시할지 제어합니다 |
| `Fallback Texture` | 로딩 실패 시 표시되는 폴백 텍스처 |
| `Background Color` | `Contain` 여백과 `Box` 측면의 채움 색 |

`Use Fallback Texture`를 끄면 로딩 실패가 현재 화면을 덮어쓰지 않습니다. 켜면 로딩 실패 시 `Fallback Texture`를 표시합니다.

### 이미지 맞춤

| `Photo Fit Mode` | 작용 |
| ---------------- | -------------------------------- |
| `Crop` | 프레임 비율에 맞춰 이미지를 잘라 화면이 프레임을 채우게 합니다 |
| `Contain` | 전체 이미지를 유지하고, 빈 영역은 `Background Color`를 사용합니다 |
| `Stretch` | 이미지를 프레임 비율로 직접 늘립니다 |
| `Tile` | 이미지를 반복 타일링합니다 |

### 투사 방식

| `Projection Mode` | 작용 |
| ----------------- | ----------------------------------------- |
| `Mesh UV` | 모델 자체 UV를 사용해 이미지를 표시합니다 |
| `Box` | 가장 짧은 변을 두께로 보고 앞/뒤 면에 이미지를 투사하며, 측면은 `Background Color`를 사용합니다 |

`Horizontal Flip`은 `Box`에만 작용하며, Box 투사 결과를 수평 반전하는 데 사용됩니다.

### 비율과 회전

| 기능 | 설명 |
|---|---|
| `Manual` | `Manual Aspect Ratio`를 고정 가로세로비로 사용합니다 |
| `Auto` | 현재 메시를 기준으로 가로세로비를 자동 계산합니다 |
| `Reference Box` | 사용자 지정 Reference Box로 가로세로비를 계산합니다 |
| `Photo Rotation Offset` | 최종 이미지 표시 결과에 회전 보정을 추가하며, `Mesh UV`와 `Box`를 지원합니다 |

## 7. Shader

사진 표시 머티리얼은 프로젝트 전용 Shader를 사용해야 합니다:

| Shader | 용도 |
| --------------------------------------------- | ------------------------ |
| `RemotePhotoSystem/Photo Frame Display Unlit` | 씬 조명을 계산하지 않고 화면처럼 표시하며, 성능에 유리합니다 |
| `RemotePhotoSystem/Photo Frame Display Lit` | 씬 조명을 계산해 환경에 더 잘 어울리며, drawcall이 더 많습니다 |

각 `RemotePhotoFrame`은 런타임에서 서로 다른 이미지를 표시하기 위해 독립 머티리얼 인스턴스가 필요합니다.

프레임 수가 늘어나면 Drawcall이 증가합니다

Manager는 `Managed Groups -> Frames`가 포함하는 프레임을 스캔합니다. 프레임 머티리얼이 프로젝트 전용 Shader를 사용하지 않으면 Inspector에 경고가 표시됩니다.

경고 영역은 두 개의 빠른 설정 버튼을 제공합니다
이 두 버튼은 현재 Manager가 `Managed Groups`를 통해 연결한 Frame 머티리얼만 처리합니다.

## 8. Buttons

`RemotePhotoButton`은 `Button Action`을 대상 Group 이벤트에 매핑합니다.

| `Button Action` | 호출 이벤트 | 사용 가능한 재생 모드 |
|---|---|---|
| `Random` | `TriggerRandom()` | `Random` |
| `Previous` | `TriggerPrevious()` | `SequenceForward` / `SequenceReverse` |
| `Next` | `TriggerNext()` | `SequenceForward` / `SequenceReverse` |

외부 VRC 버튼, 스위치, 메뉴, 트리거 에셋은 `RemotePhotoGroup`의 공개 이벤트에 직접 연결할 수 있습니다:

| 조작 | 이벤트 |
|---|---|
| 랜덤 사진 변경 | `TriggerRandom()` |
| 이전 페이지로 | `TriggerPrevious()` |
| 다음 페이지로 | `TriggerNext()` |

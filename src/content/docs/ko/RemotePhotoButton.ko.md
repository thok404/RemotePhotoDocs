---
title: RemotePhotoButton
---
# RemotePhotoButton

![562](../../assets/images/Pasted-image-20260507120138.png)

RemotePhotoButton은 프리팹 버튼용 컴포넌트입니다.

> 외부 버튼 에셋을 사용하는 경우 이 컴포넌트 대신 RemotePhotoGroup의 `TriggerRandom()`, `TriggerPrevious()`, `TriggerNext()` 이벤트로 세 종류의 버튼을 만드세요.

그래도 이 컴포넌트를 사용하여 버튼을 직접 만들고 싶다면 `TriggerSelectedAction()` 이벤트를 호출합니다.예를 들어 Button 컴포넌트의 On Click에서 이 컴포넌트를 참조하고, `UdonBehaviour.SendCustomEvent`를 `TriggerSelectedAction`으로 설정합니다.

![564](../../assets/images/Pasted-image-20260507121858.png)

## 파라미터

| 파라미터 | 설명 |
|---|---|
| Remote Photo Group (Remote Photo Group) | 이 버튼이 작동할 Group을 넣습니다. RemotePhotoGroup 컴포넌트가 있는 GameObject를 지정합니다. |
| Button Action (버튼 동작) | 이 버튼이 트리거할 이벤트를 선택합니다. |

## Button Action

| 옵션 | 설명 |
|---|---|
| Random | Group의 `TriggerRandom()` 이벤트를 실행합니다. 랜덤 버튼에 사용합니다. |
| Previous | Group의 `TriggerPrevious()` 이벤트를 실행합니다. 이전 페이지 버튼에 사용합니다. |
| Next | Group의 `TriggerNext()` 이벤트를 실행합니다. 다음 페이지 버튼에 사용합니다. |

## 이벤트

| 이벤트 | 설명 |
|---|---|
| TriggerSelectedAction() | `Button Action`의 세 가지 내장 이벤트를 연결합니다. |

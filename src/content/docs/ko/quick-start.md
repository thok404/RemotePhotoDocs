---
title: 빠른 시작
---

# 빠른 시작

빠른 시작은 한 가지만 합니다: **먼저 랜덤 사진 버튼이 씬에서 원격 이미지를 성공적으로 로드하게 만들기**.

여기서는 원리를 많이 설명하지 않습니다. 먼저 단계대로 끝내고, 정상 실행을 확인한 뒤 다른 내용을 다시 읽으면 됩니다.

## 0. 환경 요구 사항

해상도<=2048 x 2048인 이미지 직접 링크 여러 장을 준비합니다. 직접 링크는 보통 `.jpg`, `.png`, `.gif`, `.webp` 같은 이미지 형식으로 끝납니다. 더 자세한 이미지 요구 사항은 VRChat 공식 문서를 참고하세요 https://creators.vrchat.com/worlds/udon/image-loading/

더 나은 네트워크 전송, 저장, 게임 성능 경험을 위해 jpg 형식과 1024 정도 해상도의 이미지를 사용하는 것을 권장합니다

웹에서 이미지 직접 링크를 검색해 얻을 수도 있고, 자신의 이미지를 이미지 호스팅에 업로드해 직접 링크를 얻을 수도 있으며, GitHub 저장소나 CloudFlareR2를 사용해 장기적으로 안정적인 개인 이미지 호스팅을 만들 수도 있습니다. 개인 이미지 호스팅에 대해서는 여기를 클릭해 자세히 알아볼 수 있습니다.


가능하면 다음 버전 이상을 사용하세요:

| 의존성 | 버전 |
| ------------------- | ------------- |
| Unity | `2022.3.22f1` |
| VRChat SDK - Worlds | `3.10.3` 이상 |
| VRChat SDK - Base | `3.10.3` 이상 |

> 더 낮은 버전의 환경에서도 실행될 수는 있지만, 치명적인 오류가 있을 수 있습니다.

## 1. RemotePhotoSystem 가져오기

`RemotePhotoSystem`의 `unitypackage`를 Unity 프로젝트로 가져옵니다.

![](../../../assets/images/Pasted%20image%2020260508212908.png)

## 2. 프레임과 버튼 배치

`Prefab` 폴더에서 프레임과 버튼 프리팹을 찾아 씬으로 드래그합니다.

이 튜토리얼은 랜덤 버튼 하나만 시연합니다. 랜덤 모드와 순서 페이지 모드를 같은 Manager 안에서 섞어 쓰지 마세요.

![](../../../assets/images/Pasted%20image%2020260508213732.png)

## 3. Manager 만들기

`Hierarchy` 빈 공간에서 우클릭하고 다음을 선택합니다:

`Remote Photo System -> Create Manager`

그러면 씬에 `RemotePhotoManager` 컴포넌트가 있는 오브젝트가 생성됩니다.

![236](../../../assets/images/Pasted%20image%2020260508214533.png)

## 4. WebTool로 갤러리 JSON 만들기

프로젝트의 `WebTool` 폴더를 열고 브라우저로 `index.html`을 엽니다.

이미지 직접 링크를 `Bulk URL Import`에 붙여넣습니다. 한 줄에 URL 하나씩 넣은 뒤 `Import Pasted URLs`를 클릭합니다.

![](../../../assets/images/Pasted%20image%2020260508215209.png)

## 5. Landscape / Portrait 자동 인식

웹페이지를 아래로 스크롤하고 `Probe Scope`를 `Missing Metadata`로 설정한 뒤 `Probe Image Sizes`를 클릭합니다.

웹 도구가 이미지 크기를 읽으려고 시도하고 `Orientation`을 자동으로 입력합니다.

![](../../../assets/images/Pasted%20image%2020260508215426.png)

> 일부 이미지가 자동으로 인식되지 않으면, 수동으로 `Landscape` 또는 `Portrait`로 설정하면 됩니다.

## 6. Unity JSON 내보내기

이미지 목록에 문제가 없는지 확인한 뒤, 페이지 상단으로 돌아가 오른쪽 위의 `Export Unity JSON`을 클릭합니다.

브라우저가 갤러리 설정 파일을 다운로드합니다. 이 JSON 파일을 Unity 프로젝트의 `Assets` 디렉터리 안 원하는 위치에 넣습니다.

![](../../../assets/images/Pasted%20image%2020260508215653.png)

## 7. Manager로 갤러리 가져오기

Unity로 돌아가 3단계에서 만든 Manager를 선택합니다.

방금 내보낸 JSON 파일을 `Gallery Config JSON`으로 드래그한 뒤 다음을 클릭합니다:

`Import JSON Into Gallery`

아래의 `Total photos`가 가져온 이미지 수로 바뀌면 갤러리 가져오기가 성공한 것입니다.

![](../../../assets/images/Pasted%20image%2020260508220510.png)

## 8. Group 만들기

Manager Inspector 아래쪽에서 `Managed Groups`를 찾아 다음을 클릭합니다:

`Add Group`

시스템이 Manager 아래에 새 자식 오브젝트를 만들고 자동으로 `RemotePhotoGroup`을 붙입니다.

![](../../../assets/images/Pasted%20image%2020260508220830.png)

## 9. 프레임을 Group에 추가

프레임 프리팹 계층을 펼치고 실제로 사진을 표시하는 `Photo` 자식 오브젝트를 찾습니다.

방금 만든 Group을 선택하고, 이 `Photo` 자식 오브젝트들을 Group의 `Frames` 목록으로 드래그합니다.

> `Frames`의 순서가 사진 할당과 로딩 순서입니다. 처음에는 씬에서 왼쪽에서 오른쪽, 가까운 곳에서 먼 곳 같은 직관적인 순서로 넣으면 됩니다.

![](../../../assets/images/Pasted%20image%2020260508221218.png)

## 10. 버튼 연결

버튼 오브젝트를 선택하고, 방금 만든 Group을 버튼 컴포넌트의 `Remote Photo Group`으로 드래그합니다.

그 다음 `Button Action`이 다음으로 설정되어 있는지 확인합니다:

`Random`

![](../../../assets/images/Pasted%20image%2020260508221624.png)

## 11. 실행 테스트

Play Mode에 들어가 버튼을 클릭합니다.

설정이 올바르면 프레임이 원격 이미지를 로드하기 시작합니다.

![](../../../assets/images/Pasted%20image%2020260508222815.png)


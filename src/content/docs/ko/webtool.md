---
title: 웹 도구
---
WebTool은 로컬 정적 갤러리 관리자입니다. 이미지 URL 데이터를 관리하고 Unity가 가져올 수 있는 갤러리 JSON을 내보냅니다.

## 데이터 범위

WebTool은 완전한 갤러리 항목을 관리합니다:

| 필드 | 용도 |
|---|---|
| `id` | 항목 식별 이름 |
| `url` | 이미지 직접 링크 |
| `orientation` | `Landscape` / `Portrait` 분류 |
| `tags` | 태그 |
| `note` | 메모 |
| `metadata` | 이미지 탐지 결과 |

Unity Bake는 `url`과 `orientation`만 읽습니다. 다른 필드는 WebTool에서 사용합니다.

## 가져오기

WebTool은 세 가지 데이터 입력을 지원합니다:

| 입력 | 내용 |
|---|---|
| `Import JSON` | 기존 갤러리 JSON 읽기 |
| `Import URL TXT` | 한 줄에 URL 하나인 텍스트 파일 읽기 |
| `Bulk URL Import` | 여러 줄 URL 붙여넣기 |

`Default Orientation`은 일괄 가져오기 시 초기 방향으로 사용됩니다.

## 편집

테이블은 항목 단위 편집을 제공합니다:

| 항목 | 내용 |
|---|---|
| URL | 이미지 주소 |
| Orientation | 가로 이미지 / 세로 이미지 분류 |
| Tags | 태그 텍스트 |
| Note | 메모 텍스트 |
| Metadata | 탐지 상태와 크기 정보 |

`Add Blank Entry`는 빈 항목을 만들 때 사용합니다.

## 필터와 페이지

| 컨트롤 | 작용 |
|---|---|
| `Search` | URL, ID, 태그, 메모 검색 |
| `Orientation` | 가로 이미지 / 세로 이미지로 필터 |
| `Metadata` | 탐지 상태로 필터 |
| `Page Size` | 페이지당 표시 수 설정 |

상단 통계는 총수, 가로 이미지 수, 세로 이미지 수, 잘못된 URL 수, 선택 수, Metadata OK 수를 표시합니다.

## 일괄 작업

| 작업 | 결과 |
| -------------------------- | -------------------- |
| `Select Page` | 현재 페이지 선택 |
| `Select Filtered` | 현재 필터 결과 선택 |
| `Clear Selection` | 선택 비우기 |
| `Set Selected Landscape` | 선택 항목을 `Landscape`로 표시 |
| `Set Selected Portrait` | 선택 항목을 `Portrait`로 표시 |
| `Generate IDs` | URL 파일명으로 ID 생성 |
| `Remove Duplicate URLs` | 중복 URL 삭제 |
| `Delete Selected` | 선택 항목 삭제 |
| `Add Tag To Selected` | 선택 항목에 태그 추가 |
| `Remove Tag From Selected` | 선택 항목에서 태그 제거 |

## 이미지 크기 탐지

`Probe Image Sizes`는 브라우저가 이미지를 로드하고 너비와 높이를 읽게 합니다.

탐지가 성공하면 `metadata`가 크기와 상태를 기록합니다. `Apply Detected Orientation`이 켜져 있으면, 도구가 너비와 높이에 따라 방향을 씁니다:
너비>=높이    `Landscape`
높이>너비    `Portrait`


`Probe Scope`는 탐지 범위를 제어합니다:

| 범위 | 내용 |
| ------------------ | --------------- |
| `Selected` | 선택된 항목 |
| `Filtered` | 현재 필터 결과 |
| `Missing Metadata` | metadata가 없는 항목 |
| `All` | 전체 항목 |

## 로컬 캐시

이미지 탐지 결과는 브라우저 `IndexedDB`에 캐시되며, 캐시 키는 이미지 URL입니다.

일반 탐지는 캐시에 적중하면 이미지를 다시 읽지 않습니다. `Force Refresh`는 캐시를 무시하고 다시 탐지합니다.

## 내보내기

`Export Unity JSON`은 Unity가 사용하는 갤러리 설정 파일을 출력합니다.

내보낸 JSON은 WebTool에 다시 가져올 수 있고, `RemotePhotoManager`에 넘겨 `Import JSON Into Gallery`를 실행할 수도 있습니다.


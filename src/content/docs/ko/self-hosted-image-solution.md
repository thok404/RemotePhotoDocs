---
title: 셀프 호스팅 이미지 솔루션
---
## 셀프 호스팅 이미지를 사용하는 이유

**이미지 직접 링크**를 얻는 방법은 많습니다. 가장 흔한 것은 **이미지 호스팅 서비스 플랫폼**입니다. 편리하고, 성숙한 app이 있으며, 이미지를 주면 URL을 줍니다. 하지만 그들은 당신의 이미지를 심사할 수도 있고, 당신의 이미지를 유출할 수도 있고, 당신의 이미지를 임의로 삭제할 수도 있습니다. 이유는 이런 방식으로 호스팅된 이미지는 당신 자신의 이미지에 대해 더 큰 통제권을 가지지 못하기 때문입니다. **Cloudflare R2, AWS S3**처럼 유명 클라우드 서비스 업체가 제공하는 클라우드 스토리지를 사용해 직접 이미지 호스팅 서비스를 구축하면, 서버부터 클라이언트까지 자기 이미지에 대한 **전체 경로 제어**를 얻을 수 있습니다. VRC 앨범 입장에서는, 그들이 제공하는 **무료 플랜**만으로도 사용 요구를 충족할 수 있습니다.

이어서 **CloudFlareR2**라는 한 가지 방법만 소개합니다. 이것은 저도 직접 사용하는 방법입니다.

## 1. 도메인과 R2 접근 방식

이 방법을 사용할 때는 **자기 도메인**을 하나 가지고 있는 것이 가장 좋습니다. 가장 직접적인 장점은 이미지 로딩이 **안정적이고 빠르게** 변한다는 점이며, 일부 네트워크 제한 지역의 플레이어도 당신의 이미지를 볼 기회가 생길 수 있습니다. 물론 R2가 제공하는 개발 테스트 도메인을 사용해도 **RemotePhotoSystem** 방식은 성공적으로 실행될 수 있습니다.

CloudFlare의 공개 **R2 버킷** 문서는 **커스텀 도메인**의 장점을 설명합니다:
https://developers.cloudflare.com/r2/buckets/public-buckets/

| 비교 항목 | `r2.dev` 테스트 도메인 | 커스텀 도메인 |
| ----- | ---------------------------------------------------------- | -------------------------------------- |
| 위치 | 개발 / 테스트 환경 | 정식 프로덕션 환경 |
| 도메인 | 무작위로 할당된 난수 같은 도메인 | `example.com`처럼 일반적인 웹사이트 같은 도메인 |
| 속도 제한 | rate limit이 있으며, 초과하면 일시적으로 throttled 될 수 있고 `429 Too Many Requests`가 반환될 수 있습니다 | 이 속도 제한 규칙이 적용되지 않으며, 커스텀 도메인은 CloudFlare 플랜이 제공하는 우수한 서비스를 사용합니다 |
| 캐시 | 지원하지 않음 | Cloudflare Cache를 지원하여 R2 접근을 가속 |
| CDN 가속 | 지원하지 않음 | CDN 가속을 지원하며 전 세계 접근 가능 |
| 보안 | 매우 약하고 커스터마이즈할 수 없음 | CloudFlare의 DDoS 방어, 악용 방지, AI 크롤러 제어 등 여러 보안 조치를 사용 |

도메인을 얻는 방법은 **CloudFlare**에서 직접 구매할 수도 있고, 다른 도메인 서비스 업체에서 구매할 수도 있습니다. 제 사례에서는 **NameSilo**에서 .top 도메인을 1년 $1.88에 구매했고, 이 도메인 갱신에는 매년 $4.88이 필요합니다.

![image-01](../../../assets/images/Pasted%20image%2020260512034510.png)

도메인이 생기면 **CloudFlare 도메인 추가** 안내를 따라 도메인을 CF에 연결하고, 이후 CF가 도메인의 **DNS**를 완전히 관리하게 하며 보안 방어 등의 스위치를 설정합니다. 걱정하지 않아도 됩니다. CloudFlare가 추천 설정을 제안해 줍니다.

도메인을 구매하거나 도메인을 CloudFlare에 연결하는 과정에서 문제가 생기면, 동영상 사이트에서 관련 튜토리얼을 검색하세요. 이런 작업에는 성숙한 튜토리얼이 많습니다. 또는 CloudFlare와 도메인 서비스 업체의 도움말 문서를 확인하거나 AI에게 물어보세요.

과정에 익숙한 개발자가 읽을 수 있는 짧은 안내가 있습니다 https://imageport.app/en/docs/for-cloudflare-r2

![image-02](../../../assets/images/Pasted%20image%2020260512035732.png)

![image-03](../../../assets/images/Pasted%20image%2020260512040102.png)

## 2. R2 Bucket 만들기

드디어 R2 단계입니다. CloudFlare 사이드바에서 **R2 Object Storage**를 찾고 **Create Bucket**을 클릭합니다

이 bucket에 이름을 지정하고, **Location**이 당신의 VRC 월드의 주요 플레이어가 위치한 지역인지 확인합니다. 아니라면 수동으로 지정할 수 있습니다. **Default Storage Class**가 **Standard**를 사용하는지 확인한 뒤 **Create bucket**을 클릭합니다.

![image-04](../../../assets/images/Pasted%20image%2020260512041210.png)

## 3. 커스텀 도메인 연결 또는 r2.dev 활성화

축하합니다. **R2 Bucket**을 만들었습니다. 하지만 아직 이미지를 급히 업로드하지 마세요. **Settings**를 클릭합니다. 자기 도메인을 구매하고 연결했다면, **Custom Domains**의 **Add** 버튼을 클릭하고 CF의 안내에 따라 이 R2 Bucket에 도메인을 할당합니다. 도메인을 VRC 앨범에만 사용할 계획이 아니거나, 미래 개발을 위한 여지를 남기고 싶다면 R2에 **서브도메인**을 할당하세요.

- 서브도메인: xxxx.your-domian.com
- 메인 도메인: your-domian.com

![image-05](../../../assets/images/Pasted%20image%2020260512042038.png)

**Add** 상자에서 R2에 사용할 서브도메인만 지정하면 됩니다. 그림처럼 앞에 **photos**를 붙이면 서브도메인으로 판단됩니다. **Continue**를 클릭한 뒤 확인 화면에서 **Connect domain**을 클릭하고 잠시 기다리면, 이제 당신의 도메인으로 R2에 접근할 수 있을 것입니다.

먼저 R2의 개발 테스트 도메인을 사용하고 싶다면 **Public Development URL** 뒤의 **Enable**을 클릭해야 합니다. 이때 확인 창이 뜨며, 입력란에 **allow**를 입력하고 **Allow** 버튼을 클릭합니다. 그러면 **.r2.dev 도메인**을 얻었을 것입니다.

## 4. 이미지 관리 방식

이제 이미지를 업로드해야 합니다. 하지만 이미지를 업로드하기 전에, R2의 스토리지 버킷 이미지 관리 창은 아래 그림처럼 **순수 디렉터리 구조**이며, **이미지 시각화 조작 인터페이스**가 없다는 점을 알아야 합니다. 이미지 작업을 원활하게 관리하기 위해 저는 다음을 추천합니다:

![image-06](../../../assets/images/Pasted%20image%2020260512043123.png)

> **S3 Image Port** ——A dashboard to manage your images in S3 buckets. 

https://github.com/yy4382/s3-image-port

![image-07](../../../assets/images/Pasted%20image%2020260512043929.png)

**S3 Image Port**는 이런 직관적인 조작 인터페이스를 제공하고 R2와 직접 연결됩니다. S3 Image Port에서 이미지 **업로드/삭제**를 할 수 있으며, 업로드 전 **이미지 압축**도 지원해 저장 공간을 절약하고 네트워크 전송에도 유리합니다. 또한 **어떤 프로그램도 다운로드할 필요가 없습니다**. 이것은 **정적 프론트엔드 애플리케이션**이며, https://imageport.app/ 에 접속하면 바로 사용할 수 있습니다. 당신의 R2 자격 증명은 **브라우저 로컬**에 저장되거나, 암호화 동기화를 켜서 원격 Redis 서비스로 동기화할 수 있습니다. S3 Image Port 자체는 **이미지를 저장하지 않고, 이미지 배포를 담당하지 않으며, 완전히 백엔드가 없습니다**.

이 문서가 완성되기 전까지 S3 Image Port에는 아직 **URLs 일괄 복사 기능**이 추가되지 않았습니다. **RPS 웹 도구**와의 연결을 편하게 하기 위해 제 브랜치를 사용하는 것을 고려할 수 있습니다 https://github.com/thok404/s3-image-port/tree/feature/gallery-bulk-actions   **==이 브랜치에는 설정 파일 동기화 기능이 없습니다==**

**직접 사용할 수 있는 웹 애플리케이션:** https://imageport.thok.top/

간단한 S3 Image Port 공식 안내 문서를 볼 수도 있습니다 https://imageport.app/en/docs/for-cloudflare-r2

아래의 그림 튜토리얼도 볼 수 있습니다
## 5. R2 CORS 설정

![image-08](../../../assets/images/Pasted%20image%2020260512053314.png)

먼저 R2가 S3 Image Port에서 접근될 수 있도록 허용합니다. **R2 Settings** 페이지로 돌아가 **CORS Policy**를 찾고 **Add**를 클릭한 뒤, 팝업 코드 상자의 모든 내용을 지우고 다음으로 교체합니다:

```
[
  {
    "AllowedOrigins": ["https://imageport.thok.top"],
    "AllowedMethods": ["GET", "PUT", "DELETE", "HEAD", "POST"],
    "AllowedHeaders": ["*"]
  }
]
```

그런 다음 **Save**를 클릭합니다. 이렇게 하면 당신의 R2가 **imageport.thok.top**의 요청을 받을 수 있습니다. 원본 프로젝트의 main 브랜치를 사용하는 경우 아래 코드를 사용합니다.

```
[
  {
    "AllowedOrigins": ["https://imageport.app"],
    "AllowedMethods": ["GET", "PUT", "DELETE", "HEAD", "POST"],
    "AllowedHeaders": ["*"]
  }
]
```

## 6. R2 API Token 만들기

![image-09](../../../assets/images/Pasted%20image%2020260512054851.png)

R2의 **Overview** 패널로 돌아가 **Account Details → API Tokens → Manage**를 찾고, 필요에 따라 Account/User 토큰을 선택합니다. 사례에서는 **Create Account API token**을 클릭하는 방식으로 설명합니다.

![image-10](../../../assets/images/Pasted%20image%2020260512055610.png)

**Token name**을 정하고, Premissions는 **Object Read & Write**를 선택합니다. Specify bucket은 전체 bucket에 적용할 수도 있고, 지정한 것에만 적용할 수도 있습니다. TTL은 취향에 따라 설정하며, 이번 사례에서는 **Forever**를 사용합니다. Client IP Address Filtering은 비워 두고 **Create Account/User API Token**을 클릭합니다

> S3 Image Port 설정을 완료했거나 모든 Key를 기록하기 전에는 이 페이지를 닫지 마세요

![image-11](../../../assets/images/Pasted%20image%2020260512060331.png)

For security reasons, these token values will not be shown again. [Learn more about API token generation](https://developers.cloudflare.com/r2/api/s3/tokens/)

## 7. S3 Image Port 연결

이제 S3 Image Port의 **Settings → S3** 페이지로 들어갑니다

![image-12](../../../assets/images/341830310738fe6eb788056066702e83.png)

- **Endpoint**: 방금 API Token 페이지의 Use jurisdiction-specific endpoints for S3 clients: 링크를 입력
- **Bucket Name**: your-bucket-name
- **Region**: R2 Bucket → Settings → General → Location   또는 기본값 auto 사용

![image-13](../../../assets/images/Pasted%20image%2020260512061131.png)

- **Access Key**: API Token 페이지의 Access Key ID
- **Secret Key**: API Token 페이지의 Secret Access Key
- **Public URL**: R2에 연결된 Custom Domain 또는 Public Development URL. https://로 시작해야 한다는 점에 주의

그런 다음 **Test** 버튼을 클릭하고, **Valid**가 나타나면 설정이 완료됩니다

**S3 Image Port와 R2의 연결이 드디어 완료되었습니다**

이제 **Profiles** 페이지로 전환하고 **Rename**을 클릭해 이 설정 파일에 새 이름을 붙일 수 있습니다

![image-14](../../../assets/images/Pasted%20image%2020260512063206.png)

S3 Image Port의 브랜치를 전환하거나 다른 브라우저 장치 등을 사용하고 싶다면, 위의 연결 단계를 다시 실행할 필요가 없습니다. **Export**를 클릭해 JSON을 클립보드로 내보내고, 원하는 문서에 저장해 두면 됩니다. 다음에는 이 JSON을 클립보드에 복사한 뒤 Profiles 페이지 오른쪽 위의 **Import Profile**을 클릭하면 됩니다.

![image-15](../../../assets/images/Pasted%20image%2020260512063732.png)

## 8. 이미지 업로드 및 URL 복사

**Settings의 Upload 페이지**는 이미지를 업로드할 때의 몇 가지 동작을 규정합니다. 제 **Default Key template**에는 **{{filename}}**만 입력했습니다. 이것은 업로드되는 이미지의 기본 이름 템플릿이 파일명만이라는 뜻입니다. 즉 업로드 후 이미지 이름이 로컬 이미지 이름과 같습니다. 설명이 조금 장황하지만, 이미지 몇 장을 업로드하고 경로를 보면 이해할 수 있습니다. 위의 docs 링크는 각 Key의 사용법을 설명합니다

**Image convertion and compression**은 포맷 변환과 이미지 압축을 할 수 있습니다. 네트워크 이미지 전송 요구(**VRC RemotePhotoSystem**)에는 **JPEG 형식을 사용하고 압축하는 것**을 권장합니다

내비게이션의 **Upload**를 클릭해 이미지 몇 장을 업로드하고, **Gallery**로 돌아가 새로고침을 몇 번 하면, R2에 있는 이미지가 눈앞에 나타나는 것을 볼 수 있을 것입니다.

이제 직관적으로 조작할 수 있습니다. 왼쪽 위에는 **전체 선택 버튼**이 있고, 이미지를 선택하면 **전체 선택 취소, 선택한 URLs 복사, 선택한 이미지 삭제**가 나타납니다(이것은 R2 Bucket 안의 이미지를 삭제합니다). 왼쪽 아래에서는 페이지당 20, 50, 100장을 표시하도록 전환할 수 있고, 이미지를 더블클릭하면 단일 이미지 보기로 들어갈 수 있습니다.

**전체 선택+선택한 URLs 복사 기능**을 사용하면 [RemotePhotoSystemWebtool](webtool.md)에 빠르게 연결할 수 있으며, 이것이 우리가 그것을 사용하는 이유입니다.

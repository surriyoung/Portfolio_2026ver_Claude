# data/projects.json 작성법
프로젝트 1건 = 객체 1개. 필수: id, name, type, cat(p=퍼블리싱 / a=앱개발). 나머지는 선택입니다.

{ "id":"bridalmay", "name":"브리달메이", "type":"그누보드 퍼블리싱", "cat":"p",
  "role":"D100 P100",            // D=디자인 P=퍼블리싱 A=앱개발 + 기여도%
  "desc":"프로젝트 설명",
  "link":"https://...",          // 바로가기 링크
  "fonts":["Pretendard"], "colors":["#111111","#ffffff"],
  "stack":["HTML","CSS"],        // 생략하면 유형/기여도로 자동 생성
  "featured":1,                  // 숫자 = 메인 슬라이더 노출 순서
  "hidden":1 }                   // 1 이면 전 페이지 비공개

## 이미지 (파일만 넣으면 자동 적용 (webp 권장. 다른 확장자는 아래처럼 경로 지정))
- 썸네일          assets/projects/{id}.webp
- 메인 화면 1920x1080  assets/projects/{id}/main.webp
- 메인 디자인 전체    assets/projects/{id}/full.webp
- 서브 디자인 1, 2    assets/projects/{id}/sub1.webp, sub2.webp
경로를 바꾸고 싶으면 "images":{"main":"...","full":"...","sub1":"...","sub2":"..."}, "thumbnail":"..." 로 지정.

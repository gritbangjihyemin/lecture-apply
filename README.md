# 그릿마인드랩 강의 신청 사이트

- 신청 페이지: https://gritbangjihyemin.github.io/lecture-apply/ (강의별 링크: `?id=강의ID`)
- 관리자 페이지: https://gritbangjihyemin.github.io/lecture-apply/admin.html (gritbangjihye@gmail.com 구글 로그인)
- Firebase 프로젝트: lecture-apply (Firestore 서울 리전, Google 로그인)

| 파일 | 역할 |
|---|---|
| `index.html` | 신청자 페이지 |
| `admin.html` | 관리자 페이지 (강의 등록·할인·링크 복사·신청자 관리·CSV) |
| `style.css` | 디자인 |
| `firebase-config.js` | Firebase 연결 정보, 기본 카드결제 링크, 기본 환불규정, 할인 계산 |
| `firestore.rules` | 보안 규칙 (Firebase 콘솔 > Firestore > 규칙에 게시된 내용과 동일) |

관리자를 추가하려면 `firebase-config.js`의 `ADMIN_EMAILS`와 `firestore.rules`의 이메일 목록에 함께 추가하고 규칙을 다시 게시하세요.

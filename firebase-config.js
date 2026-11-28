// Firebase 프로젝트: lecture-apply
export const firebaseConfig = {
  apiKey: "AIzaSyA7pYWhsKzGU_bGOjsoV-c13qsEqwXJbH8",
  authDomain: "lecture-apply.firebaseapp.com",
  projectId: "lecture-apply",
  storageBucket: "lecture-apply.firebasestorage.app",
  messagingSenderId: "936746456644",
  appId: "1:936746456644:web:63746630145b7baef98e11"
};

// ▼ 관리자 구글 계정 (firestore.rules 의 이메일과 같아야 합니다)
export const ADMIN_EMAILS = ["gritbangjihye@gmail.com"];

// ▼ 사이트 상단·안내문에 표시되는 기관 정보
export const SITE = {
  name: "그릿마인드랩",
  title: "강의 신청",
  contact: "문의: 그릿마인드랩"   // 예) "문의: 010-0000-0000 / info@gritmindlab.com"
};

// ▼ 새 강의 등록 시 자동으로 채워지는 카드결제 링크
export const DEFAULT_CARD_URL = "https://api.wisecare.co.kr/urlGoodsOrder.html?gtk=MMMOSAVA81065444";

// ▼ 기본 환불 규정 (강의별 환불 규정을 비워두면 이 내용이 표시됩니다)
//   ※ 임시 문안입니다. 검토 후 확정된 문구로 바꿔주세요.
export const DEFAULT_REFUND = `· 수강 시작 전: 전액 환불
· 총 수강시간의 1/3 경과 전: 수강료의 2/3 환불
· 총 수강시간의 1/2 경과 전: 수강료의 1/2 환불
· 총 수강시간의 1/2 경과 후: 환불 불가
· 환불은 요청일로부터 5영업일 이내 처리됩니다.`;

// ▼ 할인 옵션 1개의 할인가 계산 (마감일 지났거나 값이 0이면 null)
export function discPrice(fee, d, today = new Date().toISOString().slice(0, 10)) {
  fee = Number(fee || 0);
  // 할인가(결제금액)를 직접 입력한 방식
  if (d && d.type === "price") {
    const f = Number(d.price);
    if (d.price === "" || d.price == null || !(f >= 0) || f >= fee) return null;
    return { final: f, text: f === 0 ? "무료" : `${(fee - f).toLocaleString("ko-KR")}원 할인` };
  }
  if (!d || !d.type || d.type === "none" || !(Number(d.value) > 0) || (d.until && today > d.until)) return null;
  if (d.type === "percent") {
    const p = Math.min(100, Math.max(0, Number(d.value)));
    return { final: Math.round(fee * (100 - p) / 100 / 10) * 10, text: `${p}% 할인` };
  }
  const amt = Math.min(fee, Number(d.value));
  return { final: fee - amt, text: `${amt.toLocaleString("ko-KR")}원 할인` };
}
// ▼ 강의의 현재 사용 가능한 할인 옵션 목록
export function discountsOf(L, today) {
  const list = L.discounts || (L.discount && L.discount.type && L.discount.type !== "none" ? [L.discount] : []);
  return list.map((d, i) => ({ ...d, i, P: discPrice(L.fee, d, today) })).filter(x => x.P);
}

// ▼ (이전 버전 호환) 할인가 계산
//   discount: { type: "none" | "percent" | "amount", value, label, until(YYYY-MM-DD) }
export function priceOf(L, today = new Date().toISOString().slice(0, 10)) {
  const fee = Number(L.fee || 0);
  const d = L.discount || {};
  const active = d.type && d.type !== "none" && Number(d.value) > 0 && (!d.until || today <= d.until);
  if (!active) return { fee, final: fee, active: false, text: "" };
  let final, text;
  if (d.type === "percent") {
    const p = Math.min(100, Math.max(0, Number(d.value)));
    final = Math.round(fee * (100 - p) / 100 / 10) * 10;   // 10원 단위 반올림
    text = `${p}% 할인`;
  } else {
    const amt = Math.min(fee, Number(d.value));
    final = fee - amt;
    text = `${amt.toLocaleString("ko-KR")}원 할인`;
  }
  return { fee, final, active: true, text, label: d.label || "할인", until: d.until || "" };
}

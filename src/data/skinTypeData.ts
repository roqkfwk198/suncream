import { SkinMbtiSelections, SkinTypeDetail } from '../types';

export type SkinTypeDataItem = SkinTypeDetail;

const buildDetail = (code: string, summary: string): SkinTypeDataItem => {
  const isDry = code[0] === 'D';
  const isSensitive = code[1] === 'S';
  const isPigmented = code[2] === 'P';
  const isWrinkle = code[3] === 'W';

  const sunscreenParts = [
    isDry ? '보습감 있는 크림형, 세라마이드/히알루론산' : '오일프리, 논코메도제닉, 젤/로션 타입',
    isSensitive ? '무기자차와 저자극 포뮬러' : '사용감 좋은 SPF50+ 데일리 차단제',
    isPigmented ? 'SPF50+, PA++++, UVA 차단 강조' : '매일 바르기 쉬운 광범위 차단',
    isWrinkle ? '항산화 성분과 촉촉한 마무리' : '가벼운 사용감과 꾸준한 차단',
  ];

  const cautionParts = [
    isDry ? '매트한 제형과 알코올감 강한 제품' : '무거운 오일리 제형과 모공 막힘',
    isSensitive ? '향료, 알코올, 강한 화학적 자극' : '기본 보습 생략과 차단제 미사용',
    isPigmented ? '스크럽, 강한 마찰, 낮은 UVA 차단' : '자외선 차단을 건너뛰는 습관',
  ];

  const careParts = [
    isDry ? '세안 후 즉시 보습하고 장벽 크림으로 마무리' : '피지는 조절하되 과세정은 피하기',
    isSensitive ? '새 제품은 천천히 도입하고 붉음이 있을 땐 진정 우선' : '기본 보습과 자외선 차단을 꾸준히 유지',
    isPigmented ? '잡티 예방을 위해 낮 시간 차단을 촘촘히 하기' : '색소 고민이 적어도 매일 차단 유지',
    isWrinkle ? '건조 잔주름을 막기 위해 보습과 항산화 케어 병행' : '탄력 유지를 위해 기본 루틴을 꾸준히 유지',
  ];

  const cleansingParts = [
    isDry ? '약산성 클렌저, 과한 이중세안 피하기, 세안 후 즉시 보습' : '피지는 관리하되 강한 세정제 남용 금지',
    isSensitive ? '미온수, 문지르지 않기, 저자극 클렌저' : '피부가 땅기지 않을 정도로 부드럽게 세안',
    isPigmented ? '스크럽이나 강한 마찰 피하기' : '자극 없는 기본 세안 유지',
  ];

  return {
    code,
    summary,
    sunscreenRecommendation: sunscreenParts.join(' · '),
    avoidOrCaution: cautionParts.join(' · '),
    carePoint: careParts.join(' · '),
    cleansingMethod: cleansingParts.join(' · '),
  };
};

export const skinTypeData: Record<string, SkinTypeDataItem> = {
  DRPT: buildDetail('DRPT', '건조하지만 장벽과 탄력이 안정적인 달걀 피부'),
  DRPW: buildDetail('DRPW', '건조, 색소, 잔주름을 함께 챙겨야 하는 피부'),
  DRNT: buildDetail('DRNT', '보습만 잘해도 건강함이 오래 가는 피부'),
  DRNW: buildDetail('DRNW', '색소는 적지만 건조 잔주름에 취약한 피부'),
  DSPT: buildDetail('DSPT', '건조, 민감, 색소 관리가 필요한 탄탄한 피부'),
  DSPW: buildDetail('DSPW', '장벽 보습과 저자극 차단이 핵심인 건성 민감 피부'),
  DSNT: buildDetail('DSNT', '작은 자극에도 쉽게 붉어지는 건성 민감 피부'),
  DSNW: buildDetail('DSNW', '속건조와 민감 반응이 컨디션에 따라 출렁이는 피부'),
  ORPT: buildDetail('ORPT', '피지와 색소만 잡으면 관리가 쉬운 탄탄한 피부'),
  ORPW: buildDetail('ORPW', '모공, 색소, 잔주름을 함께 관리할 지성 피부'),
  ORNT: buildDetail('ORNT', '피지 조절만 해도 광채가 잘 유지되는 건강 피부'),
  ORNW: buildDetail('ORNW', '번들거리지만 잔주름 관리도 필요한 지성 피부'),
  OSPT: buildDetail('OSPT', '피지, 민감, 색소 관리를 우선할 탄탄한 피부'),
  OSPW: buildDetail('OSPW', '트러블 자국과 민감 반응을 함께 다독일 지성 민감 피부'),
  OSNT: buildDetail('OSNT', '피지와 민감 반응을 조절하면 좋아지는 피부'),
  OSNW: buildDetail('OSNW', '번들거림, 붉음, 잔주름을 함께 관리할 피부'),
};

export const getSkinTypeDetail = (code: string) => skinTypeData[code];

export const selectionsFromSkinTypeCode = (code: string): SkinMbtiSelections | null => {
  if (!skinTypeData[code] || code.length !== 4) return null;

  return {
    balance: code[0] as SkinMbtiSelections['balance'],
    sensitivity: code[1] as SkinMbtiSelections['sensitivity'],
    pigment: code[2] as SkinMbtiSelections['pigment'],
    elasticity: code[3] as SkinMbtiSelections['elasticity'],
  };
};

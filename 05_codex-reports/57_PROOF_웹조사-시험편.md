# 사용 시험편 기록 방식 — 외부 근거 조사 (웹)

- 조사일 / 접속일: **2026-11-12** (전 항목 동일)
- 목적: 채널별 **① 교정(표준) 시험편 / ② 대비 시험편** 2슬롯(종류 + S/N) 설계안의 외부 근거 확보. 파형별(종파/횡파) 분리 + '같은 시편' 체크박스 대안과 비교.
- 원문 발췌 보관(로컬): `04_planning-review/web-extracts/2026-11-12_시험편/pdf/*.txt`(PDF→텍스트 · pdftotext) · `04_planning-review/web-extracts/2026-11-12_시험편/pages/*.txt`(웹페이지 innerText). 인용문은 이 파일들에서 그대로 복사함(번역·요약 없음). iTeh/SIST 미리보기 PDF의 워터마크 문자열("iTeh STANDARD PREVIEW", URL 줄)은 인용에서 제외함.
- ⚠️ 웹 자료이므로 명세에 수치·문구를 직접 옮기지 않음(루트 CLAUDE.md 웹 자료 규칙). 1순위 근거 = `01_materials`.
- 신뢰도 구분: **[규격 미리보기]** 공식 판매처의 무료 preview(본문 일부) · **[규격 인용(2차)]** 회사 절차서가 규격 조항을 옮긴 것 · **[제조사 문서]** · **[기사/블로그]**.

---

## Q1. 교정(표준) 시험편 vs 대비 시험편 — 용어 구분

### F1-1. ISO 16811:2025 (감도·범위 설정) — 6.4 / 6.5 / 6.6 3분류 · [규격 미리보기]
- URL: https://cdn.standards.iteh.ai/samples/86364/f1aa7fc2e97c48f28b2dff15e3fef735/ISO-16811-2025.pdf (발췌 = `04_planning-review/web-extracts/2026-11-12_시험편/pdf/iso16811_2025.txt`)
- 인용:
  > "6.4 Standard blocks
  > The blocks used for setting up the ultrasonic test equipment shall be in accordance with those specified in ISO 2400 and ISO 7963.
  > The stability of test equipment and setting can be verified by using the blocks given in ISO 2400 and ISO 7963."

  > "6.5 Reference blocks
  > a) When amplitudes of echoes from the test object are compared with echoes from a reference block, certain requirements relating to the material, surface condition, geometry and temperature of the block shall be observed."

  > "g) The most commonly used reflectors are:
  > 1) large planar reflectors, compared to the beam width, perpendicular to the beam axis (e.g. back wall);
  > 2) flat-bottomed holes;
  > 3) side-drilled holes;
  > 4) grooves or notches of various cross-sections"

  > "6.6 Specific test blocks
  > In certain cases, specific blocks, e.g. with identified natural discontinuities, can be used to optimise the test technique and to check the stability of the test sensitivity."
- 지원: **Q1** (장비 설정용 표준 시험편 ↔ 진폭 비교용 대비 시험편을 별도 조항으로 구분). 3번째 범주(specific test block)도 있음 — 2슬롯 밖.
- 신뢰도: 규격 미리보기(ISO 공식 본문 일부)

### F1-2. ISO 2400:2025 — 'calibration block' → 'standard block' 명칭 변경 · [규격 미리보기]
- URL: https://cdn.standards.iteh.ai/sist-preview/87438/a76c95a7d2d446b2be9f449b95d00074/ISO-2400-2025.pdf (발췌 = `04_planning-review/web-extracts/2026-11-12_시험편/pdf/iso2400_2025.txt`)
- 인용:
  > "The main changes are as follows:
  > — the wording “calibration block” has been replaced by “standard block”;
  > — the wording “calibrating” has been replaced by “setting”;"
- 같은 취지 — ISO 16811:2025 각주 (`04_planning-review/web-extracts/2026-11-12_시험편/pdf/iso16811_2025.txt`):
  > "In the next revision of the standard, the term "calibration block" is intended to be replaced by the term "standard block"."
- 지원: **Q1** — 최신 ISO 용어는 V1/V2 = **standard block(표준 시험편)**. 국문 라벨 '교정 시편'보다 **'표준 시험편'**이 ISO 2025·KS B 0831(아래 F1-4)과 일치.
- 신뢰도: 규격 미리보기

### F1-3. ISO 16810:2012 (일반 원리) 목차 — Calibration / Reference / Specific blocks · [규격 미리보기]
- URL: https://cdn.standards.iteh.ai/samples/57781/83b59c526403451598bb3956f2ce9509/ISO-16810-2012.pdf (`04_planning-review/web-extracts/2026-11-12_시험편/pdf/iso16810_2012.txt`)
- 인용(목차): > "6.4 Calibration blocks" · "6.5 Reference blocks" · "6.6 Specific blocks"
- ISO 16810:2024 목차(`04_planning-review/web-extracts/2026-11-12_시험편/pdf/iso16810_2024.txt`): > "Standard blocks" · "7.5 Reference blocks" · "Specific test blocks"
- 본문(2012) 5.4:
  > "a) a distance amplitude correction (DAC) curve, or a series of DAC curves, obtained by using artificial reflectors (sidedrilled holes, flat-bottomed holes or notches etc.) within one or more reference blocks;
  > b) an equivalent reflector diagram (DGS system);
  > c) echoes from suitable notches; or
  > d) echoes from large planar reflectors perpendicular to the acoustic axis (e.g. back wall echo)."
- 지원: **Q1·Q2** (DAC = reference block · DGS·저면 에코는 별개 경로)
- 신뢰도: 규격 미리보기(본문 6.4~6.6 내용은 미리보기 범위 밖 — 목차만 확인)

### F1-4. KS B 0831 (표준 시험편) — 한국표준협회 KSSN 상세 · [규격 공식 서지]
- URL: https://www.kssn.net/search/stddetail.do?itemNo=K001010147833 (`04_planning-review/web-extracts/2026-11-12_시험편/pages/ks0831_new.txt`)
- 인용:
  > "비파괴검사 — 초음파탐상검사 — 표준 시험편	2024-04-04	개정(표준)	이 표준은 수직 탐촉자 또는 경사각 탐촉자를 사용하여 수동 초음파탐상검사를 수행하는 (탐촉자가 연결되어 있는) 초음파 탐상기(또는 초음파 탐상 시스템)를 교정하고 탐상 감도를 설정하고 초음파 탐상기와 탐촉자의 성능을 측정하는 데 사용되는 표준 시험편에 대한 사항을 명시하며, 이번 개정에서는 인용표준 수정, 시험편에 대한 내용 수정, 용어통일 및 서식수정 등을 하였다."
- 구판(2021 확인) 적용범위(`04_planning-review/web-extracts/2026-11-12_시험편/pages/ks0831_2021.txt`, https://www.kssn.net/search/stddetail.do?itemNo=K001010135537):
  > "이 표준은 초음파 탐상 시험 장치의 교정, 조정 및 탐상 감도의 조정에 사용하는 표준 시험편에 대하여 규정한다."
- 지원: **Q1·Q2** — KS 공식 명칭은 **'표준 시험편'**. 그리고 표준 시험편도 **'탐상 감도 설정'**에 쓰임(→ Q2 반례 참고). 수직·경사각 탐촉자 **둘 다** 대상.
- 신뢰도: 규격 공식 서지 페이지(본문 아님)

### F1-5. ASTM E1316-24 Section A — reference standard / calibration 정의 · [규격 미리보기]
- URL: https://standards.iteh.ai/catalog/standards/astm/bc7501ae-213b-449e-80d1-625506c63fd9/astm-e1316-24 (`04_planning-review/web-extracts/2026-11-12_시험편/pages/iteh_e1316.txt` · 2단 조판이 섞여 추출되어 한 정의의 단어를 이어 붙임 — 단어·순서는 원문 그대로)
- 인용:
  > "reference standard, n—a material or object for which all relevant chemical and physical characteristics are known and measurable, used as a comparison for, or standardization of, equipment or instruments used for nondestructive testing."

  > "calibration, instrument, v—the comparison of an instrument with, or the adjustment of an instrument to, a known reference(s) often traceable to the National Institute of Standards and Technology (NIST). (See also standardization, instrument.)"
- 지원: **Q1(약함)** — ASTM 공통 용어엔 'calibration block'·'reference block' 구분 정의가 미리보기에 없음(UT 전용 Section은 미리보기 밖).
- 신뢰도: 규격 미리보기

### F1-6. Atlantis NDT (ASNT Level III 검수 기사) — 두 블록의 역할 구분 · [기사]
- URL: https://atlantisndt.com/blog/reference-standards-and-block-calibration-in-ut (`04_planning-review/web-extracts/2026-11-12_시험편/pages/atl_diff.txt`)
- 인용:
  > "Two kinds of block do that job. A calibration block sets up the instrument and probe: screen range, probe index point and refracted angle. A reference block (often called a reference standard) sets sensitivity: it carries reflectors of known size and depth, such as side-drilled holes, flat-bottom holes or notches, against which indications on the part are compared. A procedure names both, and the examination record identifies the actual blocks used."

  > "A calibration block sets up the instrument and probe, for example screen range, index point and refracted angle. A reference block sets sensitivity with reflectors of known size and depth. Many procedures use one of each, and some blocks serve both purposes."
- 지원: **Q1·Q2·Q3** (2슬롯 구분 + 기록에 실제 블록 식별). 단 **"some blocks serve both purposes"** = 같은 블록이 두 슬롯에 들어갈 수 있음.
- 신뢰도: 기사(업체 블로그 · 마케팅 섞임)

### F1-7. 국내 교육 블로그 — 표준시험편(STB) / 대비시험편(RB) 분류 · [블로그]
- URL: https://blog.naver.com/PostView.naver?blogId=kodingding&logNo=224125310943 (`04_planning-review/web-extracts/2026-11-12_시험편/pages/naver_kod.txt`)
- 인용:
  > "초음파탐상장치의 교정(calibration) 및 탐상감도의 교정 등에 이용되는 시험편은 규격에 따라 **표준시험편(standard test block; STB)**과 **대비시험편(reference block; RB)**으로 분류된다."

  > "대비시험편(reference block; RB)은 시험체 또는 시험체와 초음파 특성이 동일한 재료를 가공하고 제작한 것이다. 수직 또는 사각탐촉자의 거리진폭특성곡선(DAC 곡선) 작성용으로 사용되며, 주로 탐상감도의 교정에 활용된다."

  > "미국기계학회(American Society for Mechanical Engineers; ASME)가 원자로 및 압력용기에 대한 용접부의 수직 및 사각탐상의 감도를 교정하기 위하여 만든 **대비시험편(basic calibration block)**이다."
- 지원: **Q1** (국문 용어 STB/RB) + **용어 함정**: ASME의 "basic calibration block"은 국문으로 **대비시험편**에 해당.
- 신뢰도: 블로그(교재 요약으로 보임)

---

## Q2. 어떤 시험편으로 어떤 교정 항목을 하나

### F2-1. ISO 2400:2025 서문 — V1(No.1)의 용도 · [규격 미리보기]
- URL: (F1-2와 동일) `04_planning-review/web-extracts/2026-11-12_시험편/pdf/iso2400_2025.txt`
- 인용:
  > "Standard block No. 1 is made of steel and may be used for all ultrasonic testing.
  > Standard block No. 1 makes it possible to check an ultrasonic instrument completely.
  > Standard block No. 1 makes it possible, during practical testing, to check simply, from time to time, the setting of the time base and the sensitivity of the ultrasonic instrument. Moreover, it is suited to check the beam angle and the probe index point of angle-beam probes."
- 지원: **Q2** (시간축·굴절각·입사점) — 단 **감도 확인**도 V1 용도에 포함.

### F2-2. ISO 2400:2012 — 종파·횡파 음속을 한 블록에 모두 규정 · [규격 미리보기]
- URL: https://cdn.standards.iteh.ai/samples/57041/2db943ab8d4042e9b9cf88068fbd5c62/ISO-2400-2012.pdf (`04_planning-review/web-extracts/2026-11-12_시험편/pdf/iso2400_2012.txt`)
- 인용:
  > "The determined longitudinal wave velocity, vl, shall be 5 920 m/s ± 30 m/s and the transverse wave velocity, v t, shall be 3 255 m/s ± 15 m/s."

  > "8.2 Slots at zero point
  > If this modification is chosen, two slots at the zero point shall be machined (see Figure 2), which for angle beam probes provide calibrating signals at intervals of 100 mm."
- 지원: **Q2 + 파형별 분리 대안 기각 근거** — 같은 V1 한 개가 종파(수직)·횡파(사각) 기준을 동시에 가짐 → 시편을 파형으로 나누면 같은 시편이 두 칸에 중복 입력됨.

### F2-3. ISO 7963:2022 — V2(No.2)의 용도 · [규격 미리보기]
- URL: https://cdn.standards.iteh.ai/samples/82822/ce72cc562bfc4465ace54528d07ce3b4/ISO-7963-2022.pdf (`04_planning-review/web-extracts/2026-11-12_시험편/pdf/iso7963_2022.txt`)
- 인용:
  > "However, calibration block No. 2 makes it possible, during practical testing, to check simply, from time to time, the setting of the time base and the sensitivity of the ultrasonic instrument. Moreover, it is suited to check the beam angle and the probe index point of miniature angle-beam probes."

  > "The thickness of the block may be greater than 12,5 mm, for example 20 mm or 25 mm, when using non-miniature probes."
- 목차: > "5.1.2 Setting of the time base up to 125 mm steel with a straight-beam probe" · "5.1.3 Setting of the time base for 100 mm or 125 mm steel with a miniature angle-beam probe" · "5.2.2 Sensitivity setting with a straight-beam probe"
- 지원: **Q2** (V2도 수직·사각 둘 다) · **Q4** (탐촉자 크기에 따라 블록 두께가 달라짐)

### F2-4. ISO 16811:2012 — 굴절각·입사점 측정 블록 · [규격 미리보기]
- URL: https://cdn.standards.iteh.ai/samples/57782/c5f66d979684433cbf3f8a200b29f0d2/ISO-16811-2012.pdf (`04_planning-review/web-extracts/2026-11-12_시험편/pdf/iso16811_2012.txt`)
- 인용:
  > "For straight beam probes there is no requirement to measure probe index and beam angle as it is assumed that the probe index is in the centre of the probe face and the angle of refraction is zero degrees."

  > "Measured beam angles depend on the sound velocity of the reference block used. If the block is not made of non-alloy steel its velocity shall be determined and recorded."

  > "Probe index and beam angle shall be determined using Calibration Block No. 1 or Calibration Block No. 2 according to the specifications given in ISO 2400 or ISO 7963 respectively, depending on the size of the probe."

  > "4.2.2 Reference block technique
  > An alternative technique using a reference block containing at least 3 side-drilled holes as given in EN 12668-3 may be used."

  > "The use of contoured probes necessitates setting the range and sensitivity on reference blocks contoured similar to the test object, or the application of mathematical correction factors."
- 지원: **Q2**(굴절각은 사각만 · 기본 = V1/V2) · **Q4**(탐촉자 크기·곡면 슈 여부로 블록이 달라짐) · **Q3**(비강재 블록이면 음속 기록). **반례**: 굴절각·범위도 대비 시험편(SDH)으로 할 수 있음.

### F2-5. EN 10228-3:2016 (강 단조품 UT) — 교정/대비 블록 역할 + **DGS엔 대비 블록 미사용** · [규격 미리보기]
- URL: https://preview.sist.si/sist-preview/36863/a27a9305dac241bebbeccdcff4186fc6/SIST-EN-10228-3-2016.pdf (`04_planning-review/web-extracts/2026-11-12_시험편/pdf/sist_en10228_3.txt`)
- 인용:
  > "7.3 Calibration blocks
  > Calibration blocks shall conform to EN ISO 2400.
  > 7.4 Reference blocks
  > Reference blocks shall be made available when sensitivity shall be established by the distance-amplitude curve (DAC) technique and/or when discontinuities shall be sized in terms of amplitude relative to reference reflectors by the DAC technique. The surface condition of the reference block shall be representative of the surface condition of the object to be tested. Unless otherwise specified the reference block shall contain at least three reflectors covering the entire depth range under examination."

  > "Reference blocks shall not be used for the distance-gain-size (DGS) technique unless it is required to check the accuracy of a particular DGS diagram."
- 지원: **Q1·Q2** 강함. **설계 함의**: DGS 채널은 ② 대비 시험편 슬롯이 **비어 있는 것이 정상**일 수 있음(→ '해당 없음/저면 에코' 선택지 필요).
- 신뢰도: 규격 미리보기(SIST 공식)

### F2-6. Sulzer 절차서 TP-0009 (용접부 · ASME V Art.4 기반) — 시간축 = IIW / 감도 = 대비 블록 · [제조사 문서]
- URL: https://www.sulzer.com/en/-/media/files/q_documents_pe/tp/tp-0009.pdf (`04_planning-review/web-extracts/2026-11-12_시험편/pdf/sulzer_tp0009.txt` · Rev.4, 2023-06-16)
- 인용:
  > "7.1      Sweep range
  > The IIW calibration blocks Nos. 1 or 2, shall be used for calibration of the sweep range. The sweep range shall be set so that the examination can be executed up to and including the whole skip distance.
  > 7.2      Sensitivity
  > The sensitivity is set on the reference calibration block, using a distance – amplitude correction (DAC)-line, which will be constructed on the reference holes of this block."
- 지원: **Q2** — 실무 절차서가 정확히 2슬롯 구조(범위 = IIW No.1/2 · 감도/DAC = 대비 블록)로 씀.
- 신뢰도: 제조사(펌프 제조사) 공개 NDT 절차서 · Level 3 승인 문서

### F2-7. Sulzer 절차서 TP-0004 (단조품 · ASME/ISO) — 블록 역할 + DGS 기준 선택지 · [제조사 문서]
- URL: https://www.sulzer.com/en/-/media/files/q_documents_pe/tp/tp-0004.pdf (`04_planning-review/web-extracts/2026-11-12_시험편/pdf/sulzer_tp0004.txt` · Rev.05, 2023-08-22)
- 인용:
  > "7.1 The calibration of the time base, probe angle and beam characteristics for each probe shall be checked prior to examination, using the IIW, K1, or V1 calibration blocks."

  > "7.2 A calibration check on at least one of the reflectors in the reference calibration block shall be performed;"

  > "Angle beam calibration can be established by use of flat bottom holes, side drilled holes, notches or the back reflection. Separate test blocks may be employed provided they are machined with a reflecting surface. Square-, U- or V-shaped notches, side drilled or flat bottom holes maybe machined into the test block for this purpose. For the back reflection calibration a concave curved surface such as contained on an IIW, K1, or V1 test block may be used."

  > "The operator may choose from flat bottomed hole, side drilled hole or back reflection to use for calibration."

  > "This method of calibration may be used for longitudinal (single and dual) and shear wave examination."
- 지원: **Q2**(시간축·각도 = V1 · 감도 = 대비 블록) · **Q4**("for each probe") · **반례**: DGS 기준을 **V1의 R100 곡면**으로 잡을 수 있음 → ①·② 두 슬롯이 같은 블록(같은 S/N)일 수 있음.

### F2-8. Evident(구 Olympus) DGS/AVG 튜토리얼 — DGS 기준 = 저면 또는 FBH · [제조사 문서]
- URL: https://ims.evidentscientific.com/en/learn/ndt-tutorials/flaw-detection/dgs-avg (`04_planning-review/web-extracts/2026-11-12_시험편/pages/evident_dgs.txt`)
- 인용:
  > "As implemented in contemporary digital flaw detectors, DGS curves are typically plotted based on a reference calibration off a known target such as a backwall reflector or a flat bottom hole at a given depth. From that one calibration point, an entire curve set can be drawn based on probe and material characteristics."
- 지원: **Q2** (DGS는 저면 에코 1점으로 가능 → 대비 시험편 불요 경로)
- 신뢰도: 제조사 교육 문서

### F2-9. Evident Test Blocks 제품 페이지 — 표준형 블록도 '감도' 용도 표기 · [제조사 문서]
- URL: https://ims.evidentscientific.com/en/probes/single-and-dual-element/test-blocks (`04_planning-review/web-extracts/2026-11-12_시험편/pages/evident_blocks.txt`)
- 인용:
  > "Calibration and/or Reference Blocks should be used in every application. Standard blocks are available for angle beam calibrations and thickness calibrations of common materials."

  > "Meets AASHTO and AWS Type 1 block requirements. Calibrates distance and sensitivity settings. Measure refracted angle and sound exit point of angle beam transducers."

  > "Miniature Angle Beam Block Distance, beam index, refracted angle and sensitivity calibration. 25 mm thick."
- 지원: **Q2 반례** — IIW형·ISO 7963 블록도 감도 설정에 씀.

### F2-10. NDT Resource Center (Iowa State, nde-ed.org) — IIW형 블록은 수직·사각 겸용 · [교육 기관 문서]
- URL: https://www.nde-ed.org/NDETechniques/Ultrasonics/CalibrationMeth/calibrationmethods.xhtml (`04_planning-review/web-extracts/2026-11-12_시험편/pages/ndeed_cal.txt`)
- 인용:
  > "IIW type blocks are used to calibrate instruments for both angle beam and normal incident inspections. Some of their uses include setting metal-distance and sensitivity settings, determining the sound exit point and refracted angle of angle beam transducers, and evaluating depth resolution of normal beam inspection setups."
- 지원: **Q2 + 파형별 분리 기각 근거**(같은 블록이 수직·사각 겸용)
- 신뢰도: 교육 기관(대학 산하) 자료

### F2-11. 국내 교육 블로그 — STB-A1/STB-G/RB-4/RB-A6 용도 · [블로그]
- URL: (F1-7과 동일) `04_planning-review/web-extracts/2026-11-12_시험편/pages/naver_kod.txt`
- 인용:
  > "수직탐상의 감도교정과 특성 검사에 사용되는 시험편으로서 단면 크기가 60 mm × 60 mm와 50 mm × 50 mm의 2종류로 구성되어 있다. 시험편 저면의 중심에 수직으로 **평저공(FBH)**이 가공되어 있다." (STB-G — 표준 시험편인데 감도용)

  > "수직탐상에서 시험편의 두께가 25 mm, 100 mm 및 200 mm 가 되는 부분을 이용하여 다중저면 반사파를 얻은 후 탐상기의 소인지연(sweep delay)과 sweep length 조정기로 화면상의 눈금판에 에코의 위치를 맞추어 탐상범위를 조절하고 시간축을 교정한다." (STB-A1 수직)

  > "사각탐상 및 수직탐상의 거리진폭특성곡선의 작성 및 탐상감도의 교정에 사용되는 대비시험편으로서 피검체로 제작하거나 피검체와 초음파특성이 유사한 재질로 제작되며 ASME시험편을 기초로 제작한 것으로서 시험편의 제원은 그림 4.19와 같다." (RB-4)

  > "곡률을 가진 피검체의 원주 용접부를 탐상할 때 탐촉자의 입사점과 굴절각의 측정과 거리진폭특성곡선의 작성 및 탐상감도의 교정시에 사용되는 시험편으로서 피검체 또는 피검체와 초음파특성이 유사한 재질로 제작된다." (RB-A6 — 대비 시험편인데 입사점·굴절각용)
- 지원: **Q2** 매핑 + **반례 2건**(STB-G = 표준인데 감도용 / RB-A6 = 대비인데 각도용) · **Q4**(곡률별 시편)

### F2-12. KS B 0817 요약 — 감도 조정 방식에 '바닥면 에코 방식' · [블로그(규격 요약)]
- URL: https://www.songjs.com/dataroom_5/732785 (`04_planning-review/web-extracts/2026-11-12_시험편/pages/songjs_0817.txt` · KS B 0817:2016 개인 요약본)
- 인용:
  > "9.8.1 감도의 조정 : 시험편 방식, 바닥면 에코 방식, 그 밖에 검사목적에 적합한 방식. 감도의 확인은 검사 전후만이"

  > "9.8.6 거리 진폭 보상 : 흠집 에코 높이에 따라 흠집의 크기를 추정하기 위해 전자적인 진폭 보상을 하는 경우 여러"
  > "가지 위치에 세로 구멍 또는 가로 구멍 등의 반사원을 만든 대비 시험편 등으로 검사의 목적에 적합한 조정을 한다."
- 지원: **Q2** (TCG/DAC 보상 = 대비 시험편 · 감도는 시험체 저면 방식도 가능)

---

## Q3. 기록·보고서에 시험편 식별(종류·S/N) 요구

### F3-1. KS B 0817 기록 항목 — **"표준 시험편 또는 대비 시험편의 명칭 및 제조 번호"** · [블로그(규격 요약)]
- URL: https://www.songjs.com/dataroom_5/732785 (`04_planning-review/web-extracts/2026-11-12_시험편/pages/songjs_0817.txt`)
- 인용:
  > "11. 기록 및 보고
  > 검사 결과의 기록 또는 보고는 원칙적으로 다음 사항을 포함. 다만 검사 시방서 등에 구체적으로 나타낸 항목에
  > 대해서는 시방서를 첨부하거나 인용함으로써 각각의 기록에서 제외해도 된다."

  > "3) 탐촉자의 명칭, 형식 및 제조 번호"
  > "5) KS B 0831 등에서 규정하는 표준 시험편 또는 대비 시험편의 명칭 및 제조 번호"
- 지원: **Q3 최강(국내)** — 종류(명칭) + **제조 번호(S/N)**를 기록 항목으로 명시. 표준·대비 **둘 다** 대상.
- 신뢰도: 개인 사이트의 규격 요약본 → ⚠️ **KS B 0817 원문 대조 필요**(KSSN 구매본 또는 01_materials 확인)

### F3-2. ASME Sec V Art.4 T-492 기록 항목(절차서가 옮긴 것) — "calibration block identification" · [규격 인용(2차)]
- URL: https://www.sulzer.com/en/-/media/files/q_documents_pe/tp/tp-0009.pdf (`04_planning-review/web-extracts/2026-11-12_시험편/pdf/sulzer_tp0009.txt`)
- 인용:
  > "For each ultrasonic examination, following information shall be recorded:
  > (a) ultrasonic instrument identification (including manufacturer’s serial number);
  > (b) search unit(s) identification (including manufacturer’s serial number, frequency, and size);
  > (c) beam angle(s) used;"

  > "(h) calibration block identification;
  > (i) simulation block(s) and electronic simulator(s) identification when used;
  > (j) instrument reference level gain and, if used, damping and reject setting(s);
  > (k) calibration data [including reference reflector(s), indication amplitude(s), and distance reading(s)];"

  > "Items (a) through (l) may be included or attached in a separate calibration record provided the calibration record is included in the examination record."
- 같은 목록 — TP-0004 10.2 (`04_planning-review/web-extracts/2026-11-12_시험편/pdf/sulzer_tp0004.txt`): > "10.2.6 calibration block identification"
- 지원: **Q3** — 블록 식별 필수 · 교정 기록(calibration record)에 넣어도 됨. ⚠️ 장비·탐촉자는 "manufacturer’s serial number"가 **명시**되지만 블록은 **"identification"까지만** 적혀 S/N이 문자로 강제되진 않음(관행상 S/N으로 식별). ⚠️ **ASME의 'calibration block' = 기본 교정 블록(SDH·DAC용)** = 국문 **대비 시험편**에 해당.
- 신뢰도: 회사 절차서가 ASME 조항을 옮긴 것(조항 번호 T-491 등 표기). ASME 원문은 유료 — 원문 직접 확인 못 함.

### F3-3. NDT.net 논문(NDE India 2006) — ASME 보고서 항목 · [기사/논문]
- URL: https://www.ndt.net/article/nde-india2006/files/tp-107.pdf (`04_planning-review/web-extracts/2026-11-12_시험편/pdf/ndtnet_india2006.txt`)
- 인용:
  > "15. Report : Report No. and Date, Procedure No. Rev. No. Date, Equipment : Make, Model, Sr. No., Search Unit : Type, Size, Frequency, Angle, Wave Mode, Search Unit Cable : Type and Length, Special Search Unit if used, Couplant : Brand and Type, Identification of Calibration Block, Reference Reflector, Reference Level Gain, Scanning Sensitivity, Damping and Reject Settings if used,"
- 지원: **Q3** (보조)

### F3-4. Atlantis NDT 보고서 템플릿 — 예시에 블록 S/N · [기사]
- URL: https://atlantisndt.com/ndt-report-templates/ut-weld-inspection-report (`04_planning-review/web-extracts/2026-11-12_시험편/pages/atl_report.txt`)
- 인용:
  > "Calibration evidence: reference block ID, reference level (for example the DAC primary reference), scanning sensitivity above reference, and the transfer correction applied."

  > "Calibration / reference block	Basic calibration block BCB-25, S/N 0093"

  > "Older editions word this as a single list that also names the procedure, the calibration sheet identity, the surface the examination was conducted from, the surface condition, the frequency, the calibration block and any special equipment."
- 지원: **Q3** (실무 예시 = 종류 + S/N) · 단 이 예시는 블록을 **1칸**으로 묶음(대안 형태 참고)
- 신뢰도: 업체 기사·템플릿

### F3-5. ISO 2400:2012 / ISO 7963:2022 — 블록 자체에 **S/N 각인 의무** + 개별 적합성 선언 · [규격 미리보기]
- ISO 2400:2012 (`04_planning-review/web-extracts/2026-11-12_시험편/pdf/iso2400_2012.txt`):
  > "6 Marking
  > The block shall be permanently marked, in the area shown in Figure 1, with:
  > a) the number of this International Standard, i.e. ISO 2400;
  > b) the manufacturer’s serial number and trade mark."

  > "7 Declaration of conformity
  > A declaration shall be issued by the manufacturer for each block, containing:
  > a) a statement that the block complies with this International Standard, i.e. ISO 2400;
  > b) the mean value of the determined longitudinal wave velocities, vl; see Clause 5;
  > c) the mean value of the determined transverse wave velocities, v t; see Clause 5."
- ISO 7963:2022 (`04_planning-review/web-extracts/2026-11-12_시험편/pdf/iso7963_2022.txt`):
  > "b) Additionally, the block shall be permanently marked with:
  > 1) the manufacturer's name or logo;
  > 2) the reference to this document (i.e. ISO 7963); and
  > 3) a unique serial number."
- 지원: **Q3** — 표준 시험편은 **S/N이 반드시 존재**(입력 가능한 값) · 블록마다 실측 음속(종파·횡파) 선언서 → S/N이 성적서(음속값)와 연결되는 키.
- 신뢰도: 규격 미리보기

### F3-6. 제조사 — 개별 S/N 각인 + 성적서 · [제조사 문서]
- Phoenix ISL, https://www.phoenixisl.com/products/calibration-block-v1-a2/ (`04_planning-review/web-extracts/2026-11-12_시험편/pages/phoenix_v1.txt`):
  > "All calibration blocks are engraved with a unique serial number and certified to the applicable standard. All blocks are supplied with a calibration certificate."
- PH Tool, https://www.phtool.com/shop-standard-reference-calibration-test-blocks/shop-standard-reference-calibration-test-blocks-2/ (`04_planning-review/web-extracts/2026-11-12_시험편/pages/phtool_cert.txt`):
  > "All calibration test blocks ship with a NIST-traceable Certification Report stating that the block meets applicable specifications.  A Material Test Report (MTR) is also included to maintain heat or lot traceability of the raw material to the producing mill."
- Atlantis 기사(`04_planning-review/web-extracts/2026-11-12_시험편/pages/atl_diff.txt`):
  > "Each block carries an identifier and documentation of its material and reflector dimensions, so that the reflector sizes behind every recorded indication can be traced. Lost or unidentified blocks, worn reflectors and blocks of the wrong material are among the findings that most often undermine an otherwise sound ultrasonic examination."
- 지원: **Q3** (S/N 단위 추적성 관행)

---

## Q4. 같은 셋업 안에서 탐촉자마다 다른 블록

### F4-1. ISO 16811:2012 — 탐촉자 크기에 따라 V1/V2 · 곡면 슈는 곡면 대비 블록 · [규격 미리보기]
- (F2-4 인용 재사용) > "…using Calibration Block No. 1 or Calibration Block No. 2 … depending on the size of the probe." · > "The use of contoured probes necessitates setting the range and sensitivity on reference blocks contoured similar to the test object, or the application of mathematical correction factors."
- 지원: **Q4** — 탐촉자 속성(크기·슈 곡률)이 블록 선택을 바꿈 → **채널(탐촉자) 단위 기록**이 맞음.

### F4-2. ISO 7963:2022 — 비소형 탐촉자는 두꺼운 V2 · [규격 미리보기]
- (F2-3 인용) > "The thickness of the block may be greater than 12,5 mm, for example 20 mm or 25 mm, when using non-miniature probes."
- 지원: **Q4** (같은 'V2'라도 두께 변형이 다른 개체 → S/N으로 구분 필요)

### F4-3. Sulzer TP-0004 — "for each probe" · [제조사 문서]
- (F2-7 인용) > "7.1 The calibration of the time base, probe angle and beam characteristics for each probe shall be checked prior to examination, using the IIW, K1, or V1 calibration blocks."
- 지원: **Q4(간접)** — 교정은 탐촉자별.

### F4-4. Sulzer TP-0009 — 곡률·두께별로 대비 블록이 달라짐 · [규격 인용(2차)]
- 인용:
  > "For examinations in materials where the surface diameter ≤ 500 mm, a curved block shall be used."
  > "Except where otherwise stated, a single curved basic calibration block may be used for examinations in the range of curvature from 0.9 to 1.5 times the basic calibration block diameter."
- 지원: **Q4(간접)** — 검사 부위 조건별 블록 선택.

### F4-5. 국내 블로그 — 곡률별 대비 시험편(RB-A6/A7) · [블로그]
- (F2-11 인용) RB-A6·RB-A7 = 곡률 피검체용 입사점·굴절각·DAC.
- 지원: **Q4(간접)**.

---

## 찾지 못한 것 (NOT found)

- **ISO 5577 용어 정의 원문**(calibration block / reference block / test block) — 공식 OBP는 이용약관 동의 절차가 있어 지시(폼 제출 금지)에 따라 진입하지 않음. iTeh 미리보기는 목차("5.4 Calibration, reference and test blocks")까지만. 무단 전재본(BS EN ISO 5577 PDF)은 접근 거부되어 확인 안 함.
- **ASME Sec V T-492 원문** — 유료. Scribd/studylib 전재본은 쓰지 않음. 회사 절차서(Sulzer)의 인용으로만 확인 → 판(edition)별 항목 번호·문구 차이는 미확인.
- **ISO 17640 §14 / ISO 16810 §13 / EN 10228-3 §16 시험 보고서 항목 원문** — 무료 미리보기 범위 밖. 보고서 항목에 '대비 시험편 식별'이 들어가는지 ISO 계열 1차 근거는 **없음**(Atlantis 기사의 요약만 있음: "the reference method and sensitivity (DAC, DGS or reference-block)").
- **ISO 16811 §12.4.2(DGS용 reference block) 본문** — 미리보기 밖(목차만).
- **ASTM E1316 UT Section의 'basic calibration block' 정의** — 미리보기 밖.
- **JIS Z 2300 / Z 2345 용어 정의** — 공개 전재 사이트(kikakurui)는 원문 전재라 인용하지 않음.
- **KS B 0817 원문** — 요약본(songjs.com)만 확인. 원문 대조 필요.
- **"한 셋업 안 탐촉자마다 다른 블록을 써도 된다"를 직접 명시한 문장** — 못 찾음. 탐촉자 크기·곡률에 따라 블록을 고르라는 간접 근거만 있음.
- **파형(종파/횡파)으로 시험편 기록을 나누는 규격·양식** — 못 찾음(반대로 V1 한 개에 종파·횡파 음속을 모두 규정 → 파형 분리는 근거 없음).

---

## 반례·주의 (설계에 반영할 점)

1. **역할 ≠ 블록 종류.** 표준 시험편이 감도에도 쓰이고(ISO 2400/7963 서문 · KS B 0831 적용범위 · Evident · STB-G), 대비 시험편이 굴절각·범위에도 쓰임(ISO 16811 4.2.2 · RB-A6/A7). → 슬롯 이름은 **'용도(범위·영점·음속·굴절각 / 감도·DAC·TCG·DGS)'** 기준이 맞고, 각 슬롯의 종류 목록을 블록 분류로 묶으면 안 됨.
2. **같은 블록이 두 슬롯에 들어갈 수 있음** — V1 R100을 DGS 기준으로 쓰는 경우(Sulzer TP-0004) · "some blocks serve both purposes"(Atlantis). → 두 슬롯에 같은 S/N 허용.
3. **② 슬롯이 비는 경우가 정상** — DGS/저면 에코 방식(EN 10228-3 7.4 · Evident · KS B 0817 9.8.1). → '해당 없음(시험체 저면 기준)' 같은 선택지 필요.
4. **ASME 용어 함정** — ASME의 'calibration block' = SDH 기본 교정 블록 = 국문 **대비 시험편**. ASME 보고서 영문 라벨에 'Calibration block'을 ①에 매핑하면 오역.
5. **국문 라벨** — ISO 2400:2025("standard block")·KS B 0831("표준 시험편")에 맞추면 ① = **'표준 시험편'**이 '교정 시편'보다 규격 정합. (판단은 Claude/사용자 몫)

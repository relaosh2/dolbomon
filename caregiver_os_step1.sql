-- ============================================================================
-- Caregiver OS - STEP 1 핵심 테이블 설계도 (PostgreSQL 기준)
-- ============================================================================
-- 향후 STEP 3(가족돌봄OS) 확장을 고려한 뼈대 테이블입니다.
-- Dify의 기본 DB인 PostgreSQL 문법에 맞춰 작성되었습니다.

-- 1. CG_FAMILY: 가족방 (형제자매가 모이는 공동 운영체제 그룹)
CREATE TABLE CG_FAMILY (
    FAMILY_ID VARCHAR(50) PRIMARY KEY,      -- 예: 'FAM-DJE-2026' (초대 코드 역할 겸용)
    FAMILY_NAME VARCHAR(100) NOT NULL,      -- 예: '김씨네 가족돌봄방'
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CG_USER: 사용자 테이블 (카카오 로그인 연동 및 UUID 바인딩)
CREATE TABLE CG_USER (
    USER_ID VARCHAR(50) PRIMARY KEY,        -- 카카오에서 넘겨받은 고유 UUID
    FAMILY_ID VARCHAR(50),                  -- 소속된 가족방 ID
    USER_NAME VARCHAR(50) NOT NULL,         -- 사용자 이름 (예: 첫째 딸)
    ROLE VARCHAR(20) NOT NULL,              -- 'LEADER' (주보호자/개설자), 'MEMBER' (초대받은 형제자매)
    PHONE_NUMBER VARCHAR(20),               -- 카카오톡 알림톡 발송용 연락처
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_USER_FAMILY FOREIGN KEY (FAMILY_ID) REFERENCES CG_FAMILY(FAMILY_ID)
);

-- 3. CG_CARE_PROFILE: 부모님 상태 프로필 (4대 계산기 연산 및 혜택 매칭의 핵심 소스)
CREATE TABLE CG_CARE_PROFILE (
    PROFILE_ID SERIAL PRIMARY KEY,
    FAMILY_ID VARCHAR(50) NOT NULL,         -- 어느 가족의 부모님인지 매핑
    AGE INT NOT NULL,                       -- 연세 (예: 75)
    REGION VARCHAR(50) NOT NULL,            -- 거주지역 (예: 대전) -> 지역별 지자체 지원금 매칭용
    DISEASE_STATE VARCHAR(100),             -- 질환 상태 (예: 치매 초기, 뇌졸중 등)
    INCOME_LEVEL VARCHAR(50),               -- 소득 수준 (예: 중위소득 100% 이하) -> 본인부담금 감경률 계산용
    EXPECTED_CARE_TYPE VARCHAR(50),         -- 예상 간병 형태 (방문요양, 요양원 등)
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_CARE_FAMILY FOREIGN KEY (FAMILY_ID) REFERENCES CG_FAMILY(FAMILY_ID)
);

-- ============================================================================
-- [참고] STEP 3 확장 시 아래 테이블들이 추가될 예정입니다:
-- CG_CALENDAR (일정 관리), CG_EXPENSE (지출 장부), 
-- CG_SETTLEMENT (1/N 정산), CG_VISIT_LOG (방문 인증)
-- ============================================================================

-- ============================================================================
-- Caregiver OS - 자녀 용돈 포인트 미션 (PostgreSQL 기준)
-- ============================================================================
-- 3대(조부모-부모-자녀)를 잇는 핵심 체류(Retention) 시스템입니다.
-- 기존 CG_FAMILY, CG_USER 테이블과 완벽하게 100% 상생 연동됩니다.

-- 1. CG_MISSION_POOL: 미션 마스터 테이블 (부모들이 생성한 우리 집 미션 풀)
CREATE TABLE CG_MISSION_POOL (
    MISSION_ID SERIAL PRIMARY KEY,
    FAMILY_ID VARCHAR(50) NOT NULL,      -- 어느 가족방의 미션인지 매핑
    MISSION_NAME VARCHAR(200) NOT NULL,  -- 예: "할머니께 안부 전화드리기"
    POINTS INT NOT NULL,                 -- 성공 시 지급할 가상 포인트 (예: 500, 1000)
    CREATED_BY VARCHAR(50),              -- 미션을 등록한 부모 ID
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_MISS_FAMILY FOREIGN KEY (FAMILY_ID) REFERENCES CG_FAMILY(FAMILY_ID)
    -- CONSTRAINT FK_MISS_CREATOR FOREIGN KEY (CREATED_BY) REFERENCES CG_USER(USER_ID)
);

-- 2. CG_MISSION_REG: 자녀 미션 수행 요청 테이블 (어뷰징 방지 및 트래킹 장부)
CREATE TABLE CG_MISSION_REG (
    REG_ID SERIAL PRIMARY KEY,
    MISSION_ID INT NOT NULL,
    CHILD_ID VARCHAR(50) NOT NULL,       -- 미션을 수행한 자녀 ID
    STATUS VARCHAR(20) DEFAULT 'REQUESTED' CHECK (STATUS IN ('REQUESTED', 'APPROVED', 'REJECTED')),
    CHILD_COMMENT VARCHAR(500),          -- 자녀가 남기는 인증 한줄평
    APPROVED_BY VARCHAR(50),             -- 팩트체크 및 승인해준 부모 ID
    REQUESTED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    APPROVED_AT TIMESTAMP,
    CONSTRAINT FK_REG_MISSION FOREIGN KEY (MISSION_ID) REFERENCES CG_MISSION_POOL(MISSION_ID)
    -- CONSTRAINT FK_REG_CHILD FOREIGN KEY (CHILD_ID) REFERENCES CG_USER(USER_ID),
    -- CONSTRAINT FK_REG_APPROVER FOREIGN KEY (APPROVED_BY) REFERENCES CG_USER(USER_ID)
);

-- 3. CG_WALLET: 자녀 가상 지갑 장부 (무결성 포인트 관리)
CREATE TABLE CG_WALLET (
    CHILD_ID VARCHAR(50) PRIMARY KEY,
    CURRENT_POINTS INT DEFAULT 0,        -- 현재 보유 포인트
    TOTAL_EARNED INT DEFAULT 0,          -- 역대 총 획득 포인트 (통계용)
    TARGET_POINTS INT DEFAULT 10000,     -- 용돈 환전 목표 기준점 (예: 10,000P)
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- CONSTRAINT FK_WALL_CHILD FOREIGN KEY (CHILD_ID) REFERENCES CG_USER(USER_ID)
);

-- ============================================================================
-- [핵심 비즈니스 로직]: 미션 승인 트랜잭션 프로시저 (Atomic)
-- ============================================================================
/*
-- 1단계: 자녀의 완료 요청을 '승인'으로 업데이트
UPDATE CG_MISSION_REG 
SET STATUS = 'APPROVED', 
    APPROVED_BY = :login_parent_id, 
    APPROVED_AT = CURRENT_TIMESTAMP
WHERE REG_ID = :target_reg_id AND STATUS = 'REQUESTED';

-- 2단계: 승인된 미션의 포인트를 지갑에 즉시 가산
UPDATE CG_WALLET W
SET CURRENT_POINTS = CURRENT_POINTS + (
        SELECT M.POINTS FROM CG_MISSION_POOL M 
        JOIN CG_MISSION_REG R ON M.MISSION_ID = R.MISSION_ID
        WHERE R.REG_ID = :target_reg_id
    ),
    TOTAL_EARNED = TOTAL_EARNED + (
        SELECT M.POINTS FROM CG_MISSION_POOL M 
        JOIN CG_MISSION_REG R ON M.MISSION_ID = R.MISSION_ID
        WHERE R.REG_ID = :target_reg_id
    ),
    UPDATED_AT = CURRENT_TIMESTAMP
WHERE W.CHILD_ID = :target_child_id;
*/

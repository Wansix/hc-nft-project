# 🐋 Whaley HC NFT Project
<img width="1648" height="1698" alt="image" src="https://github.com/user-attachments/assets/09ea1991-03a6-4453-b6ba-4a103a412768" />

> **Web3 기반 NFT 민팅 및 스테이킹 플랫폼**

Whaley HC NFT 프로젝트는 Polygon 블록체인을 기반으로 한 NFT 민팅 및 스테이킹 플랫폼입니다. 단계별 민팅 시스템과 스테이킹을 통한 라이센스 시스템을 구현한 완전한 Web3 애플리케이션입니다.

## 🌐 Live Demo

- **OpenSea Collection**: [https://opensea.io/collection/whaley-hc](https://opensea.io/collection/whaley-hc)

## ✨ 주요 기능

### 🎯 NFT 민팅 시스템
- **다단계 민팅 프로세스**: 테스트 → 화이트리스트 → 퍼블릭 단계별 진행
- **화이트리스트 검증**: 각 단계별 화이트리스트 자동 확인
- **동적 가격 설정**: 단계별 다른 민팅 가격 관리
- **수량 제한**: 단계별 민팅 수량 제한 및 잔여량 실시간 표시

### 💎 스테이킹 시스템
- **3개 NFT 동시 스테이킹**: 최소 3개의 NFT를 동시에 스테이킹
- **언스테이킹 프로세스**: 요청 → 관리자 승인 → 언스테이킹의 체계적 프로세스
- **상업적 사용 라이센스**: 스테이킹 후 고래 이미지의 상업적 사용 권한 획득
- **라이센스 신청**: 구글 폼을 통한 저작권 사용 허가 공식 신청 시스템

### 🔐 관리자 기능
- **민팅 상태 관리**: 실시간 민팅 단계 및 상태 모니터링
- **스테이킹 관리**: 언스테이킹 요청 승인 및 관리
- **화이트리스트 관리**: 화이트리스트 주소 추가/삭제

## 🛠️ 기술 스택

### Frontend
- **React 18.2.0** - 최신 React 기능 활용
- **React Router DOM 6.4.4** - SPA 라우팅
- **Bootstrap 5.2.3** - 반응형 UI 프레임워크
- **React Bootstrap 2.6.0** - Bootstrap 컴포넌트

### Blockchain & Web3
- **Web3.js 1.8.1** - 블록체인 상호작용
- **Alchemy Web3 1.4.7** - 블록체인 인프라
- **Ethereum** - 스마트 컨트랙트 플랫폼

### 기타
- **Axios 1.2.2** - HTTP 클라이언트
- **React Device Detect 2.2.2** - 디바이스 감지
- **Dotenv 16.0.3** - 환경 변수 관리

## 🏗️ 프로젝트 구조

```
hc-nft-project/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── WalletConnect.js # 지갑 연결 컴포넌트
│   │   ├── UtilEventMenu.js # 유틸리티 메뉴
│   │   └── readWhitelists.js # 화이트리스트 읽기
│   ├── screens/            # 페이지 컴포넌트
│   │   ├── Home.js         # 메인 홈페이지
│   │   ├── MintPage.js     # 민팅 페이지
│   │   ├── StakePage.js    # 스테이킹 페이지
│   │   ├── Admin.js        # 관리자 페이지
│   │   └── WhitelistCheck.js # 화이트리스트 확인
│   ├── contracts/          # 스마트 컨트랙트 연동
│   │   └── index.js        # 컨트랙트 ABI 및 함수
│   ├── css/               # 스타일시트
│   └── fonts/             # 커스텀 폰트
├── public/                # 정적 파일
└── package.json
```

## 🔗 스마트 컨트랙트

### NFT 컨트랙트
- **주요 기능**: 민팅, 전송, 승인, 메타데이터 관리
- **단계 관리**: 8단계 민팅 프로세스 (INIT → WHITELIST1 → ... → DONE)
- **ERC-721 표준** 준수

### 화이트리스트 컨트랙트
- **주소 관리**: 화이트리스트 주소 추가/삭제
- **단계별 관리**: 화이트리스트1, 화이트리스트2 구분

### 스테이킹 컨트랙트
- **스테이킹**: 3개 NFT 동시 스테이킹
- **언스테이킹**: 요청 → 대기 → 승인 → 언스테이킹 프로세스

## 🌐 네트워크 정보

- **블록체인**: Polygon (Chain ID: 0x89)
- **컨트랙트 주소들**:
  - 메인 NFT: `0x8B8aD5618fa85B9Be0713732CDe5adbeF15CE1Dc`
  - 화이트리스트: `0x6Dae4db07314A470965a43F1B5eB0Ee57a6255ba`
  - 스테이킹: `0xEDc47aFB189F8DB9b93d014E3aE3eE35994E9aCf`

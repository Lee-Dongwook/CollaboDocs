# CollaboDocs

## 1. 기본 사용자 인증 및 NextAuth 통합

- NextAuth를 사용하여 로그인 및 회원가입 기능 구현.
- JWT 토큰 기반으로 사용자 인증 처리.
클라이언트 측에서 로그인 상태에 따라 다른 페이지 접근 제어.
- SessionProvider와 useSession 훅을 통해 로그인 상태 관리.

## 2. MongoDB 연동 및 사용자 모델 설정

- Mongoose를 사용하여 User 모델을 정의하고, bcrypt를 이용해 비밀번호 해싱 처리.
- MongoDB에 연결하여 사용자 데이터를 저장 및 조회.
- Node.js 서버에서 회원가입 및 로그인 API 제공.

## 3. 실시간 협업 문서 편집기 구현

- WebSocket을 이용한 실시간 편집 동기화.
- Socket.IO를 사용하여 여러 사용자가 문서 편집을 실시간으로 반영.
- Document 모델을 만들어 MongoDB에 문서를 저장하고, 문서의 버전 관리 기능 구현.

## 4. 프론트엔드 UI와 기능 구현 (Next.js)

- Next.js를 기반으로 TypeScript와 Tailwind CSS를 사용하여 사용자 인터페이스 구현.
- React Quill을 사용한 문서 편집기 컴포넌트 생성 및 실시간 동기화.
- 문서 버전 복구 기능을 통해, 이전 버전의 문서로 복원 가능.
- 문서 목록과 편집 페이지의 UI 구성.

## 5. 오프라인 편집 및 동기화 기능

- 사용자가 오프라인 상태에서도 문서를 편집할 수 있도록 IndexedDB를 사용하여 로컬 저장소에 임시 저장.
- 사용자가 온라인 상태로 돌아오면, 서버와 데이터 동기화.

## 6. 비디오 스트리밍 기능 (Mux 사용)

- Mux와 MuxPlayer를 사용하여 동영상 스트리밍 기능 추가.
- Mux Video를 이용해 메인 페이지에 비디오 플레이어를 통합하여 서비스 소개.


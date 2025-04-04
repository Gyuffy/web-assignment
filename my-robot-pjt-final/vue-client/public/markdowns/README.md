# 프로젝트 명세서: 지능형 휴머노이드 대시보드

## 1. 개요

본 프로젝트는 자율 동작이 가능한 지능형 휴머노이드를 위한 대시보드를 구현하는 것을 목표로 합니다. 사용자 웹 인터페이스는 두 가지 모드로 구성되며, 하나는 자율주행(지능모드)이고 다른 하나는 직접 조종(조종모드)입니다. 시스템은 로봇 클라이언트, 웹 클라이언트, 그리고 중계 서버의 3요소로 구성되어, 각 요소 간 통신 방식이 상이합니다.

## 2. 기술 스택

- **Express.js**: 중계 서버 구현 및 REST API 서버로 활용
- **MySQL**: 로봇 조작 명령 로그 등의 데이터 저장 및 관리
- **Vue.js**: 웹 클라이언트 구현 및 사용자 인터페이스 제공
- **Raspberry Pi**: 센서 제어 및 원격 하드웨어 조작 (예: LED 원격 제어)

## 3. 시스템 아키텍처

**로봇 클라이언트**

- 하드웨어(휴머노이드)와 직접 연결된 모듈
- TCP 소켓을 통해 중계 서버와 통신하며, 센서 데이터 및 제어 명령을 주고받음

**중계 서버**

- Express.js 기반의 웹 서버로 구현
- **TCP 소켓 서버**: 로봇 클라이언트와의 통신을 담당
- **웹소켓 서버**: 웹 클라이언트와의 실시간 데이터 전송 및 명령 전달
- **REST API**: 로그 저장, 조회 및 기타 제어 명령 관련 엔드포인트 제공

**웹 클라이언트**

- Vue.js 기반의 프론트엔드 애플리케이션
- Chart.js를 활용하여 실시간 그래프로 로봇 상태(속도, 방향, 감지된 물체 등) 시각화
- 네비게이션 바를 통해 지능모드(자율주행)와 조종모드를 선택 가능
- 사용자 명령을 REST API 및 웹소켓을 통해 중계 서버로 전송

## 4. 기능 요구사항

1. **실시간 데이터 전송 (WebSocket)**
    - 로봇의 센서 데이터(속도, 방향, 감지된 물체 등)를 실시간으로 웹 클라이언트에 전달
    - Chart.js를 이용해 실시간 그래프 업데이트
2. **로봇 컨트롤러**
    - 로봇의 세팅값 조정 및 직접 조작 기능 구현
    - 조종모드 선택 시 사용자 입력을 기반으로 제어 명령 전송
3. **Raspberry Pi 센서 원격 조작**
    - Vue.js UI에서 LED 원격 제어 등 간단한 센서 제어 기능 구현
    - 사용자가 UI에서 입력 시 Raspberry Pi의 센서(또는 액추에이터)가 반응
4. **REST API 로그 시스템**
    - 로봇 조작 명령 및 이벤트를 MySQL DB에 저장
    - 저장된 로그를 웹 클라이언트에서 확인할 수 있도록 API 제공
5. **HTTP 메소드 및 상태 코드**
    - GET과 POST를 적절히 사용하여 데이터 조회 및 명령 전송 구현
    - API 요청에 대해 적합한 HTTP Status Code(예: 200, 201, 400, 500 등) 적용
6. **예외 처리**
    - API 요청 시 발생 가능한 예외(네트워크 오류, 데이터베이스 오류, 잘못된 입력 등)를 적절히 처리
    - 클라이언트 및 서버 간의 통신 오류, 데이터 유효성 검사 실패 등 에러 핸들링

## 5. 상세 아키텍처 및 구성 요소

### 중계 서버 (Express.js)

- **TCP 소켓 모듈**: 로봇 클라이언트와 연결하여 센서 데이터 수신 및 제어 명령 전달
- **웹소켓 모듈**: 웹 클라이언트와 실시간 데이터 및 이벤트 교환
- **REST API 엔드포인트**:
    - 로봇 조작 명령 로그 등록 (POST)
    - 로그 조회 (GET)
    - 기타 제어 명령 관련 엔드포인트

### 웹 클라이언트 (Vue.js + Chart.js)

- **네비게이션 바**: 지능모드(자율주행)와 조종모드 선택 기능 제공
- **실시간 대시보드**: 웹소켓을 통한 실시간 그래프 및 로봇 상태 표시
- **제어 인터페이스**: 로봇 컨트롤러 및 Raspberry Pi 센서 제어 (예: LED ON/OFF 버튼)

### 로봇 클라이언트 (휴머노이드 + Raspberry Pi)

- **센서 모듈**: 다양한 센서 데이터(속도, 방향, 감지 등) 수집
- **제어 모듈**: 중계 서버로부터 수신한 명령 실행 (예: LED 제어, 모터 조작)
- **TCP 소켓 통신**: 중계 서버와 안정적인 통신 유지

## 6. API 명세

### 예시 엔드포인트

- **POST /api/robot/command**
    - **설명**: 로봇 제어 명령 전송 및 로그 저장
    - **요청 바디**: `{ "command": "MOVE_FORWARD", "parameters": { "speed": 5 } }`
    - **응답**: 성공 시 `201 Created`, 실패 시 적절한 에러 코드
- **GET /api/robot/logs**
    - **설명**: 로봇 조작 명령 로그 조회
    - **응답**: 로그 목록과 상태 코드 `200 OK`

> 모든 API 요청 시, 입력 값의 유효성 검증 및 에러 발생 시 적절한 상태 코드(예: 400, 500 등)를 반환
> 

## 7. 결론

이 프로젝트는 자율 및 수동 제어 기능을 모두 갖춘 지능형 휴머노이드의 대시보드 구현을 목표로 하며, Express.js, MySQL, Vue.js, Raspberry Pi를 활용하여 실시간 데이터 통신, 센서 제어 및 로그 관리 기능을 제공합니다.
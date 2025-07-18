## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install

# nvm 설치 (설치 안 돼 있으면)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc  # 또는 ~/.bashrc, ~/.profile

# Node.js 22 설치 및 사용
nvm install 22
nvm use 22

# Nest CLI & 의존성 설치
npm install -g @nestjs/cli

# PostgreSQL 설치 및 실행
brew install postgresql@17
brew services start postgresql@17
createdb failly

# 백엔드
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev

# 프론트
cd ../frontend
npm install
npm run dev

# 환경변수
# backend/.env 파일 생성 후 아래 내용 입력:
DATABASE_URL="postgresql://<유저이름>:<비밀번호>@localhost:5432/failly"

```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Version
```bash
스택       | 버전          | 비고
Node.js	    v22.x	        .nvmrc로 고정되어 있음
npm	        v10.x ~ 11.x	Node 22에 자동 포함됨
NestJS CLI	v11.x	        nest --version으로 확인
PostgreSQL	v17	            macOS: brew install postgresql@17
Prisma CLI	v6.x	        npx prisma -v
TypeScript	v5.x	        프론트/백엔드 공통


```
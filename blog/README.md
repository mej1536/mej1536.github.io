# Next.js 마크다운 블로그 🚀

이 저장소는 기존 지킬(Jekyll) 환경에서 **Next.js 기반의 정적 사이트(Static Site)
블로그**로 새롭게 세팅된 프로젝트입니다. 마크다운(`.md`) 파일로 글을 작성하면
깃허브 액션(GitHub Actions)을 통해 깃허브 페이지(GitHub Pages)에 자동으로
배포됩니다.

---

## 🛠 사용된 주요 기술

- **프레임워크:** Next.js (App Router 적용)
- **패키지 관리자:** pnpm
- **마크다운 파싱:** `gray-matter` (메타데이터 분석), `remark` & `remark-html`
  (HTML 변환)
- **배포 환경:** GitHub Pages (via GitHub Actions)

---

## 📝 환경 세팅 히스토리 (과정 정리)

블로그를 띄우기 위해 다음과 같은 단계로 환경 세팅이 진행되었습니다.

### 1. Next.js 프로젝트 생성

새로운 브랜치에서 `create-next-app`을 이용해 프로젝트를 생성했습니다.

```bash
npx create-next-app@latest blog
```

### 2. 깃허브 페이지용 정적 내보내기 설정 (`next.config.mjs`)

깃허브 페이지는 서버 기능이 없는 정적 호스팅이므로, 순수 HTML/CSS/JS 파일만
빌드되도록 설정을 변경했습니다.

- `output: "export"`: 정적 파일 내보내기 설정
- `images: { unoptimized: true }`: 정적 내보내기 시 Next.js의 기본 이미지 최적화
  엔진 오류를 막기 위한 설정
- _(선택)_ 최상위 도메인이 아닌 `/blog` 형태의 하위 도메인을 쓴다면
  `basePath: "/blog"` 추가

### 3. 마크다운(.md) 처리 라이브러리 설치

글을 읽어오기 위해 필요한 도구들을 설치했습니다.

```bash
pnpm install gray-matter remark remark-html
```

### 4. 블로그 글 관리 로직 구성 (`src/lib/posts.js`)

- 최상단에 `posts/` 폴더를 생성하여 마크다운 글들을 저장하도록 했습니다.
- `src/lib/posts.js` 유틸리티 파일을 만들어 **전체 게시글 목록 가져오기(정렬)**
  및 **특정 게시글의 상세 내용 읽어오기(HTML 변환)** 기능을 구현했습니다.

### 5. 블로그 화면(UI) 구성

- **메인 화면 (`src/app/page.js`):** `getSortedPostsData` 함수를 이용해 블로그
  글 목록을 화면에 렌더링합니다.
- **상세 화면 (`src/app/posts/[id]/page.js`):** `getPostData` 함수로 마크다운
  본문을 HTML로 변환하여 출력합니다. `generateStaticParams` 함수를 사용하여 빌드
  시 모든 글의 정적 페이지를 미리 생성하도록 했습니다.

### 6. GitHub Actions 자동 배포 설정

루트 경로에 `.github/workflows/deploy-nextjs.yml` 파일을 작성하여 깃허브 페이지
자동 배포 파이프라인을 구축했습니다.

- **설정 확인:** 해당 액션이 동작하려면 GitHub Repository 설정(Settings >
  Pages)에서 Source를 **`GitHub Actions`** 로 반드시 변경해야 합니다.

---

## ✍️ 새로운 글 작성 방법

1.  이 프로젝트 폴더 안에 있는 `posts/` 폴더로 이동합니다.
2.  새로운 마크다운 파일(예: `my-new-post.md`)을 생성합니다.
3.  파일 상단에 아래와 같이 **Frontmatter(메타데이터)** 를 작성하고 아래에
    본문을 작성합니다.

    ```md
    ---
    title: "새로운 글 제목"
    date: "2026-04-24"
    ---

    여기에 본문을 마크다운으로 자유롭게 작성하세요!
    ```

4.  작성이 완료되면 코드를 깃허브에 Push 합니다. 깃허브 액션이 약 1~2분 뒤
    자동으로 블로그를 업데이트합니다.

---

## 💻 로컬에서 블로그 실행해 보기

글을 쓰면서 내 컴퓨터에서 화면을 미리 확인하고 싶다면 아래 명령어를 사용하세요.

```bash
# 폴더로 이동 후
cd blog

# pnpm 설치가 되어있지 않다면: npm i -g pnpm

# 라이브러리 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

명령어 실행 후 브라우저에서 `http://localhost:3000` 으로 접속하면 블로그를
확인할 수 있습니다.

---

## 🤖 GitHub Actions 자동 배포 원리

`.github/workflows/deploy-nextjs.yml` 설정 파일은 다음과 같은 단계로 자동화
작업을 수행합니다.

### 1. 배포 시작 조건 (Trigger)

- `blog-nextjs` 브랜치에 새로운 코드나 글이 푸시(Push)될 때 자동으로 시작됩니다.
- 깃허브 웹사이트에서 수동으로 실행할 수도 있습니다 (`workflow_dispatch`).

### 2. 빌드 단계 (Build Job)

- **작업 환경 세팅:** `ubuntu-latest` 서버의 `blog` 폴더 내부에서 작업이
  진행됩니다.
- **설치:** 원활한 실행을 위해 `pnpm` (10버전)과 `Node.js` (20버전)를
  설치합니다.
- **코드 변환(빌드):** `pnpm install`로 필요한 도구를 받고, `pnpm next build`를
  실행해 마크다운 글과 Next.js 코드를 인터넷 브라우저가 읽을 수 있는 순수 정적
  파일(HTML, CSS)로 만들어냅니다.
- **결과물 포장:** 빌드되어 나온 결과물 폴더(`blog/out`)를 다음 단계로 넘기기
  위해 압축 포장(Upload artifact)합니다.

### 3. 배포 단계 (Deploy Job)

- 빌드 단계가 에러 없이 완벽히 끝난 후 진행됩니다. (`needs: build`)
- 앞 단계에서 포장되어 넘어온 결과물 파일을 받아, 실제 깃허브 페이지 인터넷
  주소(`https://mej1536.github.io/`)에 최종적으로 덮어써서 업데이트를
  완료합니다.

1. 언제 실행할 것인가? (on:)

```
on:
  push:
    branches: ["blog-nextjs"]
  workflow_dispatch:
```

- push: 깃허브의 blog-nextjs 브랜치에 새로운 코드나 글을 올릴(Push) 때마다 이
  지시서를 실행하라는 뜻입니다.
- workflow_dispatch: 방금 하셨던 것처럼 깃허브 웹사이트에서 버튼을 눌러 수동으로
  실행할 수 있게 해주는 기능입니다.

2. 어떤 권한이 필요한가? (permissions:)

```
permissions:
  contents: read
  pages: write
  id-token: write
```

- contents: read: 깃허브 서버가 내 코드를 읽고(read), 깃허브 페이지 인터넷
  주소에 결과물을 덮어쓸 수 있도록(write) 안전하게 권한을 부여하는 설정입니다.

3. 실제 작업 내용 (jobs:) 작업은 크게 **만들기(build)**와 **인터넷에
   올리기(deploy)** 두 단계로 나뉩니다.

```
jobs:
  build:
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: blog

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
```

<!-- - build: 이 자동화 작업의 이름을 'build'라고 지정했습니다. (이 이름을 나중에 deploy에서 끌어다 씁니다.)
- runs-on: ubuntu-latest: '블로그 코드(Next.js)'를 실제로 돌릴 컴퓨터(서버)의 운영체제를 우분투 리눅스로 지정한 것입니다. (마치 내 컴퓨터가 윈도우라면, 블로그 전용 서버는 리눅스인 셈입니다.)
- defaults: run: ...: 앞으로 할 일들을 'blog' 폴더 안에서만 하도록 기본 설정을 해주는 것입니다. -->

🛠 1단계: 빌드 작업 (build) 내 컴퓨터에서 하던 작업을 깃허브 서버
컴퓨터(우분투)가 대신 똑같이 하도록 명령하는 부분입니다.

- working-directory: ./blog: 모든 명령어를 엉뚱한 곳이 아닌 blog 폴더 안에서
  실행하라고 알려줍니다.
- Checkout: 깃허브 저장소에 있는 내 코드를 깃허브 서버 컴퓨터로 다운로드합니다.
- Install pnpm & Setup Node: 코드를 실행하기 위해 필요한 프로그램인
  pnpm(10버전)과 Node.js(20버전)를 서버 컴퓨터에 설치합니다.
- Install dependencies: pnpm install을 실행해 필요한 라이브러리들을 쫙
  다운받습니다.
- Build with Next.js: pnpm next build를 실행해 Next.js 코드를 인터넷 브라우저가
  읽을 수 있는 순수한 HTML, CSS 파일들로 변환(빌드)합니다.
- Upload artifact: 빌드해서 튀어나온 결과물 폴더(blog/out)를 다음 '배포' 단계로
  넘겨주기 위해 상자에 예쁘게 포장(업로드)합니다.

🚀 2단계: 배포 작업 (deploy)

```
  deploy:
    needs: build
    # ...생략...
    steps:
      - name: Deploy to GitHub Pages
```

- needs: build: 1단계(빌드)가 성공적으로 끝나야만 이 작업을 시작하라는 뜻입니다.
- 포장되어 넘어온 결과물 상자를 넘겨받아서, 실제 깃허브 페이지 인터넷
  주소(https://mej1536.github.io/)에 최종적으로 업로드하여 누구나 볼 수 있게
  띄워줍니다.

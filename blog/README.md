# Next.js 마크다운 블로그 🚀

이 저장소는 기존 지킬(Jekyll) 환경에서 **Next.js 기반의 정적 사이트(Static Site) 블로그**로 새롭게 세팅된 프로젝트입니다. 마크다운(`.md`) 파일로 글을 작성하면 깃허브 액션(GitHub Actions)을 통해 깃허브 페이지(GitHub Pages)에 자동으로 배포됩니다.

---

## 🛠 사용된 주요 기술
*   **프레임워크:** Next.js (App Router 적용)
*   **패키지 관리자:** pnpm
*   **마크다운 파싱:** `gray-matter` (메타데이터 분석), `remark` & `remark-html` (HTML 변환)
*   **배포 환경:** GitHub Pages (via GitHub Actions)

---

## 📝 환경 세팅 히스토리 (과정 정리)

블로그를 띄우기 위해 다음과 같은 단계로 환경 세팅이 진행되었습니다.

### 1. Next.js 프로젝트 생성
새로운 브랜치에서 `create-next-app`을 이용해 프로젝트를 생성했습니다.
```bash
npx create-next-app@latest blog
```

### 2. 깃허브 페이지용 정적 내보내기 설정 (`next.config.mjs`)
깃허브 페이지는 서버 기능이 없는 정적 호스팅이므로, 순수 HTML/CSS/JS 파일만 빌드되도록 설정을 변경했습니다.
*   `output: "export"`: 정적 파일 내보내기 설정
*   `images: { unoptimized: true }`: 정적 내보내기 시 Next.js의 기본 이미지 최적화 엔진 오류를 막기 위한 설정
*   *(선택)* 최상위 도메인이 아닌 `/blog` 형태의 하위 도메인을 쓴다면 `basePath: "/blog"` 추가

### 3. 마크다운(.md) 처리 라이브러리 설치
글을 읽어오기 위해 필요한 도구들을 설치했습니다.
```bash
pnpm install gray-matter remark remark-html
```

### 4. 블로그 글 관리 로직 구성 (`src/lib/posts.js`)
*   최상단에 `posts/` 폴더를 생성하여 마크다운 글들을 저장하도록 했습니다.
*   `src/lib/posts.js` 유틸리티 파일을 만들어 **전체 게시글 목록 가져오기(정렬)** 및 **특정 게시글의 상세 내용 읽어오기(HTML 변환)** 기능을 구현했습니다.

### 5. 블로그 화면(UI) 구성
*   **메인 화면 (`src/app/page.js`):** `getSortedPostsData` 함수를 이용해 블로그 글 목록을 화면에 렌더링합니다.
*   **상세 화면 (`src/app/posts/[id]/page.js`):** `getPostData` 함수로 마크다운 본문을 HTML로 변환하여 출력합니다. `generateStaticParams` 함수를 사용하여 빌드 시 모든 글의 정적 페이지를 미리 생성하도록 했습니다.

### 6. GitHub Actions 자동 배포 설정
루트 경로에 `.github/workflows/deploy-nextjs.yml` 파일을 작성하여 깃허브 페이지 자동 배포 파이프라인을 구축했습니다.
*   **설정 확인:** 해당 액션이 동작하려면 GitHub Repository 설정(Settings > Pages)에서 Source를 **`GitHub Actions`** 로 반드시 변경해야 합니다.

---

## ✍️ 새로운 글 작성 방법

1.  이 프로젝트 폴더 안에 있는 `posts/` 폴더로 이동합니다.
2.  새로운 마크다운 파일(예: `my-new-post.md`)을 생성합니다.
3.  파일 상단에 아래와 같이 **Frontmatter(메타데이터)** 를 작성하고 아래에 본문을 작성합니다.
    ```md
    ---
    title: "새로운 글 제목"
    date: "2026-04-24"
    ---

    여기에 본문을 마크다운으로 자유롭게 작성하세요!
    ```
4.  작성이 완료되면 코드를 깃허브에 Push 합니다. 깃허브 액션이 약 1~2분 뒤 자동으로 블로그를 업데이트합니다.

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
명령어 실행 후 브라우저에서 `http://localhost:3000` 으로 접속하면 블로그를 확인할 수 있습니다.

# mej1536.github.io

Jekyll 기반의 개인 블로그 리포지토리입니다.

---

## 개발 환경 설정

### 1. Ruby 설치 (Windows)

Jekyll은 Ruby 기반이므로 **RubyInstaller**를 사용하여 설치합니다.

#### 설치 단계

1. [https://rubyinstaller.org/downloads/](https://rubyinstaller.org/downloads/) 에 접속
2. **Ruby+Devkit** 버전 중 `3.1.x (x64)` 또는 `3.2.x (x64)` 다운로드
   - ⚠️ Ruby 3.3 이상은 Jekyll과 호환성 문제가 있을 수 있으므로 **3.1 또는 3.2 권장**
   - `Devkit` 포함 버전이어야 `sassc` 등의 C 확장 젬 빌드 가능
3. 설치 마지막 단계에서 MSYS2 설치 옵션 → **옵션 3 (MSYS2 and MINGW development toolchain)** 선택

#### 설치 확인

```bash
ruby -v
gem -v
bundler -v
```

#### 주의사항

| 항목 | 내용 |
|------|------|
| Ruby 버전 | `3.1.x` 또는 `3.2.x` 권장 |
| Devkit 필수 | `sassc` 컴파일에 C 컴파일러 필요 |
| 경로 | 설치 경로에 한글/공백 없어야 함 |
| 권한 | 관리자 권한으로 설치 권장 |

---

### 2. 의존성 설치 및 로컬 서버 실행

```bash
# 젬 설치
bundle install

# 로컬 서버 실행 (http://localhost:4000)
bundle exec jekyll serve
```

---

## 보안 업데이트

### faraday 버전 업데이트 (GitHub Security 대응)

GitHub Security Dependabot에서 `faraday` 젬을 `~> 2.14.1` 이상으로 올리도록 경고가 발생한 경우,
아래 절차로 업데이트합니다.

#### 원인

`faraday`는 `jekyll-gist` → `octokit` → `faraday` 경로로 간접 의존하는 젬입니다.
`Gemfile`에 직접 명시되어 있지 않아 버전 제어가 되지 않는 상태였습니다.

#### 해결 방법

**1) `Gemfile`에 faraday 버전 명시**

```ruby
gem "faraday", "~> 2.14.1"
```

**2) 업데이트 실행**

```bash
bundle update faraday
```

**3) 변경 사항 커밋 & 푸시**

```bash
git add Gemfile Gemfile.lock
git commit -m "chore: update faraday to ~> 2.14.1 for security"
git push
```

#### 업데이트 내역

| 젬 | 이전 버전 | 업데이트 후 |
|---|---|---|
| `faraday` | 2.12.2 | 2.14.1 이상 |
| `faraday-net_http` | 3.4.0 | 3.4.2 |
| `logger` | 1.6.6 | 1.7.0 |

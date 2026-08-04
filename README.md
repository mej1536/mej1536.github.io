blog-nextjs

## 보안 취약점 점검 (pnpm audit)

GitHub의 **Security → Dependabot alerts**에서 취약점이 뜨면, 아래 순서로 로컬에서 확인하고 조치합니다.

```bash
cd blog
pnpm audit                 # 취약점 목록, 심각도, 패치 버전 확인
pnpm why <패키지명>          # 어떤 상위 패키지가 이 버전을 끌어오는지 확인
pnpm view <패키지명> versions   # override에 넣을 버전이 실제로 존재하는지 확인
```

- 직접 의존성(`package.json`의 `dependencies`/`devDependencies`)이면 해당 패키지 버전을 바로 올립니다.
- 하위(전이) 의존성이라 직접 버전을 올릴 수 없으면 `blog/pnpm-workspace.yaml`의 `overrides`에 버전을 고정합니다. 같은 패키지가 서로 다른 메이저 버전으로 여러 곳에 설치돼 있으면 `'부모패키지@범위>패키지명'` 형식으로 범위를 나눠 지정합니다.

  ```yaml
  overrides:
    postcss: ^8.5.5
    'minimatch@3>brace-expansion': 1.1.18
  ```

- **overrides는 `pnpm-workspace.yaml`에만 적어야 합니다.** pnpm 11부터 `package.json`의 `pnpm.overrides` 필드는 무시되며, 여기에 남겨두면 `pnpm install` 때마다 조용히 사라진 것처럼 보입니다.
- override는 버전을 고정하는 것이라, 시간이 지나 더 새로운 패치가 나와도 자동으로 올라가지 않습니다. 의존성을 업데이트할 때마다 `pnpm outdated`와 `pnpm why`로 override가 여전히 필요한 상태인지 다시 확인합니다.

수정 후에는 항상 재검증합니다.

```bash
pnpm install
pnpm audit    # 취약점 0건 확인
pnpm build    # 빌드 정상 확인
```

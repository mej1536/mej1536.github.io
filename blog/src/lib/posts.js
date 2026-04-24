import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

// 하위 폴더를 재귀적으로 탐색하여 모든 .md 파일 경로를 수집
function getAllMarkdownFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllMarkdownFiles(fullPath, fileList);
    } else if (entry.name.endsWith('.md')) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

// 파일 경로에서 slug 배열 생성 (예: posts/dev/hello-world.md → ['dev', 'hello-world'])
function getSlugFromPath(filePath) {
  const relativePath = path.relative(postsDirectory, filePath);
  const withoutExt = relativePath.replace(/\.md$/, '');
  return withoutExt.split(path.sep);
}

// 모든 게시물 목록 가져오기 (메인 화면용)
export function getSortedPostsData() {
  const files = getAllMarkdownFiles(postsDirectory);

  const allPostsData = files.map((filePath) => {
    const slug = getSlugFromPath(filePath);
    const category = slug.length > 1 ? slug[0] : null;
    const fileContents = fs.readFileSync(filePath, 'utf8');

    // gray-matter로 마크다운의 메타데이터(Frontmatter) 분석
    const matterResult = matter(fileContents);

    return {
      slug,
      category,
      ...matterResult.data,
    };
  });

  // 날짜 순으로 정렬
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1;
    return -1;
  });
}

// 모든 게시물의 slug 목록 가져오기 (정적 경로 생성용)
export function getAllPostSlugs() {
  const files = getAllMarkdownFiles(postsDirectory);
  return files.map((filePath) => ({
    slug: getSlugFromPath(filePath),
  }));
}

// 특정 게시물의 상세 내용 가져오기 (상세 화면용)
export async function getPostData(slug) {
  const fullPath = path.join(postsDirectory, ...slug) + '.md';
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const category = slug.length > 1 ? slug[0] : null;

  // 메타데이터 분석
  const matterResult = matter(fileContents);

  // remark를 사용해 마크다운 본문을 HTML로 변환
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    category,
    contentHtml,
    ...matterResult.data,
  };
}

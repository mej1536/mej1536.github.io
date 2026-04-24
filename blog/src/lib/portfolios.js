import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const portfoliosDirectory = path.join(process.cwd(), 'portfolios');

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

// 파일 경로에서 slug 배열 생성
function getSlugFromPath(filePath) {
  const relativePath = path.relative(portfoliosDirectory, filePath);
  const withoutExt = relativePath.replace(/\.md$/, '');
  return withoutExt.split(path.sep);
}

// 모든 포트폴리오 목록 가져오기
export function getSortedPortfoliosData() {
  const files = getAllMarkdownFiles(portfoliosDirectory);

  const allData = files.map((filePath) => {
    const slug = getSlugFromPath(filePath);
    const category = slug.length > 1 ? slug[0] : null;
    const fileContents = fs.readFileSync(filePath, 'utf8');

    const matterResult = matter(fileContents);

    return {
      slug,
      category,
      ...matterResult.data,
    };
  });

  // 날짜 순으로 정렬
  return allData.sort((a, b) => {
    if (a.date < b.date) return 1;
    return -1;
  });
}

// 모든 포트폴리오 slug 목록 (정적 경로 생성용)
export function getAllPortfolioSlugs() {
  const files = getAllMarkdownFiles(portfoliosDirectory);
  return files.map((filePath) => ({
    slug: getSlugFromPath(filePath),
  }));
}

// 특정 포트폴리오 상세 내용 가져오기
export async function getPortfolioData(slug) {
  const fullPath = path.join(portfoliosDirectory, ...slug) + '.md';
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const category = slug.length > 1 ? slug[0] : null;

  const matterResult = matter(fileContents);

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

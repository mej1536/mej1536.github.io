import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const portfoliosDirectory = path.join(process.cwd(), 'portfolios');

// 모든 포트폴리오 목록 가져오기
export function getSortedPortfoliosData() {
  const fileNames = fs.readdirSync(portfoliosDirectory);
  const allData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');

    const fullPath = path.join(portfoliosDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data,
    };
  });

  // 날짜 순으로 정렬
  return allData.sort((a, b) => {
    if (a.date < b.date) return 1;
    return -1;
  });
}

// 모든 포트폴리오 id 목록 (정적 경로 생성용)
export function getAllPortfolioIds() {
  const fileNames = fs.readdirSync(portfoliosDirectory);
  return fileNames.map((fileName) => ({
    params: {
      id: fileName.replace(/\.md$/, ''),
    },
  }));
}

// 특정 포트폴리오 상세 내용 가져오기
export async function getPortfolioData(id) {
  const fullPath = path.join(portfoliosDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

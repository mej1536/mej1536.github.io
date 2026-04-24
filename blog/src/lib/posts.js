import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

// 모든 게시물 목록 가져오기 (메인 화면용)
export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // 파일 이름에서 .md 제거해서 고유 주소(id)로 사용
    const id = fileName.replace(/\.md$/, '');

    // 마크다운 파일 읽기
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // gray-matter로 마크다운의 메타데이터(Frontmatter) 분석
    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data,
    };
  });

  // 날짜 순으로 정렬
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// 모든 게시물의 id(slug) 목록 가져오기 (정적 경로 생성용)
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

// 특정 게시물의 상세 내용 가져오기 (상세 화면용)
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // 메타데이터 분석
  const matterResult = matter(fileContents);

  // remark를 사용해 마크다운 본문을 HTML로 변환
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

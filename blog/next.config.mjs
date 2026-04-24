/** @type {import('next').NextConfig} */
const nextConfig = {
  // 결과물을 순수한 정적 파일로 내보내는 설정입니다.
  output: "export",

  // 정적 내보내기 시 next/image 기능을 사용하기 위한 설정입니다.
  images: {
    unoptimized: true,
  },

  // (선택사항) 깃허브 페이지 주소가 'username.github.io/레포지토리명' 형태라면
  // basePath: '/레포지토리명', 을 추가해야 이미지가 깨지지 않습니다.
  // 'username.github.io' 가 자체 주소라면 생략해도 됩니다.
  // 만약 최상위 주소(https://mej1536.github.io/)를 쓰실 예정이라면 basePath는 지워주셔도 됩니다.
  // basePath: "/blog",
};

export default nextConfig;

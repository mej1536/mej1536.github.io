import fs from "fs";
import path from "path";
import { promisify } from "util";
import cheerio from "cheerio";
// import SVGO from "svgo";

import { optimize } from "svgo";
// 사용 예시
const svgo = (svgString) => optimize(svgString);

// const svgo = new SVGO();
const DATA_PREFIX = "data:image/svg+xml;charset=US-ASCII,";

// 비동기 파일 읽기
const readFile = promisify(fs.readFile);

// SVG 내용을 URI로 인코딩
function encodeSVG(svgContent) {
  return encodeURIComponent(svgContent.replace(/[\t\n\r]/gim, " "));
}

// Cheerio를 사용하여 SVG 속성을 수정
function addVariables(svgContent) {
  const $ = cheerio.load(svgContent, { xmlMode: true });

  if ($("svg").length !== 1) {
    throw new Error(`Invalid SVG content.`);
  }

  $("svg").attr("fill", "#{$fillcolor}");
  $("[stroke]").attr("stroke", "#{$strokecolor}");

  return $.html("svg");
}

// Data URI 생성
async function createDataURI(filePath) {
  const svgContent = await readFile(filePath, "utf-8");

  const { data: optimizedSVG } = await svgo.optimize(svgContent);
  const encodedSVG = encodeSVG(addVariables(optimizedSVG));

  return `${DATA_PREFIX}${encodedSVG}`;
}

// Vite 플러그인으로 사용할 수 있는 함수
export default function svgToDataUriPlugin() {
  return {
    name: "svg-to-data-uri",
    transform: async (src, id) => {
      if (!id.endsWith(".svg")) return;

      const dataURI = await createDataURI(id);
      const functionName = path.basename(id, ".svg");

      // SCSS 함수로 반환
      return {
        code: `export const svg${functionName} = '${dataURI}';`,
        map: null, // 소스 맵을 사용하지 않음
      };
    },
  };
}

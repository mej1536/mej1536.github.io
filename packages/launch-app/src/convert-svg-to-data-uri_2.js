import fs from "fs";
import path from "path";

// URL 인코딩을 사용하지 않고 SVG에서 Sass 변수를 그대로 사용하는 함수
async function convertSvgToDataUri(filePath) {
  const svgContent = await fs.promises.readFile(filePath, "utf-8");

  // SVG 내에 fill과 stroke를 Sass 변수를 참조하는 플레이스홀더로 대체
  let modifiedSvgContent = svgContent.replace(/fill="[^"]*"/g, `fill="#{$fillcolor}"`).replace(/stroke="[^"]*"/g, `stroke="#{$strokecolor}"`);

  // 데이터를 그대로 반환 (URL 인코딩 사용하지 않음)
  return `data:image/svg+xml;charset=US-ASCII,${modifiedSvgContent}`;
}

// SVG 파일을 SCSS 파일로 변환하는 함수
async function convertSvgFilesToScss() {
  const iconsDir = path.resolve(__dirname, "src/assets/icons");
  const files = await fs.promises.readdir(iconsDir);

  let scssContent = "";

  for (const file of files) {
    if (file.endsWith(".svg")) {
      const filePath = path.join(iconsDir, file);
      const variableName = path.basename(file, ".svg");

      try {
        // SVG를 데이터 URI로 변환
        const dataUri = await convertSvgToDataUri(filePath);

        // SCSS 함수 생성
        scssContent += `@function sassvg-${variableName}($fillcolor, $strokecolor) {
          @return "data:image/svg+xml;charset=US-ASCII,<svg width='16' height='16' viewBox='0 0 16 16' fill='#{$fillcolor}' xmlns='http://www.w3.org/2000/svg'>${dataUri}</svg>";
        }\n`;
      } catch (error) {
        console.error(`Error converting SVG file ${file}:`, error);
      }
    }
  }

  // icons.scss 파일로 저장
  await fs.promises.writeFile(path.join(iconsDir, "icons.scss"), scssContent);
}

// convertSvgFilesToScss 함수를 외부에서 호출할 수 있도록 내보내기
export default async function startConversion() {
  await convertSvgFilesToScss();
}

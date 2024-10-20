import fs from "fs";
import path from "path";
import svgToDataUri from "mini-svg-data-uri";
import getColors from "get-svg-colors";

const svgFolder = "./src/svg-icons";
const cssOutput = "./src/output.scss";

fs.readdir(svgFolder, (err, files) => {
  if (err) throw err;

  let functionContent = "";

  files.forEach((file) => {
    const filePath = path.join(svgFolder, file);
    let svgContent = fs.readFileSync(filePath, "utf8");
    const colors = getColors(svgContent);
    const fillColor = colors.fills.length > 0 ? colors.fills[0].hex() : "#000000"; // 기본 색상은 검정색
    const strokeColor = colors.strokes.length > 0 ? colors.strokes[0].hex() : "#000000"; // 기본 색상은 검정색

    // SVG 내용에서 fill과 stroke 속성을 변수로 변경
    svgContent = svgContent.replace(/fill="[^"]*"/g, 'fill="{$fill-color}"');
    svgContent = svgContent.replace(/stroke="[^"]*"/g, 'stroke="{$stroke-color}"');

    // Properly encode the SVG content with placeholders
    const encodedSvgContent = encodeURIComponent(svgContent)
      .replace(/%7B%24fill-color%7D/g, "#{$fill-color}")
      .replace(/%7B%24stroke-color%7D/g, "#{$stroke-color}")
      .replace(/%3C/g, "%3c")
      .replace(/%3E/g, "%3e");

    const functionName = `sassvg-${path.basename(file, ".svg")}`;

    functionContent += `@function ${functionName}($fill-color: ${fillColor}, $stroke-color: ${strokeColor}) {
      @return "data:image/svg+xml,${encodedSvgContent}";
    }\n`;
  });

  fs.writeFileSync(cssOutput, functionContent);
});

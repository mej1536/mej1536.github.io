import fs from "fs";
import path from "path";
import svgToDataUri from "mini-svg-data-uri";
import getColors from "get-svg-colors";

const svgFolder = "./src/svg-icons";
const cssOutput = "./src/output.scss";

fs.readdir(svgFolder, (err, files) => {
  if (err) throw err;

  let mixinContent = "";

  files.forEach((file) => {
    const filePath = path.join(svgFolder, file);
    let svgContent = fs.readFileSync(filePath, "utf8");
    const colors = getColors(svgContent);
    const fillColor = colors.fills.length > 0 ? colors.fills[0].hex() : "#000000"; // 기본 색상은 검정색
    const strokeColor = colors.strokes.length > 0 ? colors.strokes[0].hex() : "#000000"; // 기본 색상은 검정색
    const dataUri = svgToDataUri(svgContent);
    const mixinName = `svg-${path.basename(file, ".svg")}`;

    mixinContent += `@mixin ${mixinName}($fill-color: ${fillColor}, $stroke-color: ${strokeColor}) {
      background-image: url("${dataUri}");
      fill: $fill-color;
      stroke: $stroke-color;
    }\n`;
  });

  fs.writeFileSync(cssOutput, mixinContent);
});

import fs from "fs";
import path from "path";
import svgToDataUri from "mini-svg-data-uri";

const svgFolder = "./src/svg-icons";
const cssOutput = "./src/output.scss";

fs.readdir(svgFolder, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const filePath = path.join(svgFolder, file);
    const svgContent = fs.readFileSync(filePath, "utf8");
    const dataUri = svgToDataUri(svgContent);
    // const cssContent = `.icon-${path.basename(file, ".svg")} { background-image: url('${dataUri}'); }\n`;
    const cssContent = `$svg-${path.basename(file, ".svg")}: \"${dataUri}\";\n`;

    fs.appendFileSync(cssOutput, cssContent);
  });
});

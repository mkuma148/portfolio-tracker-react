const fs = require("fs");
const path = require("path");
const svgSprite = require("svg-sprite");

const config = {
  mode: {
    symbol: {
      // Create a symbol sprite
      dest: ".",           // Output directory
      sprite: "svg-sprite.svg", // Sprite file name
    },
  },
};

const sprite = new svgSprite(config);

const inputDir = path.resolve(__dirname, "../src/assets/svg-icons");
const outputDir = path.resolve(__dirname, "../public");

// Read all SVG files from the input directory
fs.readdirSync(inputDir).forEach((file) => {
  if (file.endsWith(".svg")) {
    sprite.add(
      path.join(inputDir, file),
      null,
      fs.readFileSync(path.join(inputDir, file), "utf-8")
    );
  }
});

// Compile the sprite and write it to the output directory
sprite.compile((error, result) => {
  if (error) {
    console.error("Error generating SVG sprite:", error);
  } else {
    const outputFile = path.join(outputDir, "svg-sprite.svg");
    fs.writeFileSync(outputFile, result.symbol.sprite.contents);
  }
});

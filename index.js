#!/usr/bin/env node

const gettextParser = require("gettext-parser");
const fs = require("fs");
const path = require("path");
const colors = require("colors");

console.log(colors.dim("Compile MO files from PO files..."));

const targetDir = path.resolve(process.argv.slice(2)[0]);
compilePoFiles(targetDir);

function compilePoFiles(dir) {
  fs.readdir(dir, function(err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    files.forEach(filename => {
      compilePoFile(path.join(dir, filename));
    });
  });
}

function compilePoFile(sourcePath) {
  fs.stat(sourcePath, function(error, stat) {
    if (error) {
      console.error("Error stating file.", error);
      return;
    }

    if (!stat.isFile()) return;

    const { dir, ext, name, base } = path.parse(sourcePath);
    
    if (ext !== ".po") return;

    const targetFilename = name + ".mo";

    fs.readFile(sourcePath, (error, input) => {
      if (error) {
        console.error("Error reading file.", error);
        return;
      }

      const po = gettextParser.po.parse(input);
      const output = gettextParser.mo.compile(po);

      fs.writeFile(path.join(dir, targetFilename), output, error => {
        if (error) {
          console.error("Error writing file.", error);
          return;
        }

        console.log(
          colors.yellow("[" + dir + "] ") +
            colors.cyan(base) +
            colors.dim(" => ") +
            colors.green(targetFilename)
        );
      });
    });
  });
}

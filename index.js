#!/usr/bin/env node

var gettextParser = require("gettext-parser");
var fs = require("fs");
var path = require("path");
var colors = require("colors");

console.log( colors.dim('Compile MO files from PO files...') );

var targetDir = path.resolve(process.argv.slice(2).join('')) + '/';

fs.readdir( targetDir, function( err, files ) {
  if( err ) {
    console.error( "Could not list the directory.", err );
    process.exit( 1 );
  }

  files.forEach( function( file, index ) {
    var fromPath = path.join( targetDir, file );

    fs.stat( fromPath, function( error, stat ) {
      if( error ) {
        console.error( "Error stating file.", error );
        return;
      }

      if( stat.isFile() ) {
        var f = path.parse(file);

        if (f.ext == '.po') {
          var target = f.name+'.mo';

          console.log( colors.yellow('[' + targetDir +  '] ') + colors.cyan(f.base) + colors.dim(' => ') + colors.green(target) );

          var input = fs.readFileSync(targetDir + f.base);
          var po = gettextParser.po.parse(input);
          var output = gettextParser.mo.compile(po);
          fs.writeFileSync(targetDir + target, output);

        }


      }

    } );
  } );
} );




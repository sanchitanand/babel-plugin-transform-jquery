import * as babel from 'babel-core';
import jqtransform from './transform.js';
import {createInterface} from 'readline';
import fs from 'fs';

var fileName = process.argv[2];

fs.readFile(fileName, function(err, data) {
    if(err) throw err;

    // convert from a buffer to a string
    var src = data.toString();

    // use our plugin to transform the source
    var out = babel.transform(src,{
        plugins:[jqtransform]
    });
    process.stdout.write(out.code + "\n");
    process.exit(0);
});

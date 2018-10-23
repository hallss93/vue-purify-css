#!/usr/bin/env node
const path = require('path')
const [, , ...args] = process.argv
try {
    const src = path.resolve(args[0]) || 'src'
    var data = {};
    require('./core')(path.resolve(src), function (filename, content) {
        data[filename] = content;
    }, function (err) {
        throw err;
    });

} catch (err) {
    console.log(err)
    console.log("Especifique a pasta, ex: vpc src")
}


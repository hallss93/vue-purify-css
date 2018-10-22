#!/usr/bin/env node

const [, , ...args] = process.argv
const purifycss = require("purify-css")
const path = require('path')
const fs = require('fs');
const CleanCSS = require('clean-css');
try {
    const src = path.resolve(args[0]) || 'src'
    var data = {};
    readFiles(path.resolve(src), function (filename, content) {
        data[filename] = content;
    }, function (err) {
        throw err;
    });

} catch (err) {
    console.log("Especifique a pasta, ex: vpc src")
}

function readFiles(dirname, onFileContent, onError) {
    var dirSync = function (dir, filelist) {
        var files = fs.readdirSync(dir);
        filelist = filelist || [];
        files.forEach(function (file) {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                filelist = dirSync(path.join(dir, file) + '/', filelist);
            }
            else {
                filelist.push(path.join(dir, file));
            }
        });
        return filelist;
    };
    dirSync(dirname)
        .forEach(function (arquivo) {
            if (arquivo.match(/.vue/g))
                fs.readFile(arquivo, 'utf-8', function (err, content) {
                    let html = content.split("<template>")[1].split("</template>")[0]
                    let css = content.split("<style scoped>")[1].split("</style>")[0]
                    
                    var output = new CleanCSS({
                        level: {
                            1: { specialComments: 0 },
                            2: { removeDuplicates: true }
                        }
                    }).minify(css);
                    purifycss(html, output.styles, {
                        output: (arquivo.replace(".vue", "")) + ".css",
                    })
                    if (err) {
                        onError(err);
                        return;
                    }
                    onFileContent(arquivo, content);
                });
        });
}

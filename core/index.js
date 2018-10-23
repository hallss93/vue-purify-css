const purifycss = require("purify-css")
const path = require('path')
const fs = require('fs');
const CleanCSS = require('clean-css');
var term = require( 'terminal-kit' ).terminal ;

const readFiles =  function (dirname, onFileContent, onError) {
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
            if (arquivo.match(/(.*?).vue/g))
                fs.readFile(arquivo, 'utf-8', function (err, content) {
                    if(content.split("<style scoped>").length>1 && content.split("<template>").length>1){
                        let html = content.split("<template>")[1].split("</template>")[0]
                        let css = content.split("<style scoped>")[1].split("</style>")[0]
                        
                        term.bold.magenta(`Working on file: `);term.cyan(arquivo+`\n`)
                        try{
                            var output = new CleanCSS({
                                level: {
                                    1: { specialComments: 0 },
                                    2: { removeDuplicates: true }
                                }
                            }).minify(css);
                            purifycss(html, output.styles, {
                                output: arquivo.replace(/.vue/g, ".css"),
                            })
                            if (err) {
                                term.bold.red(`Error on file above!\n`)
                                onError(err);
                                return;
                            }
                            term.bold.green(`Ok!\n`)
                            onFileContent(arquivo, content);
                        }catch(e){
                            term.bold.red(`Error on file above!\n`)
                        }
                    }
                });
        });
}
module.exports= readFiles
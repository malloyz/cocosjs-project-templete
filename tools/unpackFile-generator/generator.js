/**
 * Created by malloyzhu on 2016/7/20.
 */

var util = require('../util/Util.js');
var path = require('path');
var fs = require('fs');

var currentDir = __dirname;
var codeTemplatePath = path.join(currentDir, "CodeTemplate.js");
var filePath = process.argv[2];

function generatorFile() {
    var codeTemplate = fs.readFileSync(codeTemplatePath, "utf-8");
    var reg = new RegExp("#.*?#", "g");
    var fileData = codeTemplate.replace(reg, util.getFullTime());
    try {
        fs.writeFileSync(path.join(filePath, "UnpackInfo.js"), fileData);
        console.log(fileData + "\n");
        console.log(filePath + " 生成成功");
    } catch (e) {
        console.log(e);
    }
};

if (module == require.main) {
    generatorFile();
};

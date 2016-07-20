/**
 * Created by malloyzhu on 2016/7/20.
 */

var readline = require('readline');
var codeGenerator = require('../util/CodeGenerator.js');
var util = require('../util/Util.js');
var path = require('path');

function t() {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("请输入文件名：", function (fileName) {
        var codeTemplateFileName = path.join(path.dirname(__filename), 'CodeTemplate.js');
        var ruleList = [{"regular": "&.*?&", "replaceString": util.getFullDate()}, {
            "regular": "#.*?#",
            "replaceString": fileName
        }, {
            "regular": "%.*?%",
            "replaceString": util.getUserName()
        }];
        var basePath = path.dirname(__filename);
        codeGenerator.generator(basePath, codeTemplateFileName, fileName, ruleList);
        rl.close();
    });
};
t();
/*
 * @Author: mikey.zhaopeng
 * @Date:   2016-07-29 15:57:29
 * @Last Modified by: Noscere
 * @Last Modified time: 2022-10-13 22:38:34
 */

var vscode = require('vscode');

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

function activate(context) {
    var config = vscode.workspace.getConfiguration('fileheader');
    console.log('"vscode-fileheader" is now active!');
    var disposable = vscode.commands.registerCommand('extension.fileheader', function () {
        var editor = vscode.editor || vscode.window.activeTextEditor;

        var languageId = editor.document.languageId || null;
        var configTpl = null;

        switch(languageId) {
            case 'shellscript':
            case 'python':
            case 'perl':
            case 'perl6':
                // shell script uses # for comments
                // use the shell.tpl template
                configTpl = config.shell.tpl;
            break;
                // html uses <!-- --> comment blocks
            case 'html':
                configTpl = config.html.tpl;
            break;
                // visual basic uses ' comments
            case 'vb':
                configTpl = config.vb.tpl;
            break;

            default:
                 // defaults to existing C-style
                 // implementation template
                 configTpl = config.tpl;
        }

        /*
        * @Author: huangyuan
        * @Date: 2017-02-28 17:51:35
        * @Last Modified by:   huangyuan413026@163.com
        * @Last Modified time: 2017-02-28 17:51:35
        * @description: 在当前行插入,而非在首行插入
        */
                
        var line = editor.selection.active.line;
        editor.edit(function (editBuilder) {
            var time = new Date().format("yyyy-MM-dd hh:mm:ss");
            var data = {
                author: config.Author,
                email: config.Email,
                lastModifiedBy: config.LastModifiedBy,
                createTime: time,
                updateTime: time
            }
            try {
                var tpl = new template(configTpl).render(data);;
                editBuilder.insert(new vscode.Position(line, 0), tpl);
            } catch (error) {
                console.error(error);
            }

        });

    });

    context.subscriptions.push(disposable);
    vscode.workspace.onDidSaveTextDocument(function (file) {
        setTimeout(function () {
            try {
                var f = file;
                var editor = vscode.editor || vscode.window.activeTextEditor;
                var document = editor.document;
                var isReturn = false;
                var authorRange = null;
                var authorText = null;
                var lastTimeRange = null;
                var lastTimeText = null;
                var diff = -1;
                var lineCount = document.lineCount;
                var comment = false;

                var prefix = null;
                var commentStartsWith = null;
                var commentEndsWith = null;
                switch(document.languageId) {
                    // Catering for differing comment characters
                    // shell scripts, python, perl, use hash
                    // # there are no comment blocks
                    case 'shellscript':
                    case 'perl':
                    case 'perl6':
                    case 'python':
                        commentStartsWith="#";
                        prefix = "# ";
                    break;
                    // html uses
                    // <!-- comments block
                    //    - like this
                    //    -->
                    case 'html':
                        commentStartsWith="<!--";
                        commentEndsWith="-->";
                        prefix = "  - ";
                    break;
                    // visual basic
                    // ' inline comments,
                    // ' no comment blocks
                    case 'vb':
                        commentStartsWith="'";
                        prefix="' ";
                    break;
                    // Use existing behaviour with C-style comment
                     /* comments block
                      * like this
                      */
                    default:
                        commentStartsWith="/*";
                        commentEndsWith="*/";
                        prefix = " * ";
                }

                for (var i = 0; i < lineCount; i++) {
                    var linetAt = document.lineAt(i);
                    
                    var lineTextOriginal = linetAt.text;
                    var line = linetAt.text;
                    line = line.trim();
                    if (line.startsWith(commentStartsWith) && ((!commentEndsWith) || !line.endsWith(commentEndsWith))) {//是否以 /* 开头
                        comment = true;//表示开始进入注释
                    } else if (comment) {
                        if ((commentEndsWith) && line.endsWith(commentEndsWith)) {
                            comment = false;//结束注释
                        }
                        var range = linetAt.range;
                        if (line.indexOf('@Last\ Modified\ by') > -1) {//表示是修改人
                            var replaceAuthorReg = /^(.*?)(@Last Modified by:)(\s*)(\S*)$/;
                            authorRange = range;
                            if (replaceAuthorReg.test(lineTextOriginal)) {
                                authorText = lineTextOriginal.replace(replaceAuthorReg, function(match, p1, p2, p3){
                                    return p1+p2+p3+config.LastModifiedBy;
                                });
                            } else {
                                authorText=prefix + '@Last Modified by: ' + config.LastModifiedBy;
                            }
                        } else if (line.indexOf('@Last\ Modified\ time') > -1) {//最后修改时间
                            var time = line.replace('@Last\ Modified\ time:', '').replace('*', '');
                            var oldTime = new Date(time);
                            var curTime = new Date();
                            var diff = (curTime - oldTime) / 1000;
                            var replaceTimeReg = /^(.*?)(@Last Modified time:)(\s*)(.*)$/;
                            lastTimeRange = range;
                            var currTimeFormate = curTime.format("yyyy-MM-dd hh:mm:ss");
                            if (replaceTimeReg.test(lineTextOriginal)) {
                                lastTimeText = lineTextOriginal.replace(replaceTimeReg, function(match, p1, p2, p3){
                                    return p1+p2+p3+currTimeFormate;
                                });
                            } else {
                                lastTimeText=prefix + '@Last Modified time: ' + currTimeFormate;
                            }
                        }
                        if (!comment) {
                            break;//结束
                        }
                    }
                }
                if ((authorRange != null) && (lastTimeRange != null) && (diff > 20)) {
                    setTimeout(function () {
                        editor.edit(function (edit) {
                            edit.replace(authorRange, authorText);
                            edit.replace(lastTimeRange, lastTimeText);
                        });
                        document.save();
                    }, 200);
                }

            } catch (error) {
                console.error(error);
            }
        }, 200);
    });
}

function getConfiguration() {
    return vscode.workspace.getConfiguration('mocha');
}



function getLineText(lineNum, editor) {
    const document = editor.document;
    if (lineNum >= document.lineCount) {
        return '';
    }
    const start = new vscode.Position(lineNum, 0);
    const lastLine = document.lineAt(lineNum);
    const end = new vscode.Position(lineNum, lastLine.text.length);
    const range = new vscode.Range(start, end);
    var t = document.getText(range);
    return t;
}

function replaceLineText(lineNum, text, editor) {
    const document = editor.document;
    if (lineNum >= document.lineCount) {
        return '';
    }
    const start = new vscode.Position(lineNum, 0);
    const lastLine = document.lineAt(lineNum);
    const end = new vscode.Position(lineNum, lastLine.text.length);
    const range = new vscode.Range(start, end);
    editor.edit(function (edit) {
        edit.replace(range, text);
    });

}



/**
 * template engine
 */
function template(tpl) {
    var
        fn,
        match,
        code = ['var r=[];\nvar _html = function (str) { return str.replace(/&/g, \'&amp;\').replace(/"/g, \'&quot;\').replace(/\'/g, \'&#39;\').replace(/</g, \'&lt;\').replace(/>/g, \'&gt;\'); };'],
        re = /\{\s*([a-zA-Z\.\_0-9()]+)(\s*\|\s*safe)?\s*\}/m,
        addLine = function (text) {
            code.push('r.push(\'' + text.replace(/\'/g, '\\\'').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '\');');
        };
    while (match = re.exec(tpl)) {
        if (match.index > 0) {
            addLine(tpl.slice(0, match.index));
        }
        if (match[2]) {
            code.push('r.push(String(this.' + match[1] + '));');
        }
        else {
            code.push('r.push(_html(String(this.' + match[1] + ')));');
        }
        tpl = tpl.substring(match.index + match[0].length);
    }
    addLine(tpl);
    code.push('return r.join(\'\');');
    fn = new Function(code.join('\n'));
    this.render = function (model) {
        return fn.apply(model);
    };
}


exports.activate = activate;

function deactivate() { }
exports.deactivate = deactivate;

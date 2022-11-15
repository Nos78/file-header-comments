/*
 * @Author: mikey.zhaopeng
 * @Date:   2016-07-29 15:57:29
 * @Last Modified by: Noscere
 * @Last Modified time: 2022-11-15 06:15:56.517
 */

var vscode = require('vscode');
const fileheader = require('./fileheader');
const customErrors = require('application-errors');

Date.prototype.format = fileheader.dateFormat;

function getConfig() {
    var config = vscode.workspace.getConfiguration('fileheader');
    if(config.Author) {
        // Sanity check - shouldn't be null, but you never know
        if(config.LastModifiedBy) {
            if(config.Author != 'Someone' && config.LastModifiedBy == 'Someone') {
                // If the author is set, but the last modified isn't...
                config.lastModifiedBy = config.Author;
            }
        } // if config.LastModifiedBy
        else {
            // if there is no Last Modified name specified
            // then use the author name instead
            config.lastModifiedBy = config.Author;
        }
    }
    return config;
}

function activate(context) {
    console.log('"file-header-comments" is now active!');

    var disposable = vscode.commands.registerCommand('extension.fileheader', async function () {
        var config = getConfig();
        if (!config) {
            throw new customErrors.ObjectError(config, "vscode.WorkspaceConfiguration", "file-header-comments.registerCommand() - unexpected undefined object - getConfig() return value was undefined");
        }
        var editor = vscode.editor || vscode.window.activeTextEditor;

        var languageId = editor.document.languageId || null;
        var templates = config.templates;
        var configTpl = null;

        switch(languageId) {
            case 'shellscript':
            case 'python':
            case 'perl':
            case 'perl6':
                // shell script uses # for comments
                // use the shell.tpl template
                configTpl = templates.shellScript;
            break;
                // html uses <!-- --> comment blocks
            case 'html':
                configTpl = templates.html;
            break;
                // visual basic uses ' comments
            case 'vb':
                configTpl = templates.visualBasic;
            break;

            default:
                 // defaults to existing C-style
                 // implementation template
                 configTpl = templates.c;
        }

        /*
        * @Author: huangyuan
        * @Date: 2017-02-28 17:51:35
        * @Last Modified by:   huangyuan413026@163.com
        * @Last Modified time: 2017-02-28 17:51:35
        * @description: Insert at the current row instead of the first row
        */

        var description = "";
        var defaultDescription = vscode.window.activeTextEditor.document.uri.toString();
        if(config.renderingOptions.description) {
            // prompt the user for a description
            description = await vscode.window.showInputBox({
                                            "title": "File Header Description",
                                            "value": defaultDescription,
                                            "prompt": "Enter a description for this file. The filename and window title is the default value.\nEntering no description will disable the @Description field for this file.",
                                            "ignoreFocusOut": true })
        }
        if(!description) {
            description = defaultDescription;
        }
        var line = editor.selection.active.line;
        editor.edit(function (editBuilder) {
            var time = new Date().format(config.dateFormat);
            var data = {
                author: config.Author,
                email: config.Email,
                lastModifiedBy: lastModifiedBy, // use local variable assigned above
                createTime: time,
                updateTime: time,
                description: description
            }
            // Pre-process the template for any disabled elements
            configTpl = fileheader.preprocess(configTpl, config.renderingOptions);
            // prompt user for any additional information

            // do the insert
            try {
                var tpl = new fileheader.template(configTpl).render(data);;
                editBuilder.insert(new vscode.Position(line, 0), tpl);
            } catch (error) {
                console.error(error);
            }
        }); // function editBuilder
    }); // registerCommand

    context.subscriptions.push(disposable);
    vscode.workspace.onDidSaveTextDocument(function (file) {
        var config = getConfig();
        if (!config) {
            throw new customErrors.ObjectError(config, "vscode.WorkspaceConfiguration", "file-header-comments.onDidSaveTextDocument() : unexpected undefined object - getConfig() return value was undefined");
        }

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
                    if (line.startsWith(commentStartsWith) && ((!commentEndsWith) || !line.endsWith(commentEndsWith))) {// Does it start with comment character?
                        comment = true;// start of entering comments
                    } else if (comment) {
                        if ((commentEndsWith) && line.endsWith(commentEndsWith)) {
                            comment = false;//end comment
                        }
                        var range = linetAt.range;
                        if (line.indexOf('@Last\ Modified\ by') > -1) {//Indicates the editor name
                            var replaceAuthorReg = /^(.*?)(@Last Modified by:)(\s*)(\S*)$/;
                            authorRange = range;
                            if (replaceAuthorReg.test(lineTextOriginal)) {
                                authorText = fileheader.replaceSubstringInLine(lineTextOriginal, replaceAuthorReg, config.LastModifiedBy);
                            } else {
                                authorText = fileheader.constructCommentLine('@Last Modified by: ', config.LastModifiedBy, prefix);
                            }
                        } else if (line.indexOf('@Last\ Modified\ time') > -1) {//Last modified at time
                            var time = line.replace('@Last\ Modified\ time:', '').replace('*', '');
                            var oldTime = new Date(time);
                            var curTime = new Date();
                            var diff = (curTime - oldTime) / 1000;
                            var replaceTimeReg = /^(.*?)(@Last Modified time:)(\s*)(.*)$/;
                            lastTimeRange = range;
                            var currTimeFormate = curTime.format(config.dateFormat);
                            if (replaceTimeReg.test(lineTextOriginal)) {
                                lastTimeText = fileheader.replaceSubstringInLine(lineTextOriginal, replaceTimeReg, currTimeFormate)
                            } else {
                                lastTimeText = fileheader.constructCommentLine('@Last Modified time: ', currTimeFormate, prefix);
                            }
                        }
                        if (!comment) {
                            break;//Finish
                        }
                    }
                }// end for
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
    }); // onDidSaveTextDocument
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


exports.activate = activate;

function deactivate() { }
exports.deactivate = deactivate;

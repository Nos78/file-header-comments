/*
 * @Author: Noscere 
 * @Email: noscere1978@gmail.com
 * @Date: 2022-10-17 17:21:51 
 * @Last Modified by: Noscere
 * @Last Modified time: 2022-11-15 04:46:09.327
 * @Description: Collection of functions that will populate
 * file comment headers.
 */
const name = "fileheader";


exports.dateFormat = function (format) {
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

/**
 * @description removes any disabled fields from a given `tpl`, specified by `opts`, and returns the pre-processed tpl.
 * @param {string} tpl
 * @param {JSON} opts
 * @return {string} pre-processed template
 */
function preprocess(tpl, opts) {
    // Check passed parameters
    if(!tpl) {
        // no template to process!
        console.error(`${name}.preprocess(tpl, opts) tpl == null`);
        return tpl;
    }
    if(!opts) {
        // no options to process with!
        console.error(`${name}.preprocess(tpl, opts) opts == null`);
        return tpl;
    }
    // process template, filtering out the opts.<tag>=false lines
    // New opts are automatically pre-processed here, no need to manually add
    // new ones to the list - NOTE: the name needs to be the same as the text
    tpl = tpl.split('\n').filter(function(line){
        let include = true;
        for (var i = 0;  i < opts.length; i++) {
            include = include &&
                ((line.indexOf("@" + opts[i].name + ":") == -1) || (opts[i]));
        }
        return include;
    }).join('\n');
    // Return our processed template
    return tpl;
}

function replaceSubstringInLine(line, substringRegex, newText) {
    var newLine = line.replace(substringRegex, function(match, p1, p2, p3){
        return p1 + p2 + p3 + newText;
    });
    return newLine;   
}

function constructCommentLine(fieldLabel, fieldText, linePrefix = "", lineSuffix = "") {
    if(!fieldLabel) {
        fieldLabel = "";
    }
    if(!fieldText) {
        fieldText = "";
    }
    if(!linePrefix) {
        linePrefix = "";
    }
    if(!lineSuffix) {
        lineSuffix = "";
    }
    var populatedText = linePrefix + fieldLabel + fieldText + lineSuffix;
    return populatedText;
}


exports.template = template;
exports.preprocess = preprocess;
exports.replaceSubstringInLine = replaceSubstringInLine;
exports.constructCommentLine = constructCommentLine;

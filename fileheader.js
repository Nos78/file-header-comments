/*
 * @Author: Noscere 
 * @Email: noscere1978@gmail.com
 * @Date: 2022-10-17 17:21:51 
 * @Last Modified by: Noscere
 * @Last Modified time: 2022-10-17 18:54:26
 * @Description: Collection of functions that will populate
 * file comment headers.
 */

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


function replaceSubstringInLine(line, substringRegex, newText) {
    var newLine = line.replace(substringRegex, function(match, p1, p2, p3){
        return p1 + p2 + p3 + newText;
    });
    return newLine;   
}

function constructCommentLine(fieldLabel, fieldText, linePrefix = "", lineSuffix = "") {
    
    var populatedText = linePrefix + fieldLabel + fieldText + lineSuffix;
    return populatedText;
                                
}


exports.template = template;
exports.replaceSubstringInLine = replaceSubstringInLine;
exports.constructCommentLine = constructCommentLine;

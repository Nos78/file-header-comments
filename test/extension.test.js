/*
 * @Author: Noscere 
 * @Email: noscere1978@gmail.com
 * @Date: 2022-10-18 18:57:02
 * @Last Modified by:   Noscere 
 * @Last Modified time: 2022-10-18 18:57:02
 * @Description: Unit test file to test the extension logic. Much of the
 * tests will exercise the functionality of the fileheader module, since
 * this library contains most (if not all) of the header manipulation
 * logic.
 */

/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
var assert = require('assert');
const { setgroups, off } = require('process');

// Include the fileheader module, the target of this unit test file
const fileheader = require('../fileheader');
const moduleName = "fileheader";

// Configure the date format
Date.prototype.format = fileheader.dateFormat;

// The name of the extension. This should match the name in package.json
const extensionName = 'file-header-comments';
const extensionConfigPropertyName = 'fileheader';

// Load the package.json definition into a const
const package = require('../package.json');

// Configure automated test numbering
// At the start of each test, increment this
// in assert messages, put the number
var testNumber = 0;

// Define some test data, simulating the data that would otherwise
// be obtained and given to the fileheader library by extension.js
//
// testData json object will contain all the data relevant to this
// unit test module.
//   .config: json object whose fields should match those defined
//     in package.json fileheader.*
//   .dateFormat: this field specifies the date format for any
//     date and time objects we create
const testData = {
    config: {
        Author: "Someone",
        Email: "someone@example.com",
        LastModifiedBy: "Someone",
        templates: {
            c: "/*\r\n * @Author: {author} \r\n * @Email: {email}\r\n * @Date: {createTime} \r\n * @Last Modified by:   {lastModifiedBy} \r\n * @Last Modified time: {updateTime}\r\n * @Description: Description\r\n */\r\n",
            shellScript: "# @Author: {author}\r\n# @Email: {email}\r\n# @Date: {createTime}\r\n# @Last Modified by:   {lastModifiedBy}\r\n# @Last Modified time: {updateTime}\r\n# @Description: Description\r\n",
            html: "<!-- @Author: {author}\r\n   - @Email: {email}\r\n   - @Date: {createTime}\r\n   - @Last Modified by:   {lastModifiedBy}\r\n   - @Last Modified time: {updateTime}\r\n   - @Description: Description\r\n */\r\n   -->\r\n",
            visualBasic: "' @Author: {author}\r\n' @Email: {email}\r\n' @Date: {createTime}\r\n' @Last Modified by:   {lastModifiedBy}\r\n' @Last Modified time: {updateTime}\r\n' @Description: Description\r\n"
        },
        dateFormat: "yyyy-MM-dd hh:mm:ss"
    }
};


function ok(expression, message) {
    if(!expression) throw new Error(message);
    return true;
}

// Defines a Mocha test suite to group tests of similar kind together
suite(`${moduleName} test suite`, function() {
    setup(function() {
        // Set up test environment

        // Some sanity checking for the module's simulated data
        ok(testData, `${extensionName} testData is undefined!`);
        ok(testData.config, `${extensionName} config is undefined!`);
        ok(testData.config.dateFormat, `${extensionName} dateFormat is undefined!`);
    });

    test(`1. ${extensionName} - package.json, config properties: author details`, function() {
        testNumber = 1;

        // Test property, author details, default & type - not checking descriptions
        var properties = package.contributes.configuration.properties;
        /* package.json configuration settings:
           Each property has a type, default, & description
             fileheader.Author
             fileheader.LastModifiedBy
             fileheader.Email
             fileheader.templates.c html visualBasic shellScript
        */
        // properties[`${extensionConfigPropertyName}.Author`].type
        assert.strictEqual(properties[`${extensionConfigPropertyName}.Author`].default, testData.config.Author, `Test ${testNumber}.1 assertion failed`);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.Author`].type, "string", `Test ${testNumber}.2 assertion failed`);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.Email`].default, testData.config.Email, `Test ${testNumber}.3 assertion failed`);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.Email`].type, "string", `Test ${testNumber}.4 assertion failed`);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.LastModifiedBy`].default, testData.config.LastModifiedBy `Test ${testNumber}.5 assertion failed`);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.LastModifiedBy`].type, "string", `Test ${testNumber}.6 assertion failed`);
    });

    test(`2. ${extensionName} - package.json, config properties: templates`, function() {
        testNumber = 2;
        // Test property, templates groups, default & type only
        var properties = package.contributes.configuration.properties;
        /* package.json configuration settings:
           Each property has a type, default, & description:
             fileheader.templates.c
             fileheader.templates.html
             fileheader.templates.shellScript
             fileheader.templates.visualBasic
        */
        // properties[`${extensionConfigPropertyName}.templates.c`].default
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.shellScript`].default, testData.config.templates.shellScript, `Test ${testNumber}.1 assertion failed`);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.shellScript`].type, "string", `Test ${testNumber}.2 assertion failed`);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.visualBasic`].default, testData.config.templates.visualBasic, `Test ${testNumber}.3 assertion failed`);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.visualBasic`].type, "string", `Test ${testNumber}.4 assertion failed`);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.html`].default, testData.config.templates.html, `Test ${testNumber}.5 assertion failed`);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.html`].type, "string", `Test ${testNumber}.6 assertion failed`);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.c`].default, testData.config.templates.c, `Test ${testNumber}.7 assertion failed`);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.c`].type, "string", `Test ${testNumber}.8 assertion failed`);
    });

    test(`3. ${extensionName} - package.json, config properties: date format`, function() {
        testNumber = 3;
        var properties = package.contributes.configuration.properties;
        assert.strictEqual(properties[`${extensionConfigPropertyName}.dateFormat`].type, "string", `Test ${testNumber}.1 assertion failed`);
        var dateFormat = properties[`${extensionConfigPropertyName}.dateFormat`].default;
        assert.strictEqual(dateFormat, testData.config.dateFormat, `Test ${testNumber}.2 assertion failed`);
    });

    test(`4. Module: ${moduleName} - function: template()`, function() {
        testNumber = 4;
        // Function under test
        // template(tpl)

        // Get the properties
        var properties = package.contributes.configuration.properties;
        // Get a C-Style template to test with from the properties
        var configTpl = properties[`${extensionConfigPropertyName}.templates.c`].default;

        // Get some data to populate template with
        var config = testData.config;
        var dateFormat = config.dateFormat;
        var time = new Date().format(dateFormat);
        var data = {
            author: config.Author,
            email: config.Email,
            lastModifiedBy: config.LastModifiedBy, // use local variable assigned above
            createTime: time,
            updateTime: time
        };

        // Construct the expected template:
        newLine="\r\n";
        commentStart="/*";
        commentEnd=" */";
        linePrefix=" * ";
        /* c-style rendered template: 
       "/*\r\n
         * @Author: {author} \r\n
         * @Email: {email}\r\n
         * @Date: {createTime} \r\n
         * @Last Modified by:   {lastModifiedBy} \r\n
         * @Last Modified time: {updateTime}\r\n
         * @Description: Description\r\n
         \r\n*/
        expectedTpl = commentStart + newLine +
            linePrefix + "@Author: " + config.Author + " " + newLine +
            linePrefix + "@Email: " + config.Email + newLine +
            linePrefix + "@Date: " + time + " " + newLine +
            linePrefix + "@Last Modified by:   " + config.LastModifiedBy + " " + newLine +
            linePrefix + "@Last Modified time: " + time + newLine +
            linePrefix + "@Description: " + "Description" + newLine +
            commentEnd + newLine;
        // Call the template engine to render a populated template
        var templateObject = new fileheader.template(configTpl);
        // Test the return value (should be an object)
        var populatedTpl = templateObject.render(data);
        assert.strictEqual(expectedTpl, populatedTpl, `Test ${testNumber}.1 assertion failed`);
    });

    test(`5. ${moduleName} - function replaceSubstringInLine()`, function() {
        testNumber = 5;

        // Test the function, all parameters
        // replaceSubstringInLine(line, substringRegex, newText)

        var originalLine = " * @Last Modified by:   Noscere ";
        var replaceAuthorReg = /^(.*?)(@Last Modified by:)(\s*)(\S*)$/;
        var expectedText = " * @Last Modified by:   " + testData.config.LastModifiedBy + " ";
        var newLineText = fileheader.replaceSubstringInLine(originalLine, replaceAuthorReg, testData.config.LastModifiedBy);
        assert.strictEqual(newLineText, expectedText, `${testNumber}.1. ${moduleName}.replaceSubstringInLine("${originalLine}", "${replaceAuthorReg}", "${testData.config.LastModifiedBy}") returned unexpected string:\n"${newLineText}"\nWe expected:\n"${expectedText}".`);

        // "yyyy-MM-dd hh:mm:ss"
        originalLine = " * @Last Modified time: 2022-10-18 18:25:02";
        var replaceTimeReg = /^(.*?)(@Last Modified time:)(\s*)(.*)$/;
        var curTime = new Date();
        var currTimeFormatted = curTime.format(testData.config.dateFormat);
        expectedText = " * @Last Modified time: " + currTimeDFormatted;
        newLineText = fileheader.replaceSubstringInLine(originalLine, replaceTimeReg, currTimeFormatted);
        assert.strictEqual(newLineText, expectedText, `${testNumber}.2. ${moduleName}.replaceSubstringInLine("${originalLine}", "${replaceTimeReg}", "${currTimeFormatted}") returned unexpected string:\n"${newLineText}"\nWe expected:\n"${expectedText}".`);
        
        // Test when there should be nothing changed
        originalLine = " * @Email: someone@example.com";
        expectedText = originalLine;
        newLineText = fileheader.replaceSubstringInLine(originalLine, replaceAuthorReg, testData.config.LastModifiedBy);
        assert.strictEqual(newLineText, expectedText, `${testNumber}.3. ${moduleName}.replaceSubstringInLine("${originalLine}", "${replaceAuthorReg}", "${testData.config.LastModifedBy}") returned unexpected string:\n"${newLineText}"\nWe expected:\n"${expectedText}".`)
        // Test when there should be nothing changed
        originalLine = " * @Email: someone@example.com";
        expectedText = originalLine;
        newLineText = fileheader.replaceSubstringInLine(originalLine, replaceTimeReg, currTimeFormatted);
        assert.strictEqual(newLineText, expectedText, `${testNumber}.4. ${moduleName}.replaceSubstringInLine("${originalLine}", "${replaceTimeReg}", "${currTimeFormatted}") returned unexpected string:\n"${newLineText}"\nWe expected:\n"${expectedText}".`)
    });

    test(`6. ${moduleName} - function constructCommentLine()`, function() {
        testNumber = 6;
        // Test the function in all code legs
        // linePrefix and lineSuffix are optional, so test without, with each and with both.

        // constructCommentLine (fieldLabel, fieldText, linePrefix = "", lineSuffix = "")
        var fieldLabel = "@Last Modified By: ";
        var fieldData = testData.config.Author;
        
        var actualString = fileheader.constructCommentLine(fieldLabel, fieldData);
        var expectedString = fieldLabel + fieldData;
        assert.strictEqual(actualString, expectedString, `${testNumber}.1. ${moduleName}.constructCommentLine("${fieldLabel}", "${fieldData}") returned unexpected string:\n"${actualString}\nWe expected:\n${expectedString}".`);

        // Now test with a prefix only
        var prefix = " * ";
        actualString = fileheader.constructCommentLine(fieldLabel, fieldData, prefix);
        expectedString = prefix + fieldLabel + fieldData;
        assert.strictEqual(actualString, expectedString, `${testNumber}.2. ${moduleName}.constructCommentLine("${fieldLabel}", "${fieldData}", "${prefix}") returned unexpected string:\n"${actualString}"\nWe expected:\n${expectedString}".`);

        // Now test with a suffix only
        var suffix = " * ";
        actualString = fileheader.constructCommentLine(fieldLabel, fieldData, "", suffix);
        expectedString = fieldLabel + fieldData + suffix;
        assert.strictEqual(actualString, expectedString, `${testNumber}.3. ${moduleName}.constructCommentLine("${fieldLabel}", "${fieldData}", "", "${suffix}") returned unexpected string:\n"${actualString}"\nWe expected:\n${expectedString}".`);

        // Now test with a both prefix and suffix
        var prefix = " * ";
        var suffix = " * ";
        actualString = fileheader.constructCommentLine(fieldLabel, fieldData, prefix, suffix);
        expectedString = prefix + fieldLabel + fieldData + suffix;
        assert.strictEqual(actualString, expectedString, `${testNumber}.4. ${moduleName}.constructCommentLine("${fieldLabel}", "${fieldData}", "${prefix}", "${suffix}") returned unexpected string:\n"${actualString}"\nWe expected:\n${expectedString}".`);

        // Now try to break the function
        // Can we cope with unexpected data?
        var actualString = fileheader.constructCommentLine(null, null, null, null);
        var expectedString = "";                    buffer.write(`"${enumValues[x]}"`,buffer.length,`utf-8`);

        fs.write(fd)
        assert.strictEqual(actualString, expectedString, `${testNumber}.5. ${moduleName}.constructCommentLine("null", "null", "null", "null") returned unexpected string:\n"${actualString}"\nWe expected:\n"${expectedString}".`);
    });

    test(`7. ${moduleName} - function preprocess`, function() {
        testNumber = 7;
       // Function under test
        // preprocess(tpl)

        // Get the properties
        var properties = package.contributes.configuration.properties;
        // Get a C-Style template to test with from the properties
        var configTpl = properties[`${extensionConfigPropertyName}.templates.c`].default;

        // Get some data to populate template with
        var config = testData.config;
        var dateFormat = config.dateFormat;
        var time = new Date().format(dateFormat);
        var data = {
            author: config.Author,
            email: config.Email,
            lastModifiedBy: config.LastModifiedBy, // use local variable assigned above
            createTime: time,
            updateTime: time
        };

        // Construct the expected template:
        newLine="\r\n";
        commentStart="/*";
        commentEnd=" */";
        linePrefix=" * ";
        /* c-style rendered template: 
       "/*\r\n
         * @Author: {author} \r\n
         * @Email: {email}\r\n
         * @Date: {createTime} \r\n6
         * @Last Modified by:   {lastModifiedBy} \r\n
         * @Last Modified time: {updateTime}\r\n
         * @Description: Description\r\n
         \r\n*/
        const expectedTpl1 = commentStart + newLine +
            linePrefix + "@Author: {author} " + newLine +
            linePrefix + "@Email: {email}" + newLine +
            linePrefix + "@Date: {createTime} " + newLine +
            linePrefix + "@Last Modified by:   {lastModifiedBy} " + newLine +
            linePrefix + "@Last Modified time: {updateTime}" + newLine +
            linePrefix + "@Description: Description" + newLine +
            commentEnd + newLine;
        // With disabled description
        const expectedTpl2 = commentStart + newLine +
            linePrefix + "@Author: {author} " + newLine +
            linePrefix + "@Email: {email}" + newLine +
            linePrefix + "@Date: {createTime} " + newLine +
            linePrefix + "@Last Modified by:   {lastModifiedBy} " + newLine +
            linePrefix + "@Last Modified time: {updateTime}" + newLine +
            commentEnd + newLine;
        // With disabled email
        const expectedTpl3 = commentStart + newLine +
            linePrefix + "@Author: {author} " + newLine +
            linePrefix + "@Date: {createTime} " + newLine +
            linePrefix + "@Last Modified by:   {lastModifiedBy} " + newLine +
            linePrefix + "@Last Modified time: {updateTime}" + newLine +
            linePrefix + "@Description: " + "Description" + newLine +
            commentEnd + newLine;
        // With both description and email disabled
        const expectedTpl4 = commentStart + newLine +
            linePrefix + "@Author: {author} " + newLine +
            linePrefix + "@Date: {createTime} " + newLine +
            linePrefix + "@Last Modified by:   {lastModifiedBy} " + newLine +
            linePrefix + "@Last Modified time: {updateTime}" + newLine +
            commentEnd + newLine;

        // Construct some options
        var options = {
            description: true,
            email: true
        }
        // preprocess the template
        // test 1 - both enabled
        var template = fileheader.preprocess(configTpl, options);
        assert.strictEqual(template, expectedTpl1, `${testNumber}.1. ${moduleName}.preprocess(${configTpl}, ${options}) returned an unexpected string.\nWe got:\n${template}\nWe expected:\n${expectedTpl1}`);
        // test 2 - description disabled
        options.description = false;
        template = fileheader.preprocess(configTpl, options);
        assert.strictEqual(template, expectedTpl2, `${testNumber}.2. ${moduleName}.preprocess(${configTpl}, ${options}) returned an unexpected string.\nWe got:\n${template}\nWe expected:\n${expectedTpl2}`);
        // test 3 - email disabled
        options.description = true;
        options.email = false;
        template = fileheader.preprocess(configTpl, options);
        assert.strictEqual(template, expectedTpl3, `${testNumber}.3. ${moduleName}.preprocess(${configTpl}, ${options}) returned an unexpected string.\nWe got:\n${template}\nWe expected:\n${expectedTpl3}`);
        // Test 4, both disabled
        options.description = false;
        var template = fileheader.preprocess(configTpl, options);
        assert.strictEqual(template, expectedTpl4, `${testNumber}.4. ${moduleName}.preprocess(${configTpl}, ${options}) returned an unexpected string.\nWe got:\n${template}\nWe expected:\n${expectedTpl4}`);

        // Finally, test that our minimal eader is rendered as expected
        // Construct some data to fill it with...
        var time = new Date().format(dateFormat);
        var data = {
            author: testData.config.Author,
            email: testData.config.Email,
            lastModifiedBy: testData.config.LastModifiedBy, // use local variable assigned above
            createTime: time,
            updateTime: time
        };
        // Construct the expected header
        const expectedTpl5 = commentStart + newLine +
            linePrefix + "@Author: " + data.author + " " + newLine +
            linePrefix + "@Date: " + time + " " + newLine +
            linePrefix + "@Last Modified by:   " + data.lastModifiedBy + " " + newLine +
            linePrefix + "@Last Modified time: " + time + newLine +
            commentEnd + newLine;
        // Call the template engine to render a populated template
        // Using the last preprocessed template (with email and desc. turned off)
        var templateObject = new fileheader.template(template);
        // Test the return value (should be an object)
        var populatedTpl = templateObject.render(data);
        assert.strictEqual(expectedTpl5, populatedTpl, `${testNumber}.5 ${moduleName} failed to render template as expected!`);
    });
});
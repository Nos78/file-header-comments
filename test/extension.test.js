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

    test(`${extensionName} - package.json, config properties: author details`, function() {
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
        assert.strictEqual(properties[`${extensionConfigPropertyName}.Author`].default, testData.config.Author);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.Author`].type, "string");
        assert.strictEqual(properties[`${extensionConfigPropertyName}.Email`].default, testData.config.Email);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.Email`].type, "string");
        assert.strictEqual(properties[`${extensionConfigPropertyName}.LastModifiedBy`].default, testData.config.LastModifiedBy);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.LastModifiedBy`].type, "string");
    });

    test(`${extensionName} - package.json, config properties: templates`, function() {
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
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.shellScript`].default, testData.config.templates.shellScript);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.shellScript`].type, "string");
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.visualBasic`].default, testData.config.templates.visualBasic);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.visualBasic`].type, "string");
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.html`].default, testData.config.templates.html);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.html`].type, "string");
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.c`].default, testData.config.templates.c);
        assert.strictEqual(properties[`${extensionConfigPropertyName}.templates.c`].type, "string");
    });

    test(`${extensionName} - package.json, config properties: date format`, function() {
        var properties = package.contributes.configuration.properties;
        assert.strictEqual(properties[`${extensionConfigPropertyName}.dateFormat`].type, "string");
        var dateFormat = properties[`${extensionConfigPropertyName}.dateFormat`].default;
        assert.strictEqual(dateFormat, testData.config.dateFormat);
    });

    test(`Module: ${moduleName} - function: template()`, function() {
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
        assert.strictEqual(expectedTpl, populatedTpl);
    });
});
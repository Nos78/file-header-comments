/*
 * @Author: Noscere 
 * @Email: noscere1978@gmail.com
 * @Date: 2022-10-19 22:18:08 
 * @Last Modified by: Noscere
 * @Last Modified time: 2022-10-19 22:50:00
 * @Description: Script to get the license data from the
 * License List Data repository project on github (see
 * https://github.com/spdx/license-list-data)
 * 
 * This script accesses the SPDX API, reads the json license
 * object, and writes out a file compatible with our project
 * config settings. The contents of spdx-output.json can be
 * cut and pasted into our package.json
 * 
 * TODO:
 *   This script could and should? be added to our build & release
 *   process so that the licenses list is generated and config
 *   properties updated in package.json before each release.
 * 
 * SPDX API:
 *   https://spdx.org/licenses/licenses.json
 * 
 * How to access the data:
 *   https://github.com/spdx/license-list-data/blob/master/accessingLicenses.md
 * 
 * Retrieving information on a specific license:
 *   http://spdx.org/licenses/[BlicenseID%].json
 */

// name our module
const name = 'build-licenses-list';

// require some modules
const https = require('https'); // for accessing the spdx api
const yargs = require("yargs"); // for processing command-line args
const pathHelper = require('path'); // for outputting licenses & enum properties
var fs = require('fs'); // for outputting licenses & enum properties

// declare some variables
const spdxUrl = 'https://spdx.org/licenses/licenses.json';

// output pretty console terminal lines with these ANSI codes
const terminal = {
    normal:    "\x1b[0m",
    bold:      "\x1b[1m",
    italic:    "\x1b[3m",
    underline: "\x1b[4m",
    strike:    "\x1b[9m",
    blink:     "\x1b[5m",
    light: {
        red:    "\x1b[91m",
        yellow: "\x1b[93m",
        blue:   "\x1b[94m",
        green:  "\x1b[92m",
        magenta:"\x1b[95m"
    },
    cyan:     "\x1b[36m",
    magenta:  "\x1b[35m",
    blue:     "\x1b[34m"
}

// configure yargs
const options = yargs
    .usage(`${terminal.light.yellow}Usage: ${terminal.normal}${terminal.bold}${name}${terminal.normal} -f|--fsflibre -o|--osi`)
    .option("h", {alias: "help"})
    .option("c", {alias: "contributes", describe: `${terminal.cyan}${terminal.bold}<filename>${terminal.normal}${terminal.cyan} Create a contributes config, an enum properties json.${terminal.normal}`, type: "string", requiresArg: true})
    .option("d", {alias: "deprecated", describe: `${terminal.light.green}Include deprecated licenses.${terminal.normal}${terminal.italic} Default is false.${terminal.normal}`, type: "boolean"})
    .option("f", { alias: "fsflibre", describe: `${terminal.light.red}Only include FSF licenses.${terminal.normal}${terminal.italic} Defaults to false.${terminal.normal}`, type: "boolean"})
    .option("j", {alias: "json", describe: `${terminal.light.yellow}Outputs command-line args (by yargs).${terminal.normal}${terminal.blink} For DEBUGGING!${terminal.normal}`, type: "boolean"})
    .option("o", { alias: "osi", describe: `${terminal.light.red}Only include OSI Approved licenses.${terminal.normal}${terminal.italic} Defaults to false.${terminal.normal}`, type: "boolean"})
    .option("F", { alias: "filename", describe:`${terminal.cyan}${terminal.bold}<filename>${terminal.normal}${terminal.cyan} to save the licenses to.${terminal.normal}${terminal.italic} Outputs a json,\ndefault prints to screen.`, type: "string", requiresArg: true})
    .argv;

// Some flags for including/excluding licenses
var includeDeprecated = options.d;
var excludeNonFsf = options.f;
var excludeNonOsi = options.o;
var writeToFile = (options.F);
var outputFilePath = options.F;
var outputFile = null;
var createContributesConfig = (options.c);
var configOutputFilePath = options.c;
var configOutputFile = null;

console.log(`${name}: Building the list of licenses`);
console.log(` * Listing licenses that match the following:`);
// If verbose mode, tell the user what we are filtering
if(isVerbose) {
    if(excludeNonOsi) {
        console.log(`${terminal.light.red} --- ${terminal.normal}Listing only OSI approved. ${terminal.light.red}(Excluding non-OSI approved licenses.)${terminal.normal}`);
    } else {
        console.log(`${terminal.light.green} +++ Including non-OSI approved licenses.${terminal.normal}`);
    }
    if(excludeNonFsf) {
        console.log(`${terminal.light.red} --- ${terminal.normal}Listing free software only. ${terminal.light.red}(Excluding non-FSF compliant.)${terminal.normal}`);
    } else {
        console.log(`${terminal.light.green} +++ Including licenses that do not meet the FSF's free software definition.${terminal.normal}`);
    }
    if(includeDeprecated) {
        console.log(`${terminal.light.green} +++ Including deprecated licenses.${terminal.normal}`);
    } else {
        console.log(`${terminal.light.red} --- Excluding deprecated licenses.${terminal.normal}`);
    }
}
if(outputFilePath) {
    outputFilePath = pathHelper.normalize(outputFilePath);
    outputFile = pathHelper.parse(outputFilePath);
    outputFile = pathHelper.parse(pathHelper.resolve(outputFilePath));
    outptFilePath = pathHelper.resolve(outputFilePath);
    if(isVerbose) {
        console.log(` +++ Outputting licenses json to ${outputFilePath}, ${pathHelper.format(outputFile)}`);
    }
}
if(configOutputFilePath) {
    configOutputFilePath = pathHelper.normalize(configOutputFilePath);
    configOutputFile = pathHelper.parse(configOutputFilePath);
    configOutputFilePath = pathHelper.resolve(configOutputFilePath);
    configOutputFile = pathHelper.parse(configOutputFilePath);
    if(isVerbose) {
        console.log(` +++ Outputting enum properties for filtered licenses to ${configOutputFilePath}, ${pathHelper.format(configOutputFile)}`);
    }
}

if(options.j) {
    console.log("Command-line parameters where as follows:\n" + JSON.stringify(options, null, " "));
    console.log(`Filename option indicates the following file:\n${JSON.stringify(outputFile, null, " ")}`);
    console.log("quitting");
    process.exit();
    return;
}

console.log(`\n${terminal.underline}${terminal.light.green} * Attempting to query spdx API:${terminal.normal}`);
// Querying SPDX website to obtain json
let licensesRequest = https.get(spdxUrl, function(res) {
    let data = '', json_data;
    console.log(` * Getting licenses from ${spdxUrl}`);

    res.on('data', function(stream) {
       // console.log(`STREAM:${stream}:ENDSTREAM***`);
        data += stream;
    }); // res.on('data')

    res.on('end', function() {
        console.log(`\n\n${terminal.light.yellow}${name}: Obtained list of licenses as JSON${terminal.normal}`);
        console.log(` * https get licenses completed`);
        console.log(``);
        json_data = JSON.parse(data);
      
        // We should now have our json object
        if(isVerbose) {
            console.log(`\n${terminal.underline}Here is our json data:\n\n${terminal.normal}`);
        }
        if(options.j) {
            console.log(`${terminal.underline}JSON object from https get:${terminal.normal}`);
            console.log(json_data);
        }

        console.log(`Size of our json licenses array. json_data.licenses[].length`);
        console.log(json_data.licenses.length);
        console.log(` *** Filtering licenses according to above-defined filters...\n`);
        /*
          The license summary information contains the following fields:
            reference – Reference to the HTML format for the license file
            isDeprecatedLicenseId – True if the entire license is deprecated (note – this isn't actually the best name for this particular field)
            detailsUrl – URL to a JSON file containing the license detailed information
            referenceNumber – Deprecated - this field is generated and is no longer in use
            name – License name
            licenseId – License identifier
            seeAlso – Cross reference URL pointing to additional copies of the license
            isOsiApproved – Indicates if the OSI has approved the license
            isFsfLibre - is compliant with FSF definition of free software
        */
        const licenses = json_data.licenses;
        var filteredLicenses = [];

        var includedLicenseTotal = 0;
        for(let x = 0; x < licenses.length; x++ ) {
            if(isVerbose) {
                console.log(`For loop x=${x}`);
            }
            const license = licenses[x];
            if(license) {
                var include = true;
                if(includeDeprecated) {
                // Include this record
                } else {
                    if(!license.isDeprecatedLicenseId) {
                        // Include this record
                    } else {
                        // Exclude this record
                        if(isVerbose) {
                            console.log(`${license.referenceNumber} EXCLUDED, deprecated - ${license.isDeprecatedLicenseId}`);
                        }
                        include = false;
                    }
                }
                if(include && (!excludeNonFsf || license.isFsfLibre)) {
                    // Include this record
                } else {
                    // Exclude this record
                    if(isVerbose) {
                        console.log(`${license.referenceNumber} EXCLUDED, not FSF Libre - ${license.isFsfLibre}`);
                    }
                    include = false;
                } // includeNonFsf 
                if(include && (!excludeNonOsi || license.isOsiApproved)) {
                    // Include this record
                    if(isVerbose) {
                        console.log(`${license.referenceNumber} EXCLUDED, non OSI Approved - ${license.isOsiApproved}`);
                    }
                } else {
                    // Exclude this record
                    include = false;
                } // incudeNonOsi
                if(include) {
                    includedLicenseTotal+=1;
                    filteredLicenses.push(license);
                }
            } // if license
        } // end for
        console.log(`Included ${includedLicenseTotal} records!\nSize of our filtered json licenses array, filteredLicenses[].length = ${filteredLicenses.length}`);
        console.log(filteredLicenses.length);
        
        if(writeToFile) {
            fs.writeFile(pathHelper.format(outputFile), JSON.stringify(filteredLicenses, "", " "), 'utf8', function(err) {
                if(err) throw err;
                console.log(`FilteredLicenses written to ${pathHelper.format(outputFile)}.`);
            });
        }

        if(createContributesConfig) {
            var contributesConfigEnums = [];
            var enumValues = [];
            var enumItemLabels = [];
            var markdownEnumDescriptions= [];

            // Push our standard settings to the front of the arrays
            enumValues.push();
            // "File", "GPL3", "Apache2", "ARR", "Custom"
            enumValues.push("File");
            enumValues.push("Blank");
            enumValues.push("A.R.R.");
            enumItemLabels.push("Inserts link to workspace LICENSE.");
            enumItemLabels.push("Inserts empty space; write a copyright statement.");
            enumItemLabels.push("Inserts 'All rights reserved.'");
            markdownEnumDescriptions.push("(See workspace LICENSE)[file://{projectWorkspace}/LICENSE]");
            markdownEnumDescriptions.push("");
            markdownEnumDescriptions.push("All rights reserved.");

            for(let x = 0; x < filteredLicenses.length; x++) {
                enumValues.push(filteredLicenses[x].licenseId);
                enumItemLabels.push(filteredLicenses[x].name);
                markdownEnumDescriptions.push(`[${filteredLicenses[x].name}](`+ filteredLicenses[x].seeAlso[0] + ")");
            }
            
            var contributesProperties = {
                enum: `${enumValues}`,
                enumItemLabels: `${enumItemLabels}`,
                markdownEnumDescriptions: `${markdownEnumDescriptions}`
            }

            // Now either display the config json or write it out to file
            // First convert it to a pretty json string (arrays on one line, properties on new line)
            var configPropertiesString = JSON.stringify(contributesProperties,function(key,value){
                if(value instanceof Array)
                   return JSON.stringify(value);
                return value;
             },2);

            if(pathHelper.isAbsolute(pathHelper.format(configOutputFile))) {
                fs.writeFile(pathHelper.format(configOutputFile), configPropertiesString, 'utf8', function(err) {
                    if (err) throw (err);
                    console.log(`Written contributes config enums to file ${pathHelper.format(configOutputFile)}.`);
                });
            } else {
                console.log(configPropertiesString);
            } // createsContributesConfig
        } // creates contribtes
    }); // res.on('end')
});

licensesRequest.on('error', function(e) {
    console.log(e.message);
}); // .on('error')

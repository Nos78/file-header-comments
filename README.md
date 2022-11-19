# file-header-comments
[*A Visual Studio Code (vscode) Extension*](https://marketplace.visualstudio.com/vscode)

## feature

Add a file header comment block to new and existing files. The header template includes the author name, email and date of file creation, and a description field to describe the file. Provides support for automatically updating the header whenever a file is saved, adding the date and author of the modification.

eg:

```c
/*
 * @Author: mikey.zhaopeng
 * @Email:  admin@example.com
 * @Date:   2016-07-29 15:57:29
 * @Last Modified by: Noscere
 * @Last Modified time: 2022-11-15 06:25:53.546
 * @Description: description
 */
```

![fileheader](https://github.com/zhaopengme/vscode-fileheader/raw/master/fileheader.gif)

> Tip: ctrl+alt+i You can insert comments in the head, ctrl+s After you save the file, and automatically update the time and author.

## install

Press `F1`,type`ext install file-header-comments`.

## Configuration

In the User Settings inside, set and modify the creator's name & email.

```
"fileheader.Author": "tom",
"fileheader.Email": "admin@gmial.com",
"fileheader.LastModifiedBy": "jerry"
```

![name config](https://github.com/zhaopengme/vscode-fileheader/raw/master/name.jpg)

## hot key

`ctrl+alt+i` You can insert comments in the head.


# Change log


## 0.2.5
**Release date 2022-11-15

* Fixed issue where `last Modified By` name could be undefined


## Change log (history)

## 0.2.4
**Release date 2022-11-15

* Emergency bug fix to restore extension functionality. This extension had no dependancies prior to v*0.2.3*. In this release, a dependancy had been added to the project but node_modules was being deliberately excluded from the published package via the vscodeignore file.
* Removed old versions of this change log - to view old releases prior to v*0.2.0* please refer to [the github repository](https://github.com/Nos78/file-header-comments/releases)

## 0.2.3
** Release date 2022-11-15
* When inserting a header into a file using the keyboartd shortcut, (CTRL+ALT+I by default) a new input dialog box is now displayed that prompts for a description of the file. This change does not apply to existing headers, and the dialog is not shown if the @Description field is turned off.
* * Escaping this dialog or entering a blank value will cause the default value to be rendered.
* Modified the header pre-processing function so that rendering options are now processed programmatically instead of having to manually update this function every time we add a new rendering option. This doesn't change the user experience but should hopefully speed up future development when adding new rendering features as there will be less changes to make and therefore less code to test and potentially break.

## 0.2.2
** Release date 2022-11-13**
* Removed trailing C-style closing comment from the HTML template.
* Added validation to the configuration settings for the email address and date format text boxes. Invalid entries will display an error message informing the user and this invalid setting will not be updated until corrected.
* Corrected the inconsistent formatting for the *File Types* information label beneath the templates. They should now all look the same.
* Fixed issue whereby changes to the extension settings were not being used until vscode was rebooted. This was due to the extension caching the settings when it is first loaded, so changes to the settings weren't being used until next reload.

## 0.2.1
**Release date 2022-10-21**
We recently added two new fields to our comment header block, author's @Email and @Description. Like all the other fields, these where added into the template (now templates plural) and populated whenever the user inserts a header. It has come to mind that some users might not want these additional fields, preferring the template(s) to look the same as they used to. They could edit the template, but faced with a big warning not to edit, they may be reluctant to do so...

* Updated the configuration settings with two new checkboxes, grouped under 'rendering options'. These check boxes (default is ON) allow the user to turn off the @Email and @Description tag when inserting a new comment header. This allows the user to turn o

Note: This does not affect existing headers; existing fields can be deleted manually if unwanted.

There are a lot of options now in the extensions configuration, and it might become obvious when experimenting that you have to restart VS Code in order to see the new setting value take effect. This is due to the way the extension stores the settings configuration. When there were only a few settings, whose values would very rarely, if ever need to change, the extension cached them when it was loaded. Now that there are a bunch of settings that might be changed more often, it may make sense to re-evaluate this for an upcoming release.

## 0.2.0
**Release date 2022-10-18**

Incremented the minor version to reflect the new functionality. V0.2 of the extension should be the last development cycle before the extension is production ready - that is, officially released as v1.x.y! Some of the changes going into this initial 0.2 release are:
* As promised, the new date format string added to the settings in the previous release now defines the date & time format for the file comment header. This string uses the allowed formatting for a javascript Date object, such as yyyy-MM-dd for a date that looks like 2022-12-03
* Unit tests have been added for all fileheader module functions, which will assist future development not to break things.



## tasks for future releases:
*(for further details on these tasks/issues, refer to https://github.com/Nos78/vscode-fileheader/issues and https://github.com/Nos78/vscode-fileheader/projects)*

 1. [] <span style="color: red;">Currently the template cannot be modified without potentially having to make changes to the code. Make the template editable without breaking the auto-update-on-save feature. The hard-coded strings in extension.js essentially prevents the user from changing the look of the template for their file comment header.</span>
 2. [x] the "modified by" and "modified time" are hardcoded into extension.js. Refactor the code so that these are also editable in the settings, fixing the above also.
 3. [] <span style="color: red;">Some form of @copyright field would be useful, either directing the reader to a project-wide statement or file, or a URL, or else inserting a sting literal which would also be user defined via the settings page.</span>
 4. [] Comment headers often contain a version number along with the modified date & time. This would be implemented by way of an additional **@Version** field, with several formats to choose from in the settings. A selection of pre-configured version styles, along with a custom entry should the user wish to define their own.
 5. [] <span style="color: red;">File version numbers could be auto-incremented upon save. This would be enabled or disabled via a toggle from within the user (global) or workspace (project specific) settings. When enabled, the patch level of the version number would be incremented at the same time as modifying the modified at date & time.</span>
 6. [] Allow the user to specify rules as to how the version number is incremented. What defines whether to increment the patch number, or to increment the minor or major number?

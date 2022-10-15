# vscode-fileheader

## feature

Add a file header comment block to new and existing files. The header template includes the author name, email and date of file creation, and a description field to describe the file. Provides support for automatically updating the header whenever a file is saved, adding the date and author of the modification.

eg:

```
/*
 * @Author: mikey.zhaopeng
 * @Email:  admin@example.com
 * @Date:   2016-07-29 15:57:29
 * @Last Modified by: Noscere
 * @Last Modified time: 2022-10-15 18:45:59
 * @Description: description
 */
```

![fileheader](https://github.com/zhaopengme/vscode-fileheader/raw/master/fileheader.gif)

> Tip: ctrl+alt+i You can insert comments in the head, ctrl+s After you save the file, and automatically update the time and author.

## install

Press `F1`,type`ext install fileheader`.

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

## Change log

### 0.1.1
1. Re-worded the displayName field in the package manifest, since it was the same as the name field, we were giving up on the opportunity to explain what our extension does to those marketplace browsers who might only quickly scan down the list of extensions. It didn't make sense to have the same name twice, especially when said name is not very explanatory.
2. Fixed the sponsor URL in the manifest.
3. Removed the README for ch-zn (simplified chinese) since I cannot speak this language, and therefore am unable to make the changes necessary to make the README up-to-date. It is preferable to have English only and let the user translate it for themselves rather than provide a README that is wrong because it is no longer up-to-date.


### 0.1.0
**Release date 2022-10-15**
*There has been no release of the original author's extension in six years, despite changes being made and committed to the repository three years ago.  Given that there were unreleased modifications and further improvements to be made, CodingQ has assumed responsibility for its continuing development under the assumption that the original author has abandoned this extension.*

This release candidate has been prepared under a new publisher. This effectively means that it becomes a new extension with a new history. Without any links to the old extension, sadly this means that users of the existing extension will not be upgraded automatically. We have made attempts to contact the original author in the hope that either we can merge our new functionality into the parent repository, have the ability to modify the existing extension, or else have it transferred under our control. Failing any of those options, then mark the old extension as deprecated and direct users to install this new one.

File comment headers for most common file types are now supported. Each type has its own the template that can be found in the settings. The look is identical to the C-Style comment block, but using the alternative comment character instead of an asterisk (*).

Added support for languages that use alternative characters for comments:
  1. Shell scripts and other scripting languages, such as perl and python use hash (#) character for comments.
  2. Visual basic uses apostrophe (') character for comments.
  3. A html comment block uses exclamation mark and dashes between angled brackets.

Now you can add file headers for all these file types. The template for each of these can be found in the settings. The default template looks the same as for the C-style comment block, but with the alternative character instead of *.


### 0.0.3 :
*This is a summary list of the changes that have been committed to the github repository since the last marketplace release up until the repository was forked on 2022-10-13. **Note** that this version was not released to the marketplace, nor is there a downloadable release package.*
**Release date 2019-10-12**

Minor bug fixes by various contributors:
  1. Inserted two new fields into the comment header, @Email and @Description. The email field can be set in the settings next to the author name, whilst the description will just say "@Description: description" allowing the author to add their own descrption.
  2. The extension now tries to use regex to find the modified by author, date & time to insert the changes.

### 0.0.2
**Release date 2016-08-10** *Note that this release was marked as v1.0.0 in the change log whilst the manifest stated v0.0.2; assuming manifest to be the correct version and adjusted this change log accordingly**
  1. Support hotkey insert header comments
  2. Support Save file, automatically update the time
  3. Support the configuration and update the creator's name

## tasks for future releases:
*(for further details on these tasks/issues, refer to https://github.com/Nos78/vscode-fileheader/issues and https://github.com/Nos78/vscode-fileheader/projects)*

 1. [] Currently the template cannot be modified without potentially having to make changes to the code. Make the template editable without breaking the auto-update-on-save feature. The hard-coded strings in extension.js essentially prevents the user from changing the look of the template for their file comment header.
 2. [] the "modified by" and "modified time" are hardcoded into extension.js. Refactor the code so that these are also editable in the settings, fixing the above also.
 3. [] Some form of @copyright field would be useful, either directing the reader to a project-wide statement or file, or a URL, or else inserting a sting literal which would also be user defined via the settings page.
 4. [] Comment headers often contain a version number along with the modified date & time. This would be implemented by way of an additional **@Version** field, with several formats to choose from in the settings. A selection of pre-configured version styles, along with a custom entry should the user wish to define their own.
 5. [] File version numbers could be auto-incremented upon save. This would be enabled or disabled via a toggle from within the user (global) or workspace (project specific) settings. When enabled, the patch level of the version number would be incremented at the same time as modifying the modified at date & time.
 6. [] Allow the user to specify rules as to how the version number is incremented. What defines whether to increment the patch number, or to increment the minor or major number?

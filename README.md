# vscode-fileheader

## feature

Add a file header comment block to new and existing files. The header template includes the author name, email and date of file creation, and a description field to describe the file. Provides support for automatically updating the header whenever a file is saved, adding the date and author of the modification.

eg:

```
/*
 * @Author: mikey.zhaopeng
 * @Email:  admin@gmial.com
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

### 0.1.0
**Release date 2022-10-15**
*There has been no release of the original author's extension in six years, despite changes being made and committed to the repository three years ago.  Given that there were unreleased modifications and further improvements to be made, CodingQ has assumed responsibility for its continuing development under the assumption that the original author has abandoned this extension.*

This release candidate has been prepared under a new publisher. This effectively means that it becomes a new extension with a new history. Without any links to the old extension, sadly this means that users of the existing extension will not be upgraded automatically. We have made attempts to contact the original author in the hope that either we can merge our new functionality into the parent repository, have the ability to modify the existing extension, or else have it transferred under our control. Failing any of those options, then mark the old extension as deprecated and direct users to install this new one.

Added support for languages that use alternative characters for comments:
  1. Shell scripts and other scripting languages, such as perl and python, use # comments.
  2. Visual basic uses ' for comments.
  3. html comment blocks use <!-- -->

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

## tasks

 [] Currently the template cannot be modified without potentially having to make changes to the code. Make the template editable without breaking the auto-update-on-save feature.
 [] the "modified by" and "modified time" are hardcoded into extension.js. Refactor the code so that these are also editable in the settings, fixing the above also.
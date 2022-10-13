# vscode-fileheader

## feature

Add notes to the file header, and supports automatic update file modification time.

eg:

```
/*
 * @Author: mikey.zhaopeng
 * @Email:  admin@gmial.com
 * @Date:   2016-07-29 15:57:29
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2016-08-09 13:29:41
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

Added support for languages that use alternative characters for comments.
  1. Shell scripts, and other scripting languages such as perl and python, use # comments.
  2. Visual basic uses ' for comments.
  3. html comment blocks use <!-- -->

Now you can add file headers for all these file types. The template for each of these can be found in the settings. The default template looks the same as for the C-style comment block, but with the alternative character instead of *.

### 0.0.2

1. Support hotkey insert header comments
2. Support Save file, automatically update the time
3. Support the configuration and update the creator's name

## task

 [] 1. add template 


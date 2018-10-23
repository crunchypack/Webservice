# Webservice

----
## Webservice creation
The purpose is to create a webservice with php. The process is easier with gulp automatisation.
----
## What packages are used
* **gulp-concat** - Used for concating JavaScript and CSS files
* **gulp-uglify** - Used for minifying JavaScript
* **gulp-sass**   - Used to compile sass into CSS
* **gulp-clean-css** - Used for minifying CSS
* **gulp-imagemin** - Used for minifying images
* **gulp-htmlmin**  - Used for minifying html

----
## How it all works
### Gulp
The system checks for changes in any of the files and sends them, minified and concated if it applies, to a folder made for publishing. The files it checks are in a sorce folder, aptly named src.
When checking changes in any html-file no concation or minifying is applied, the file is simply copied to the publication folder (pub).
Changes in js- and css-files are concated and minified before being sent to the pub folder. Imaged are minified before being sent.

By having NodeJS and npm installed you simply navigate to the main folder (AutoWeb) in a terminal and execute the following commands:

```sh
$ npm install gulp -g
$ npm install
$ gulp
```

The first command is to install gulp globally, can be ignored if you already have it installed.
Now you can open any html file in the publication folder using liveserver with Visual Studio Code. And you can start working on the source folder. Everytime you save, the changes will immediately occour in the pub-folder.
Don't forget to change the destination to your desired folder.

```javascript
  return  gulp.src("src/*.{html,php}")
        .pipe(gulp.dest("Your Folder"));
```


### PHP Webservice
The php webservice works by connecting to a database. It checks for the http methods:

* **GET**
* **POST**
* **PUT**
* **DELETE**

And makes SQL queries based on them. It echoes out the response in JSON.

### TypeScript

The ts-file sends xmlhttp-request to the webservice using objects. HTML is rendered based and user input. The file must be compiled to JavaScript:

```sh

$ tsc script

```







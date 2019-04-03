const json2md = require("json2md");
const fs = require("fs");

module.exports = {
  readFiles: function(dirname, onFileContent, onError) {
    fs.readdir(dirname, function(err, folders) {
      if (err) {
        onError(err);
        return;
      }
      folders.forEach(function(folder) {
        fs.readdir(dirname + folder, "utf-8", function(err, filenames) {
          if (err) {
            onError(err);
            return;
          }
          filenames.map(function(filename) {
            fs.readFile(dirname + folder + "/" + filename, "utf-8", function(
              err,
              content
            ) {
              if (err) {
                onError(err);
                return;
              }
              const parsedContent = JSON.parse(content);
              console.log(json2md(parsedContent.content.rendered));
              onFileContent(filename, parsedContent);
            });
          });
        });
      });
    });
  }
};

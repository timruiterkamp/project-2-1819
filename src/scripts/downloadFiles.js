// const promisify = require("es6-promisify"); // many apis still use callbacks
const download = require("download-to-file");
const webp = require("webp-converter");

const downloadFiles = async function downloadAll(files) {
  const results = [];
  for (const file of files) {
    let result;
    try {
      result = await download(
        file.toString(),
        `./src/assets/${file.substring(file.lastIndexOf("/") + 1)}`,
        function(err, res) {
          if (err) {
            console.log(err);
          }
          webp.cwebp(
            `./src/assets/${file.substring(file.lastIndexOf("/") + 1)}`,
            `./src/assets/${file.substring(
              file.lastIndexOf("/") + 1,
              file.lastIndexOf(".")
            )}.webp`,
            "-q 80",
            function(status, error) {
              if (status === 100) {
                console.log(status);
              }
            }
          );
        }
      ); // wait for async operation to finish.
    } catch (error) {
      result = "failed:" + error.message;
    }
    results.push(result);
  }
  return results;
};

module.exports = downloadFiles;

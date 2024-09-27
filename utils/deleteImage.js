const fs = require("fs");
const path = require("path");
const url = require("url");
const deleteImageWithUrl = (imageUrl) => {
  const name = url.parse(imageUrl);
  const fileName = path.basename(name.pathname);
  const filePath = path.join(__dirname,"../upload",fileName);
  fs.unlink(filePath, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("File Deleted");
    }
  });
};
module.exports = deleteImageWithUrl;



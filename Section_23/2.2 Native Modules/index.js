const fs = require("fs");
const { data } = require("jquery");

fs.writeFile("message.txt", "Hello world", (err) => {
    if (err) throw err;
    console.log("the file has been saved");
});

fs.readFile("message.txt", "utf8", (err, data) => {
    if (err) throw err;
    console.log(err);
});
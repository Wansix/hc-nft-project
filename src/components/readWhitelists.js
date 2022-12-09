import { readFile } from "fs";

readFile("readTest.txt", "utf-8", (err, data) => {
  console.log(data);
  const arr = data.toString().split("\r\n");
  console.log(arr);
});

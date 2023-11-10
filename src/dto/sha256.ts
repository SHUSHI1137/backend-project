import { join } from "path";
import { readdirSync, readFileSync } from "fs";
import { createHash } from "node:crypto";

const files = readdirSync(__dirname);

files.forEach((filename) => {
  const hash = createHash("sha1");

  const data = readFileSync(join(__dirname, filename));

  hash.update(data);
  console.log(filename, hash.digest("hex"));
});

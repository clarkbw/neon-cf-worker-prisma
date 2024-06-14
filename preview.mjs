import { parse, stringify } from "smol-toml";
import fs from "node:fs";

const WRANGLER = "./wrangler.toml";

try {
  // preview name
  const name = process.argv[2] || "pr-preview";

  const data = fs.readFileSync(WRANGLER, "utf8");

  const parsed = parse(data);

  // object key rename
  // https://stackoverflow.com/questions/4647817/javascript-object-rename-key
  delete Object.assign(parsed.env, { [`${name}`]: parsed.env["preview"] })[
    "preview"
  ];

  parsed.env[`${name}`].vars.ENVIRONMENT = `${name}`;

  const toml = stringify(parsed);
  console.log(toml);

  // fs.writeFileSync(WRANGLER, toml);
} catch (err) {
  console.error(err);
}

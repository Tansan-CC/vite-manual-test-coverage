import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import fs from "fs";
import exec from "child_process";

import crypto from "crypto";

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/report", (req, res) => {
  res.send("ok");

  const data = req.body;
  if (!data) return;
  try {
    if (!fs.existsSync("./raw-data")) {
      fs.mkdirSync("./raw-data");
    }
  } catch (e) {
    console.error('Error creating "raw-data" directory', e);
  }

  try {
    const filename = `./raw-data/${Date.now()}-${getJSONMd5(data)}.json`;
    fs.writeFileSync(filename, JSON.stringify(data));
  } catch (e) {
    console.error("Error writing file", e);
  }

  try {
    exec.execSync(
      "./node_modules/nyc/bin/nyc.js  report --reporter=html --temp-dir=raw-data --all --report-dir=report --exclude-after-remap=true"
    );
  } catch (e) {
    console.error("Error generating report", e);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

const getJSONMd5 = (json) => {
  const jsonString = JSON.stringify(json);
  return crypto.createHash("md5").update(jsonString).digest("hex");
};

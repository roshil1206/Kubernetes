const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const axios = require("axios");
const csvWriter = require("csv-writer").createArrayCsvWriter;

// Adapted from https://www.npmjs.com/package/body-parser
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server is up");
});

const generateJson = (data) => {
  const rows = data.split("\n");
  const json = [];
  rows.forEach((element) => {
    json.push(element.split(",").map((ele) => ele.trim()));
  });
  return json.filter((e, i) => i !== 0);
};

app.post("/store-file", async (req, res) => {
  const { file, data } = req.body;
  try {
    const pathToFile = "/Roshil_PV_dir/" + file;
    const writer = csvWriter({
      header: ["product", "amount"],
      path: pathToFile,
    });
    writer
      .writeRecords(generateJson(data))
      .then(() => {
        return res.json({ file: file, message: "Success." });
      })
      .catch((error) => {
        return res.json({
          file: file,
          error: "Error while storing the file to the storage.",
        });
      });
  } catch (error) {
    return res.json({
      file: file,
      error: "Invalid JSON input.",
    });
  }
});

app.post("/calculate", async (req, res) => {
  const { file, product } = req.body;

  if (!file || file === null) {
    return res.json({
      file: null,
      error: "Invalid JSON input.",
    });
  }

  const pathToFile = "/Roshil_PV_dir/" + file;

  if (fs.existsSync(pathToFile)) {
    //Reffered from https://axios-http.com/docs/post_example
    axios
      .post("http://application2-service:3500/processing", {
        file: file,
        product,
      })
      .then(({ data }) => {
        return res.json(data);
      })
      .catch((error) => {
        return res.json(error);
      });
  } else {
    return res.json({
      file: file,
      error: "File not found.",
    });
  }
});

app.listen(6000, () => {
  console.log("D");
  axios
    .post(
      "https://fmdyn90ov7.execute-api.us-east-1.amazonaws.com/default/start",
      { banner: "B00917345", ip: "34.135.104.229" }
    )
    .then(({ data }) => console.log(data))
    .catch((err) => console.error(err));
});

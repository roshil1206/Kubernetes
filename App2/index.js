const express = require("express");
const app = express();
const fs = require("fs");
const { parse } = require("csv-parse");
const bodyParser = require("body-parser");

// Adapted from https://www.npmjs.com/package/body-parser
app.use(bodyParser.json());

app.post("/processing", async (req, res) => {
  const { file, product } = req.body;

  const pathToFile = "/Roshil_PV_dir/" + file;
  try {
    const result = [];
    let total = 0;

    //Reffered from https://csv.js.org/parse/
    fs.createReadStream(pathToFile)
      .pipe(parse())
      .on("error", (error) => {
        return res.json({
          file: file,
          error: "Input file not in CSV format.",
        });
      })
      .on("data", (data) => {
        result.push({ product: data[0], amount: data[1] });
      })
      .on("end", () => {
        if (result[0].product === "product" && result[0].amount === "amount") {
          result.forEach((resultData) => {
            if (resultData.product === product) {
              total = total + parseInt(resultData.amount);
            }
          });
          return res.json({ file: file, sum: `${total}` });
        } else {
          return res.json({
            file: file,
            error: "Input file not in CSV format.",
          });
        }
      });
  } catch (error) {
    return res.json({
      file: file,
      error: "Input file not in CSV format.",
    });
  }
});

app.listen(3500, () => console.log("Server running on 3500"));

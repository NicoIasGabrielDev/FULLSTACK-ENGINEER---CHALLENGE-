const fs = require("fs");
const { processExcel } = require("../utils/processExcel");

//Adding cache to avoid over processing
let cacheIndicators = null
let cacheFileName = null

function getLatestUploadedFile() {
  const files = fs.readdirSync("uploads");
  if (files.length === 0) return null;

  let sortedFiles = files.sort((a, b) => {
    return (
      fs.statSync(`uploads/${b}`).mtime - fs.statSync(`uploads/${a}`).mtime
    );
  });

  return `uploads/${sortedFiles[0]}`;
}

function getTotalEmissionPerYear(req, res){
  try {
    let indicators = loadIndicatorsOrFail(res);
    return res.json({ data: indicators.totalEmissionPerYear });
  } catch (error) {
    return res.status(500).json({ error: "Internal error, please try again later!" });
  }
};

function getTop5Companies(req, res){
    try {
      let indicators = loadIndicatorsOrFail(res);
      return res.json({ data: indicators.top5EmissionCompanies });
    } catch (error) {
      return res.status(500).json({ error: "Internal error, please try again later!" });
    }
  };

function getAverageConsumeByCompany(req, res){
  try {
    let indicators = loadIndicatorsOrFail(res);
    return res.json({ data: indicators.averageConsumeByCompany });
  } catch (error) {
    return res.status(500).json({ error: "Internal error, please try again later!" });
  }
};

function getTotalSectorConsume(req, res){
  try {
    let indicators = loadIndicatorsOrFail(res);
    return res.json({ data: indicators.sectorConsume });
  } catch (error) {
    return res.status(500).json({ error: "Intern error, please try again later!" });
  }
};

function loadIndicatorsOrFail(res) {
    const filePath = getLatestUploadedFile();
    if (!filePath) {
      return res.status(404).json({ error: "No valid file was updated" });
    }

    if(cacheIndicators && cacheFileName === filePath){
        console.log('file:', cacheFileName)
        return cacheIndicators
    }

    const indicators = processExcel(filePath);
    cacheFileName = filePath;
    cacheIndicators = indicators;
    return indicators;
}


module.exports = {
    getAverageConsumeByCompany,
    getTotalEmissionPerYear,
    getTop5Companies,
    getTotalSectorConsume,
}

const fs = require('fs');
const path = require('path');

let dataCache = null;

function loadData() {
  if(!dataCache) {
    const file = path.resolve(__dirname, '../../mock/data.json');
    const data = JSON.parse(fs.readFileSync(file, {encoding: 'utf-8'}));
    const reports = data.dailyReports;
    dataCache = {};
    // 把数据给处理成以日期为key的JSON格式并缓存起来
    reports.forEach((report) => {
      dataCache[report.updatedDate] = report;
    });
  }
  return dataCache;
}

function getCoronavirusKeyIndex() {
  return Object.keys(loadData());
}

function getCoronavirusByDate(date) {
  const dailyData = loadData()[date] || {};
  if(dailyData.countries) {
    dailyData.countries.sort((a, b) => {
      return b.confirmed - a.confirmed;
    });
  }
  return dailyData;
}

module.exports = {
  getCoronavirusByDate,
  getCoronavirusKeyIndex,
};

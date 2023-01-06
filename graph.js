// 円グラフの表示
function createPieChart(rows) {
  // 円グラフ用のデータを格納する空の連想配列(ハッシュ)を作成
  let pieChartData = {};

  // DBから入出金一覧のデータをカテゴリ毎に取り出して集計。収入は除外。
  let category = "";
  rows.forEach(function (data) {
    category = data.category;
    if (category != "収入") {
      // 連想配列のキーにカテゴリが存在していれば金額を加算
      if (pieChartData[category] === undefined) {
        pieChartData[category] = Number(data.amount);
      } else {
        pieChartData[category] += Number(data.amount);
      }
    }
  });

  // 円グラフ用にカテゴリと合計金額を配列に入れる
  let keyArray = [];
  let valueArray = [];
  for (key in pieChartData) {
    keyArray.push(key);
    valueArray.push(pieChartData[key]);
  }
}

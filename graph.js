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

  //Chart.jsの機能を使用して円グラフを表示
  let pieChart = document.getElementById("pieChart");
  new Chart(pieChart, {
    type: "pie",
    data: {
      labels: keyArray,
      datasets: [
        {
          backgroundColor: [
            "#EB5757",
            "#6FCF97",
            "#56CCF2",
            "#F2994A",
            "#F2C94C",
            "#2F80ED",
            "#9B51E0",
            "#BB6BD9",
          ],
          data: valueArray,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "カテゴリ毎の支出割合",
      },
    },
  });
}

// indexedDBの設定
const dbName = "kakeiboDB";
const storeName = "kakeiboStore";
const dbVersion = 1;

// データベース接続をする、またはデータベースが未作成なら新規作成する
let database = indexedDB.open(dbName, dbVersion);

// データベースとオブジェクトストアの作成
database.onupgradeneeded = function (event) {
  let db = event.target.result;
  db.createObjectStore(storeName, { keyPath: "id" });
  console.log("データベースを新規作成しました");
}

// DB接続に成功したときに発生するイベント
database.onsuccess = function (event) {
  let db = event.target.result;
  // 接続を解除する（DB操作が終了したら必ずcloseする）
  db.close();
  console.log("データベースに接続できました");
}
database.onerror = function (event) {
  console.log("データベースに接続できませんでした");
}

// フォームの内容をDBに登録する
function regist() {
  // フォームの入力チェック。falseが返ったら登録処理を中断
  if (inputCheck() == false) {
    return;
  }

  // ラジオボタンの取得
  let radio = document.getElementsByName("balance");
  let balance;
  for (let i = 0; i < radio.length; i++) {
    if (radio[i].checked == true) {
      balance = radio[i].value;
      break;
    }
  }

  // フォームの値を取得
  let date = document.getElementById("date").value;
  let category = document.getElementById("category").value;
  let amount = document.getElementById("amount").value;
  let memo = document.getElementById("memo").value;
  if (balance == "収入") {
    category = "収入";
  }

  // DBにデータを登録する
  insertData(balance, date, category, amount, memo);

  // データの挿入
  function insertData(balance, date, category, amount, memo) {
    // 一意のIDを現在の日時から作成
    let uniqueID = new Date().getTime().toString();
    console.log(uniqueID);
    // DBに登録するための連想配列のデータを作成
    let data = {
      id: uniqueID,
      balance: balance,
      date: String(date),
      category: category,
      amount: amount,
      memo: memo,
    }

    // DBを開く
    let database = indexedDB.open(dbName, dbVersion);
    // DBの開けなかったときの処理
    database.onerror = function (event) {
      console.log("データベースに接続できませんでした");
    }
    // DBが開いたらデータの登録を実行
    database.onsuccess = function (event) {
      let db = event.target.result;
      let transaction = db.transaction(storeName, "readwrite");
      transaction.oncomplete = function (event) {
        console.log("トランザクション完了");
      }
      transaction.onerror = function (event) {
        console.log("トランザクションエラー");
      }

      let store = transaction.objectStore(storeName);
      let addData = store.add(data);
      addData.onsuccess = function () {
        console.log("データが登録できました");
        alert("登録しました");
      }
      addData.onerror = function () {
        console.log("データが登録できませんでした");
      }
      db.close();
    }
  }

  // 入出金一覧を作成
  createList();
}

// 入出金一覧表示
function createList() {
  // DBからデータを全件取得
  let database = indexedDB.open(dbName);
  database.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction(storeName, "readonly");
    let store = transaction.objectStore(storeName);
    store.getAll().onsuccess = function (data) {
      console.log(data);
      let rows = data.target.result;

      let section = document.getElementById("list");
      // 入出金一覧のテーブルを作る
      // バッククオートでヒアドキュメント（複数行の代入が可能）
      let table = `
        <table>
          <tr>
            <th>日付</th>
            <th>収支</th>
            <th>カテゴリ</th>
            <th>金額</th>
            <th>メモ</th>
            <th>削除</th>
          </tr>
        `;
      // 入出金データの表示
      rows.forEach((element) => {
        console.log(element);
        table += `
            <tr>
              <td>${element.date}</td>
              <td>${element.balance}</td>
              <td>${element.category}</td>
              <td>${element.amount}</td>
              <td>${element.memo}</td>
              <td><button onclick="deleteData('${element.id}')">✕</button></td>
            </tr>
          `;
      });
      table += `</table>`; // 最後にtable閉じタグを追加することでテーブルを完成させる
      section.innerHTML = table;
      // 円グラフの作成
      createPieChart(rows);
    }
  }
}

// データの削除
function deleteData(id) {
  // DBを開く
  let database = indexedDB.open(dbName, dbVersion);
  database.onupgradeneeded = function (event) {
    let db = event.target.result;
  }
  // DBが開いたら削除を実行
  database.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction(storeName, "readwrite");
    transaction.oncomplete = function (event) {
      console.log("トランザクション完了");
    }
    transaction.onerror = function (event) {
      console.log("トランザクションエラー");
    }
    let store = transaction.objectStore(storeName);

    // データの削除
    let deleteData = store.delete(id);
    deleteData.onsuccess = function (event) {
      console.log("削除成功");
      createList();
    }
    deleteData.onerror = function (event) {
      console.log("削除失敗");
    }
    // DBを閉じる
    db.close();
  }
  // DBが開けなかった場合の処理
  database.onerror = function (event) {
    console.log("データベースに接続できませんでした");
  }
}

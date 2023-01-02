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

// データベース接続に成功したときに発生するイベント
database.onsuccess = function (event) {
  let db = event.target.result;
  // 接続を解除する（DB操作が終了したら必ずcloseする）
  db.close();
  console.log("データベースに接続できました");
}
database.onerror = function (event) {
  console.log("データベースに接続できませんでした");
}

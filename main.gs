var line_endpoint = "https://api.line.me/v2/bot/message/reply";
var url = "https://api.line.me/v2/bot/message/reply";

var sheet = SpreadsheetApp.openById(linesheet).getSheetByName('ログ');
var question = SpreadsheetApp.openById(linesheet).getSheetByName('問題');
var database = SpreadsheetApp.openById(linesheet).getSheetByName('回答一覧');
var info = SpreadsheetApp.openById(linesheet).getSheetByName('情報');
var sent = SpreadsheetApp.openById(linesheet).getSheetByName('配信内容');
var id = SpreadsheetApp.openById(linesheet).getSheetByName('データベース');
var datasheet = SpreadsheetApp.openById(linesheet).getSheetByName('データシート');
var final = SpreadsheetApp.openById(linesheet).getSheetByName('健康観察');
var weather = SpreadsheetApp.openById().getSheetByName('天気シート');
var delaytrain = SpreadsheetApp.openById().getSheetByName('遅延情報');

//おみくじシート
var log = SpreadsheetApp.openById().getSheetByName('ログ');
var item = SpreadsheetApp.openById(").getSheetByName('項目別');
var base = SpreadsheetApp.openById().getSheetByName('データベース');

var weatherlist = { "日付": 0, "天気": 1, "雲量": 2, "降水確率": 3, "最低気温": 4, "最高気温": 5, "湿度": 6, "日の出": 7, "日の入": 8, "月の出": 9, "月の入": 10, "月相": 11, "朝｜気温": 12, "朝｜体感気温": 13, "昼｜気温": 14, "昼｜体感気温": 15, "夕方｜気温": 16, "夕方｜体感気温": 17, "夜｜気温": 18, "夜｜体感気温": 19, "露点温度": 20, "海面大気圧": 21, "風速": 22, "突風": 23, "風向": 24, "紫外線量": 25, "降水量": 26, "積雪量": 27 };

var trainlist = { "高崎線": 2, "湘南新宿ライン": 6, "上野東京ライン": 10, "宇都宮線": 14, "京浜東北線": 18, "埼京線": 22, "ニューシャトル": 26, "東武アーバンパークライン": 30, "東武スカイツリーライン": 34, "東武日光線": 38 };

function doPost(e) {
  var json = e.postData.contents;
  var events = JSON.parse(json).events;

  events.forEach(function (e) {
    var userID = e.source.userId;
    var options = { "headers": { "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN } };
    var getname = UrlFetchApp.fetch("https://api.line.me/v2/bot/profile/" + userID, options);
    var displayname = JSON.parse(getname).displayName;
    var date = new Date();
    var time = Utilities.formatDate(date, 'Asia/Tokyo', 'dd日 hh時mm分');

    if (e.type == "postback") {
      var user_data = e.postback.data;
      user_data = user_data.split(",");

      var row = question.getRange(1, 6).getValue();

      if (Number(user_data[0]) == 0) {
        if (row == Number(user_data[1])) {
          var user_message = user_data[2];
          var user_row = Number(Usercheck(userID)) + 2;
          var gettext = database.getRange(user_row, Number(row * 2 + 3)).getValue();
          if (gettext == "") {
            database.getRange(user_row, Number(row * 2 + 2)).setValue(user_message);
            var test = database.getRange(Number(user_row), 1).getValue();
            var text = "";
            var senttext = sent.getRange(1, 2).getValue();
            var dev = senttext.split("。");
            var count = dev.length;
            for (var tt = 0; tt < count; tt++) {
              if (dev[tt] != "") {
                text += dev[tt] + "。\n"
              } else {
                text += dev[tt] + "\n"
              }
            }
            text += "前日までの正答数: " + test.toString();
            CHECK(user_row, Number(raw * 2 + 3), user_message);

          } else {
            var text = "回答済みです。";
          }
        }

        SEND(e, 1, text);
      } else if (Number(user_data[0]) == 1) {
        var rownum = Usercheck(userID);
        var date = new Date();
        var checktime = Utilities.formatDate(date, 'Asia/Tokyo', 'HH');

        if (checktime >= 0 && checktime < 5) {//前日処理
          date.setDate(date.getDate() - 1);
          var month = Utilities.formatDate(date, 'Asia/Tokyo', 'MM');
          var health = SpreadsheetApp.openById().getSheetByName(Number(month).toString() + "月");
          var time = Utilities.formatDate(date, 'Asia/Tokyo', 'dd');
          var dt = Utilities.formatDate(date, 'Asia/Tokyo', 'MM月dd日');

        } else {//当日処理
          var month = Utilities.formatDate(date, 'Asia/Tokyo', 'MM');
          var health = SpreadsheetApp.openById().getSheetByName(Number(month).toString() + "月");
          var time = Utilities.formatDate(date, 'Asia/Tokyo', 'dd');
          var dt = Utilities.formatDate(date, 'Asia/Tokyo', 'MM月dd日');

        }
        var check = Number(time);
        var test = health.getRange(rownum + 3, check + 3).getValue();
        var name = health.getRange(rownum + 3, 2).getValue();
        health.getRange(rownum + 3, check + 3).setValue("◎_" + user_data[1]);
        if (test == "") {
          var text = "【健康観察記録】\n名前： " + name + "\n記録対象日: " + dt + "\n\n新規で健康観察を記録しました。\n当日から次の日の午前5時までなら変更することができます。";
          SEND(e, 1, text)

        } else if (test.match(/◎/)) {
          var text = "【健康観察記録】\n名前： " + name + "\n記録対象日: " + dt + "\n\n本日はすでに「健康」で記録されています。\n当日から次の日の午前5時までなら変更することができます。"
          SEND(e, 1, text);
        } else {
          var text = "【健康観察記録】\n名前： " + name + "\n記録対象日: " + dt + "\n\n「体調が悪い」から「健康」に変更しました。\n当日から次の日の午前5時までなら変更することができます。"
          SEND(e, 1, text);

        }

      } else {
        var text = "回答ありがとうございます。"
        SEND(e, 1, text);

      }

    } else if (e.type == "message") {
      var user_message = e.message.text;
      var check = question.getRange(1, 6).getValue();
      var row = check + 1;
      var idlast = id.getLastRow();

      if (user_message == "解説") {
        var row = question.getRange(1, 6).getValue();
        var ans = question.getRange(row + 1, 1, 1, 5).getValues();
        var text = "出題日：　{day}\n模範解答：　{answer}\n解説：　\n\n";
        text = text.replace("{day}", ans[0][1]).replace("{answer}", ans[0][3]);
        var dev = ans[0][4].split("。");
        var count = dev.length;
        for (var tt = 0; tt < count; tt++) {
          if (dev[tt] != "") {
            text += dev[tt] + "。\n"
          } else {
            text += dev[tt] + "\n"
          }
        }
        var par = info.getRange(check + 2, 5, 1, 4).getValues();
        var n = info.getRange(check + 2, 2).getValue();
        var senttext = sent.getRange(4, 2).getValue();
        var dev = senttext.split("。");
        var count = dev.length;
        for (var tt = 0; tt < count; tt++) {
          if (dev[tt] != "") {
            text += dev[tt] + "。\n"
          } else {
            text += dev[tt] + "\n"
          }
        }
        text += "\nA選択割合：　" + Math.round(par[0][0]) + "％\nB選択割合：　" + Math.round(par[0][1]) + "％\nC選択割合：　" + Math.round(par[0][2]) + "％\nD選択割合：　" + Math.round(par[0][3]) + "％\nn=" + n
        SEND(e, 1, text);
      }

      } else if (user_message == "健康") {
        sendbutton(e);


      } else if (user_message == "おみくじ") {
        var database_lastrow = base.getLastRow();
        var getdata = base.getRange(2, 1, database_lastrow - 1, 1).getValues();
        var row = base.getRange(1, 4).getValue() + 3;
        var user = 0;
        for (var n = 0; n <= database_lastrow - 2; n++) {
          if (userID == getdata[n][0]) {
            var checkcell = base.getRange(n + 2, row).getValue();
            user = 1;
            if (checkcell == "") {
              base.getRange(n + 2, row).setValue("T");
              Random(displayname, time, e);
            } else {
              var text = "【占いシステム】\n\n一日一回までです。";

              SEND(e, 1, text);
            }
            break
          }
        }
        if (user == 0) {
          var setup = [[userID, "", displayname]];
          base.getRange(database_lastrow + 1, 1, 1, 3).setValues(setup);
          base.getRange(database_lastrow + 1, row).setValue("T");
          Random(displayname, time, e);
        }

      } else if (user_message == "天気") {
        var text = "【天気予報】\n"
        var rownum = Usercheck(userID);

        var userdata = id.getRange(rownum + 2, 12).getValue();
        var userday = 2;
        var weatherlistdata = weather.getRange(2, 3, 39, 5).getValues();
        var userlist = userdata.split("、");
        var count = userlist.length;
        for (var useday = 0; useday <= userday - 1; useday++) {
          for (var ss = 0; ss < count; ss++) {
            text += "\n" + userlist[ss] + ":　";

            var row = weatherlist[userlist[ss]];
            var weatherdata = weatherlistdata[Number(row)][useday];
            if (weatherdata.toString().match(/undefined/)) {
              text += "データなし";
            } else {
              text += weatherlistdata[Number(row)][useday];
            }
          }
          text += "_"
        }
        var weathertext = text.split("_");
        var text = weathertext[0];
        var aql = "【現在の大気】\n\n"
        var airdata = weather.getRange(3, 9, 10, 2).getValues();
        for (var t = 0; t <= 9; t++) {
          aql += airdata[t][0] + ": " + airdata[t][1] + "\n";
        }

        if (userday == 2) {
          var text2 = weathertext[1];
          var text3 = aql;
        } else if (userday == 3) {
          var text2 = weathertext[1];
          var text3 = weathertext[2];
          var text4 = aql;
        } else if (userday == 4) {
          var text2 = weathertext[1];
          var text3 = weathertext[2];
          var text4 = weathertext[3];
          var text5 = aql;
        } else {
          var text2 = aql;
        }
        SEND(e, userday + 1, text, text2, text3, text4, text5);

      } else if (user_message == "電車") {
        var text = "『電車遅延情報』\n\n"
        var rownum = Usercheck(userID);
        var check = id.getRange(rownum + 2, 13).getValue();
        if (check != "") {
          var checklist = check.split("、");
          var count = checklist.length;
          for (var n = 0; n <= count - 1; n++) {
            if (checklist[n] != "") {
              var trainrow = trainlist[checklist[n]];
              var data = delaytrain.getRange(trainrow, 1, 3, 3).getValues();
              text += "\n【 " + data[0][0] + " 】\n更新時間： " + data[0][1] + "\n運行状況： " + data[1][1] + " " + data[1][2] + "\n" + data[2][1] + "\n"
            }
          }
          text += "\"
          SEND(e, 1, text);
        } else {
          var text = "事前登録が必要です。\n登録フォームから登録してください。"
          var text2 = ;
          SEND(e, 2, text, text2);
        }

      }else {


      }
    }
  });
  dolog(json);
}


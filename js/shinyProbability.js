// ShinyProbability

document.getElementById("traialsIncrementButton").onclick = function addCnt() {
  // HTML要素から要素を読み込み
  const traialsInput = document.getElementById("traialsInput");

  // 試行回数を+1
  traialsInput.value++;

  // 確率計算を行って反映
  shinyProbability();
};

document.getElementById("traialsDecrementButton").onclick = function subCnt() {
  // HTML要素から要素を読み込み
  const traialsInput = document.getElementById("traialsInput");

  // 試行回数を-1
  traialsInput.value--;

  // 確率計算を行って反映
  shinyProbability();
};

// 世代の確率を押すと確率を反映
document.getElementById("calcProbabilityButton").onclick =
  function setProbability() {
    // 世代を特定
    const generationSelector = document.getElementById("generationSelector");
    var genRadio = "";

    // 世代ごと確率合算
    var rateArr = "";
    switch (Number(generationSelector.value)) {
      case 1:
      case 2:
        genRadio = document.getElementsByName("gen1Radio");
        rateArr = calcGen1(genRadio);
        break;
      case 3:
        genRadio = document.getElementsByName("gen3Radio");
        rateArr = calcGen3(genRadio);
        break;
      case 4:
        genRadio = document.getElementsByName("gen4Radio");
        rateArr = calcGen4(genRadio);
        break;
      case 5:
        genRadio = document.getElementsByName("gen5Radio");
        rateArr = calcGen5(genRadio);
        break;
      case 6:
        genRadio = document.getElementsByName("gen6Radio");
        rateArr = calcGen6(genRadio);
        break;
      case 7:
        disableCheckboxGen7();
        genRadio = document.getElementsByName("gen7Radio");
        rateArr = calcGen7(genRadio);
        break;
      case 8:
        disableCheckboxGen8();
        genRadio = document.getElementsByName("gen8Radio");
        rateArr = calcGen8(genRadio);
        break;
      case 9:
        disableCheckboxGen9();
        genRadio = document.getElementsByName("gen9Radio");
        rateArr = calcGen9(genRadio);
        break;
      default:
        return 0;
    }
    let numerator = rateArr[0];
    let denominator = rateArr[1];

    // 約分処理
    let numArr = irreducible(numerator, denominator);
    numerator = numArr[0];
    denominator = numArr[1];
    console.log(numerator + " / " + denominator);

    // HTMLを書き換え
    const shinyProbabilityNumerator = document.getElementById(
      "shinyProbabilityNumerator"
    );
    const shinyProbabilityDenominator = document.getElementById(
      "shinyProbabilityDenominator"
    );
    shinyProbabilityNumerator.value = numerator;
    shinyProbabilityDenominator.value = denominator;

    // Cookieに記述
    document.cookie =
      "numerator=" +
      encodeURIComponent(numerator) +
      "; max-age=" +
      60 * 60 * 24 * 365;
    document.cookie =
      "denominator=" +
      encodeURIComponent(denominator) +
      "; max-age=" +
      60 * 60 * 24 * 365;

    // 再計算
    shinyProbability();
  };

// 特定のボタンにチェックが入ったらチェックを外す
function disableCheckboxGen7() {
  // SM, USUM, LGP, LGE
  const gen7Radio = document.getElementsByName("gen7Radio");
  // LGP, LGEには`国際孵化`,`乱入バトル`は存在しない
  if (gen7Radio[1].checked || gen7Radio[2].checked) {
    gen7Radio[4].checked = false;
    gen7Radio[5].checked = false;
  }
}
function disableCheckboxGen8() {
  // SWSH, BDSP, LA
  const gen8Radio = document.getElementsByName("gen8Radio");
  // LAには`国際孵化`,`ポケトレ`,`戦った数（500匹以上）`,`ダイマックスアドベンチャー`は存在しない
  if (
    gen8Radio[1].checked ||
    gen8Radio[2].checked ||
    gen8Radio[3].checked ||
    gen8Radio[4].checked
  ) {
    gen8Radio[6].checked = false;
    gen8Radio[7].checked = false;
    gen8Radio[8].checked = false;
    gen8Radio[9].checked = false;
    gen8Radio[10].checked = false;
  }
  // ダイマックスアドベンチャーはひかるおまもりの効果はない
  if (gen8Radio[4].checked) gen8Radio[5].checked = false;
  // ひかるおまもりが両方計算されるのを防ぐ
  if (gen8Radio[0].checked && gen8Radio[5].checked && gen8Radio[6].checked) {
    gen8Radio[5].checked = false;
    gen8Radio[6].checked = false;
  }
  // 大量発生と大大大発生は重複しない
  if (gen8Radio[7].checked && gen8Radio[8].checked) {
    gen8Radio[7].checked = false;
    gen8Radio[8].checked = false;
  }
}
function disableCheckboxGen9() {
  // SV
  const gen9Radio = document.getElementsByName("gen9Radio");
  // 国際孵化では`大量発生`はあり得ない。また`かがやきパワーLv3`の効果もない。
  if (gen9Radio[1].checked) {
    gen9Radio[3].checked = false;
    gen9Radio[4].checked = false;
  }
}

// 世代ごとの確率合算
function calcGen1(gen1Radio) {
  // 自然遭遇
  if (gen1Radio[0].checked) {
    numerator = 1;
    denominator = 8192;
  }
  // 遺伝
  if (gen1Radio[1].checked) {
    numerator = 1;
    denominator = 64;
  }
  return [numerator, denominator];
}
function calcGen3(gen3Radio) {
  // 自然遭遇
  if (gen3Radio[0].checked) {
    numerator = 1;
    denominator = 8192;
  }
  return [numerator, denominator];
}
function calcGen4(gen4Radio) {
  // 自然遭遇
  if (gen4Radio[0].checked) {
    numerator = 1;
    denominator = 8192;
  }
  // 国際孵化
  if (gen4Radio[1].checked) {
    numerator = 5;
    denominator = 8192;
  }
  // ポケトレ
  if (gen4Radio[2].checked) {
    numerator = 41;
    denominator = 8192;
  }
  return [numerator, denominator];
}
function calcGen5(gen5Radio) {
  // 自然遭遇
  if (gen5Radio[0].checked) {
    numerator = 1;
    denominator = 8192;
  }
  // 国際孵化
  if (gen5Radio[1].checked) {
    numerator = 6;
    denominator = 8192;
  }
  // ひかるおまもり
  if (gen5Radio[2].checked) {
    numerator += 2;
  }
  return [numerator, denominator];
}
function calcGen6(gen6Radio) {
  // 自然遭遇
  if (gen6Radio[0].checked) {
    numerator = 1;
    denominator = 4096;
  }
  // 国際孵化
  if (gen6Radio[1].checked) {
    numerator = 6;
    denominator = 4096;
  }
  // ポケトレ
  if (gen6Radio[2].checked) {
    numerator = 1;
    denominator = 100;
  }
  // フレンドサファリ
  if (gen6Radio[3].checked) {
    numerator = 5;
    denominator = 4096;
  }
  // 連続釣り
  if (gen6Radio[4].checked) {
    numerator = 41;
    denominator = 4096;
  }
  // ひかるおまもり
  if (gen6Radio[5].checked) {
    numerator += 2;
  }
  return [numerator, denominator];
}
function calcGen7(gen7Radio) {
  // 自然遭遇
  if (gen7Radio[0].checked) {
    numerator = 1;
    denominator = 4096;
  }
  // 国際孵化
  if (gen7Radio[1].checked) {
    numerator = 6;
    denominator = 4096;
  }
  // 乱入バトル
  if (gen7Radio[2].checked) {
    numerator = 13;
    denominator = 4096;
  }
  // ひかるおまもり
  if (gen7Radio[3].checked) {
    numerator += 2;
  }
  // 31連鎖（捕獲）
  if (gen7Radio[4].checked) {
    numerator += 11;
  }
  // むしよせコロン
  if (gen7Radio[5].checked) {
    numerator += 1;
  }
  return [numerator, denominator];
}
function calcGen8(gen7Radio) {
  // 自然遭遇
  if (gen7Radio[0].checked) {
    numerator = 1;
    denominator = 4096;
  }
  // 国際孵化
  if (gen7Radio[1].checked) {
    numerator = 6;
    denominator = 4096;
  }
  // ポケトレ
  if (gen7Radio[2].checked) {
    numerator = 1;
    denominator = 99;
  }
  // 戦った数（500匹以上）
  if (gen7Radio[3].checked) {
    numerator = 1;
    denominator = 3472;
  }
  // ダイマックスアドベンチャー
  if (gen7Radio[4].checked) {
    numerator = 1;
    denominator = 300;
  }
  // ひかるおまもり SWSH, BDSP
  if (gen7Radio[5].checked) {
    numerator += 2;
  }
  // ひかるおまもり LA
  if (gen7Radio[6].checked) {
    numerator += 3;
  }
  // 大量発生
  if (gen7Radio[6].checked) {
    numerator += 25;
  }
  // 大大大発生
  if (gen7Radio[7].checked) {
    numerator += 12;
  }
  // 図鑑研究レベル10
  if (gen7Radio[8].checked) {
    numerator += 1;
  }
  // 図鑑タスク完璧
  if (gen7Radio[9].checked) {
    numerator += 2;
  }
  return [numerator, denominator];
}
function calcGen9(gen9Radio) {
  let numerator = 0;
  let denominator = 0;
  // 自然遭遇
  if (gen9Radio[0].checked) {
    numerator = 1;
    denominator = 4096;
  }
  // 国際孵化
  if (gen9Radio[1].checked) {
    numerator = 6;
    denominator = 4096;
  }
  // ひかるおまもり
  if (gen9Radio[2].checked) numerator += 2;
  // 大量発生
  if (gen9Radio[3].checked) numerator += 2;
  // かがやきパワーLv3
  if (gen9Radio[4].checked) numerator += 3;
  return [numerator, denominator];
}

// 約分する関数
function gcd(a, b) {
  if (a < b) [a, b] = [b, a];
  let r = 1;
  while (r != 0) {
    r = a % b;
    a = b;
    b = r;
  }
  return a;
}
function irreducible(a, b) {
  let GCD = gcd(a, b);
  while (GCD > 1) {
    a /= GCD;
    b /= GCD;
    GCD = gcd(a, b);
  }
  // 呼び出し元に配列で返す
  return [a, b];
}

// inputNumberの有効桁数制限
// デフォルトでは有効桁数を9桁に設定
// 足を切り捨てする動作
// 似た動作なのでイベントをまとめたい
document.getElementById("traialsInput").oninput = function sliceMaxLength() {
  traialsInput.value = traialsInput.value.slice(0, 9);
};

document.getElementById("shinyProbabilityNumerator").oninput =
  function sliceMaxLength() {
    shinyProbabilityNumerator.value = shinyProbabilityNumerator.value.slice(
      0,
      9
    );
  };

document.getElementById("shinyProbabilityDenominator").oninput =
  function sliceMaxLength() {
    shinyProbabilityDenominator.value = shinyProbabilityDenominator.value.slice(
      0,
      9
    );
  };

// カーソルが外れたら再計算
// 対象はinputNumberのみ（増えるとカウンターボタンからの再計算は過剰と判断）
// 似た動作なのでイベントをまとめたい
document.getElementById("traialsInput").onblur = function reCalc() {
  shinyProbability();
};

document.getElementById("shinyProbabilityNumerator").onblur =
  function reCalc() {
    shinyProbability();
  };

document.getElementById("shinyProbabilityDenominator").onblur =
  function reCalc() {
    shinyProbability();
  };

// 起動時にcookie読み込んで反映
window.onload = function onload() {
  // cookieの内容を`;'で分割
  // (キー1)=(値1); (キー2)=(値2);
  // ↓
  // cookieItem[0] = '(キー1)=(値1)'
  // cookieItem[2] = '(キー2)=(値2)'
  var cookies = document.cookie;
  var cookieItem = cookies.split(";");

  // cookieItemを`=`で区切る
  // elem[0]とemem[1]でペア、elem[2]とelem[3]でペア...
  var cookieValue = "";
  for (i = 0; i < cookieItem.length; i++) {
    var elem = cookieItem[i].split("=");
    //
    if (elem[0].trim() == "traialsInput") {
      cookieValue = unescape(elem[1]);
      // 試行回数をページに反映
      traialsInput.value = decodeURIComponent(cookieValue);
      console.log("cookie試行回数: " + cookieValue);
    } else if (elem[0].trim() == "shinyProbabilityNumerator") {
      cookieValue = unescape(elem[1]);
      // 分子をページに反映
      shinyProbabilityNumerator.value = decodeURIComponent(cookieValue);
      console.log("cookie分子: " + cookieValue);
    } else if (elem[0].trim() == "shinyProbabilityDenominator") {
      cookieValue = unescape(elem[1]);
      // 分母をページに反映
      shinyProbabilityDenominator.value = decodeURIComponent(cookieValue);
      console.log("cookie分母: " + cookieValue);
    } else {
      continue;
    }
  }
  // 確率計算を行って反映
  shinyProbability();
};

// 確率演算処理
function shinyProbability() {
  let startTime = performance.now();

  // HTML要素から要素を読み込み
  const encounterProbabilityTitle = document.getElementById(
    "encounterProbabilityTitle"
  );
  const traialsInput = document.getElementById("traialsInput");
  const shinyProbabilityNumerator = document.getElementById(
    "shinyProbabilityNumerator"
  );
  const shinyProbabilityDenominator = document.getElementById(
    "shinyProbabilityDenominator"
  );

  let numerator = shinyProbabilityNumerator.value;
  let denominator = shinyProbabilityDenominator.value;
  let traials = traialsInput.value;

  // 分子と分母のいずれかが空または0の時、演算しない
  // 変数がnull, undefined, '', 0だった場合はfalse
  if (!(traials) || !(numerator) || !(denominator)) return 0;

  // 約分処理
  // 配列で受け取る
  let numArr = irreducible(numerator, denominator);
  numerator = numArr[0];
  denominator = numArr[1];
  console.log("約分した結果: " + numerator + " / " + denominator);

  // 約分した結果をHTMLに反映
  shinyProbabilityNumerator.value = numerator;
  shinyProbabilityDenominator.value = denominator;

  // 演算
  // 小数点以下の有効桁数を3桁に制限
  const digit = 3;

  // DefaultJS版: 小数点以下の有効桁数は15桁まで 処理早い(0.65ms/call)
  // `色違いになる確率:1/512`の時、`試行回数:19145`までは維持するが、19146以降は100%になってしまう
  var shinyProbabilityNum =
    (1 - Math.pow(1 - numerator / denominator, traialsInput.value)) * 100;
  console.log("jsでの遭遇する確率: " + shinyProbabilityNum);
  // 小数点有効桁3桁で切り捨て
  var shinyProbabilityValue =
    Math.floor(shinyProbabilityNum * Math.pow(10, digit)) / Math.pow(10, digit);
  // 小数点有効桁3桁固定表示
  var shinyProbabilityValue = shinyProbabilityValue.toLocaleString(undefined, {
    minimumFractionDigits: digit,
    maximumFractionDigits: digit,
  });
  encounterProbabilityTitle.innerHTML = shinyProbabilityValue;

  // // bignumber.js: 小数点以下の有効桁数は20桁まで 処理遅い(1180ms/call)
  // var shinyProbabilityBicNum = new BigNumber(new BigNumber(1).minus(new BigNumber(new BigNumber(1).minus(new BigNumber(numerator).div(denominator))).pow(traialsInput.value))).times(100).dp(digit, BigNumber.ROUND_DOWN);
  // console.log('bignumber.jsでの遭遇する確率: ' + shinyProbabilityBicNum);
  // encounterProbabilityTitle.innerHTML = shinyProbabilityBicNum;

  // cookie書き込み
  // cookieの有効期限は1年（これが妥当かは分かりかねますが...）
  document.cookie =
    "traialsInput=" +
    encodeURIComponent(traialsInput.value) +
    "; max-age=" +
    60 * 60 * 24 * 365;
  document.cookie =
    "shinyProbabilityNumerator=" +
    encodeURIComponent(shinyProbabilityNumerator.value) +
    "; max-age=" +
    60 * 60 * 24 * 365;
  document.cookie =
    "shinyProbabilityDenominator=" +
    encodeURIComponent(shinyProbabilityDenominator.value) +
    "; max-age=" +
    60 * 60 * 24 * 365;

  // 確認用
  console.log("試行回数: " + traialsInput.value);
  console.log("色違いになる確率: " + encounterProbabilityTitle.innerHTML);
  let endTime = performance.now();
  console.log(endTime - startTime + " ms/call");
}

// 世代の選択によってチェックボックスを作成
document.getElementById("generationSelector").onchange =
  function createCheckbox() {
    const generationSelector = document.getElementById("generationSelector");
    const checkboxs = document.getElementById("checkboxs");

    // 確認用
    console.log("generation: " + generationSelector.value);

    // 生成済みのチェックボックスを削除
    while (checkboxs.firstChild) checkboxs.removeChild(checkboxs.firstChild);

    switch (Number(generationSelector.value)) {
      case 1:
      // 1世代と2世代は色違いにする方法が同じ
      case 2:
        // RGBP, GSC
        // feildset
        var gen1RGBPFieldset = document.createElement("fieldset");
        gen1RGBPFieldset.setAttribute("class", "genFieldset");
        gen1RGBPFieldset.setAttribute("id", "gen1RGBPId");
        checkboxs.appendChild(gen1RGBPFieldset);
        const gen1RGBPFieldsets = document.getElementById("gen1RGBPId");
        // legend
        var gen1RGBPlegend = document.createElement("legend");
        gen1RGBPlegend.innerHTML = "RGBP, GSC";
        gen1RGBPFieldsets.appendChild(gen1RGBPlegend);

        // gen1Naturalを生成
        // label
        var gen1NaturalLabel = document.createElement("label");
        gen1NaturalLabel.setAttribute("for", "gen1Natural");
        gen1NaturalLabel.setAttribute("class", "genLabel");
        gen1NaturalLabel.setAttribute("id", "gen1NaturalId");
        gen1RGBPFieldsets.appendChild(gen1NaturalLabel);
        const gen1NaturalLabels = document.getElementById("gen1NaturalId");
        // checkbox
        var gen1Natural = document.createElement("input");
        gen1Natural.setAttribute("type", "radio");
        gen1Natural.setAttribute("id", "gen1Natural");
        gen1Natural.setAttribute("name", "gen1Radio");
        gen1Natural.setAttribute("checked", "");
        gen1NaturalLabels.appendChild(gen1Natural);
        // 名称
        gen1NaturalLabel.innerHTML += "自然遭遇";

        // gen1Heredityを生成
        // label
        var gen1HeredityLabel = document.createElement("label");
        gen1HeredityLabel.setAttribute("for", "gen1Heredity");
        gen1HeredityLabel.setAttribute("class", "genLabel");
        gen1HeredityLabel.setAttribute("id", "gen1HeredityId");
        gen1RGBPFieldsets.appendChild(gen1HeredityLabel);
        const gen1HeredityLabels = document.getElementById("gen1HeredityId");
        // input
        var gen1Heredity = document.createElement("input");
        gen1Heredity.setAttribute("type", "radio");
        gen1Heredity.setAttribute("id", "gen1Heredity");
        gen1Heredity.setAttribute("name", "gen1Radio");
        gen1HeredityLabels.appendChild(gen1Heredity);
        // 名称
        gen1HeredityLabel.innerHTML += "遺伝";
        break;
      case 3:
        // RSE, FRLG
        // feildset
        var gen3RSEFieldset = document.createElement("fieldset");
        gen3RSEFieldset.setAttribute("class", "genFieldset");
        gen3RSEFieldset.setAttribute("id", "gen3RSEId");
        checkboxs.appendChild(gen3RSEFieldset);
        const gen3RSEFieldsets = document.getElementById("gen3RSEId");
        // legend
        var gen3RSElegend = document.createElement("legend");
        gen3RSElegend.innerHTML = "RSE, FRLG";
        gen3RSEFieldsets.appendChild(gen3RSElegend);

        // gen3Naturalを生成
        // label
        var gen3NaturalLabel = document.createElement("label");
        gen3NaturalLabel.setAttribute("for", "gen3Natural");
        gen3NaturalLabel.setAttribute("class", "genLabel");
        gen3NaturalLabel.setAttribute("id", "gen3NaturalId");
        gen3RSEFieldsets.appendChild(gen3NaturalLabel);
        const gen3NaturalLabels = document.getElementById("gen3NaturalId");
        // checkbox
        var gen3Natural = document.createElement("input");
        gen3Natural.setAttribute("type", "radio");
        gen3Natural.setAttribute("id", "gen3Natural");
        gen3Natural.setAttribute("name", "gen3Radio");
        gen3Natural.setAttribute("checked", "");
        gen3NaturalLabels.appendChild(gen3Natural);
        // 名称
        gen3NaturalLabel.innerHTML += "自然遭遇";
        break;
      case 4:
        // DPt, HGSS
        // feildset
        var gen4DptFieldset = document.createElement("fieldset");
        gen4DptFieldset.setAttribute("class", "genFieldset");
        gen4DptFieldset.setAttribute("id", "gen4DptId");
        checkboxs.appendChild(gen4DptFieldset);
        const gen4DptFieldsets = document.getElementById("gen4DptId");
        // legend
        var gen4Dptlegend = document.createElement("legend");
        gen4Dptlegend.innerHTML = "DPt, HGSS";
        gen4DptFieldsets.appendChild(gen4Dptlegend);

        // gen4Naturalを生成
        // label
        var gen4NaturalLabel = document.createElement("label");
        gen4NaturalLabel.setAttribute("for", "gen4Natural");
        gen4NaturalLabel.setAttribute("class", "genLabel");
        gen4NaturalLabel.setAttribute("id", "gen4NaturalId");
        gen4DptFieldsets.appendChild(gen4NaturalLabel);
        const gen4NaturalLabels = document.getElementById("gen4NaturalId");
        // checkbox
        var gen4Natural = document.createElement("input");
        gen4Natural.setAttribute("type", "radio");
        gen4Natural.setAttribute("id", "gen4Natural");
        gen4Natural.setAttribute("name", "gen4Radio");
        gen4Natural.setAttribute("checked", "");
        gen4NaturalLabels.appendChild(gen4Natural);
        // 名称
        gen4NaturalLabel.innerHTML += "自然遭遇";

        // gen4MasudaMethodを生成
        // label
        var gen4MasudaMethodLabel = document.createElement("label");
        gen4MasudaMethodLabel.setAttribute("for", "gen4MasudaMethod");
        gen4MasudaMethodLabel.setAttribute("class", "genLabel");
        gen4MasudaMethodLabel.setAttribute("id", "gen4MasudaMethodId");
        gen4DptFieldsets.appendChild(gen4MasudaMethodLabel);
        const gen4MasudaMethodLabels =
          document.getElementById("gen4MasudaMethodId");
        // checkbox
        var gen4MasudaMethod = document.createElement("input");
        gen4MasudaMethod.setAttribute("type", "radio");
        gen4MasudaMethod.setAttribute("id", "gen4MasudaMethod");
        gen4MasudaMethod.setAttribute("name", "gen4Radio");
        gen4MasudaMethodLabels.appendChild(gen4MasudaMethod);
        // 名称
        gen4MasudaMethodLabel.innerHTML += "国際孵化";

        // gen4PokeRadarを生成
        // label
        var gen4PokeRadarLabel = document.createElement("label");
        gen4PokeRadarLabel.setAttribute("for", "gen4PokeRadar");
        gen4PokeRadarLabel.setAttribute("class", "genLabel");
        gen4PokeRadarLabel.setAttribute("id", "gen4PokeRadarId");
        gen4DptFieldsets.appendChild(gen4PokeRadarLabel);
        const gen4PokeRadarLabels = document.getElementById("gen4PokeRadarId");
        // checkbox
        var gen4PokeRadar = document.createElement("input");
        gen4PokeRadar.setAttribute("type", "radio");
        gen4PokeRadar.setAttribute("id", "gen4PokeRadar");
        gen4PokeRadar.setAttribute("name", "gen4Radio");
        gen4PokeRadarLabels.appendChild(gen4PokeRadar);
        // 名称
        gen4PokeRadarLabel.innerHTML += "ポケトレ";
        break;
      case 5:
        // BW,BW2
        // feildset
        var gen5BWBW2Fieldset = document.createElement("fieldset");
        gen5BWBW2Fieldset.setAttribute("class", "genFieldset");
        gen5BWBW2Fieldset.setAttribute("id", "gen5BWBW2Id");
        checkboxs.appendChild(gen5BWBW2Fieldset);
        const gen5BWBW2Fieldsets = document.getElementById("gen5BWBW2Id");
        // legend
        var gen5BWBW2legend = document.createElement("legend");
        gen5BWBW2legend.innerHTML = "BW, BW2";
        gen5BWBW2Fieldsets.appendChild(gen5BWBW2legend);

        // gen5Naturalを生成
        // label
        var gen5NaturalLabel = document.createElement("label");
        gen5NaturalLabel.setAttribute("for", "gen5Natural");
        gen5NaturalLabel.setAttribute("class", "genLabel");
        gen5NaturalLabel.setAttribute("id", "gen5NaturalId");
        gen5BWBW2Fieldsets.appendChild(gen5NaturalLabel);
        const gen5NaturalLabels = document.getElementById("gen5NaturalId");
        // checkbox
        var gen5Natural = document.createElement("input");
        gen5Natural.setAttribute("type", "radio");
        gen5Natural.setAttribute("id", "gen5Natural");
        gen5Natural.setAttribute("name", "gen5Radio");
        gen5Natural.setAttribute("checked", "");
        gen5NaturalLabels.appendChild(gen5Natural);
        // 名称
        gen5NaturalLabel.innerHTML += "自然遭遇";

        // gen5MasudaMethodを生成
        // label
        var gen5MasudaMethodLabel = document.createElement("label");
        gen5MasudaMethodLabel.setAttribute("for", "gen5MasudaMethod");
        gen5MasudaMethodLabel.setAttribute("class", "genLabel");
        gen5MasudaMethodLabel.setAttribute("id", "gen5MasudaMethodId");
        gen5BWBW2Fieldsets.appendChild(gen5MasudaMethodLabel);
        const gen5MasudaMethodLabels =
          document.getElementById("gen5MasudaMethodId");
        // checkbox
        var gen5MasudaMethod = document.createElement("input");
        gen5MasudaMethod.setAttribute("type", "radio");
        gen5MasudaMethod.setAttribute("id", "gen5MasudaMethod");
        gen5MasudaMethod.setAttribute("name", "gen5Radio");
        gen5MasudaMethodLabels.appendChild(gen5MasudaMethod);
        // 名称
        gen5MasudaMethodLabel.innerHTML += "国際孵化";

        // gen5ShinyCharmを生成
        // label
        var gen5ShinyCharmLabel = document.createElement("label");
        gen5ShinyCharmLabel.setAttribute("for", "gen5ShinyCharm");
        gen5ShinyCharmLabel.setAttribute("class", "genLabel");
        gen5ShinyCharmLabel.setAttribute("id", "gen5ShinyCharmId");
        gen5BWBW2Fieldsets.appendChild(gen5ShinyCharmLabel);
        const gen5ShinyCharmLabels =
          document.getElementById("gen5ShinyCharmId");
        // checkbox
        var gen5ShinyCharm = document.createElement("input");
        gen5ShinyCharm.setAttribute("type", "checkbox");
        gen5ShinyCharm.setAttribute("id", "gen5ShinyCharm");
        gen5ShinyCharm.setAttribute("name", "gen5Radio");
        gen5ShinyCharmLabels.appendChild(gen5ShinyCharm);
        // 名称
        gen5ShinyCharmLabel.innerHTML += "ひかるおまもり";
        break;
      case 6:
        // XY, ORAS
        // feildset
        var gen6XYFieldset = document.createElement("fieldset");
        gen6XYFieldset.setAttribute("class", "genFieldset");
        gen6XYFieldset.setAttribute("id", "gen6XYId");
        checkboxs.appendChild(gen6XYFieldset);
        const gen6XYFieldsets = document.getElementById("gen6XYId");
        // legend
        var gen6XYlegend = document.createElement("legend");
        gen6XYlegend.innerHTML = "XY, ORAS";
        gen6XYFieldsets.appendChild(gen6XYlegend);

        // gen6Naturalを生成
        // label
        var gen6NaturalLabel = document.createElement("label");
        gen6NaturalLabel.setAttribute("for", "gen6Natural");
        gen6NaturalLabel.setAttribute("class", "genLabel");
        gen6NaturalLabel.setAttribute("id", "gen6NaturalId");
        gen6XYFieldsets.appendChild(gen6NaturalLabel);
        const gen6NaturalLabels = document.getElementById("gen6NaturalId");
        // checkbox
        var gen6Natural = document.createElement("input");
        gen6Natural.setAttribute("type", "radio");
        gen6Natural.setAttribute("id", "gen6Natural");
        gen6Natural.setAttribute("name", "gen6Radio");
        gen6Natural.setAttribute("checked", "");
        gen6NaturalLabels.appendChild(gen6Natural);
        // 名称
        gen6NaturalLabel.innerHTML += "自然遭遇";

        // gen6MasudaMethodを生成
        // label
        var gen6MasudaMethodLabel = document.createElement("label");
        gen6MasudaMethodLabel.setAttribute("for", "gen6MasudaMethod");
        gen6MasudaMethodLabel.setAttribute("class", "genLabel");
        gen6MasudaMethodLabel.setAttribute("id", "gen6MasudaMethodId");
        gen6XYFieldsets.appendChild(gen6MasudaMethodLabel);
        const gen6MasudaMethodLabels =
          document.getElementById("gen6MasudaMethodId");
        // checkbox
        var gen6MasudaMethod = document.createElement("input");
        gen6MasudaMethod.setAttribute("type", "radio");
        gen6MasudaMethod.setAttribute("id", "gen6MasudaMethod");
        gen6MasudaMethod.setAttribute("name", "gen6Radio");
        gen6MasudaMethodLabels.appendChild(gen6MasudaMethod);
        // 名称
        gen6MasudaMethodLabel.innerHTML += "国際孵化";

        // gen6PokeRadarを生成
        // label
        var gen6PokeRadarLabel = document.createElement("label");
        gen6PokeRadarLabel.setAttribute("for", "gen6PokeRadar");
        gen6PokeRadarLabel.setAttribute("class", "genLabel");
        gen6PokeRadarLabel.setAttribute("id", "gen6PokeRadarId");
        gen6XYFieldsets.appendChild(gen6PokeRadarLabel);
        const gen6PokeRadarLabels = document.getElementById("gen6PokeRadarId");
        // checkbox
        var gen6PokeRadar = document.createElement("input");
        gen6PokeRadar.setAttribute("type", "radio");
        gen6PokeRadar.setAttribute("id", "gen6PokeRadar");
        gen6PokeRadar.setAttribute("name", "gen6Radio");
        gen6PokeRadarLabels.appendChild(gen6PokeRadar);
        // 名称
        gen6PokeRadarLabel.innerHTML += "ポケトレ";

        // gen6FriendSafariを生成
        // label
        var gen6FriendSafariLabel = document.createElement("label");
        gen6FriendSafariLabel.setAttribute("for", "gen6FriendSafari");
        gen6FriendSafariLabel.setAttribute("class", "genLabel");
        gen6FriendSafariLabel.setAttribute("id", "gen6FriendSafariId");
        gen6XYFieldsets.appendChild(gen6FriendSafariLabel);
        const gen6FriendSafariLabels =
          document.getElementById("gen6FriendSafariId");
        // checkbox
        var gen6FriendSafari = document.createElement("input");
        gen6FriendSafari.setAttribute("type", "radio");
        gen6FriendSafari.setAttribute("id", "gen6FriendSafari");
        gen6FriendSafari.setAttribute("name", "gen6Radio");
        gen6FriendSafariLabels.appendChild(gen6FriendSafari);
        // 名称
        gen6FriendSafariLabel.innerHTML += "フレンドサファリ";

        // gen6ChainFishingを生成
        // label
        var gen6ChainFishingLabel = document.createElement("label");
        gen6ChainFishingLabel.setAttribute("for", "gen6ChainFishing");
        gen6ChainFishingLabel.setAttribute("class", "genLabel");
        gen6ChainFishingLabel.setAttribute("id", "gen6ChainFishingId");
        gen6XYFieldsets.appendChild(gen6ChainFishingLabel);
        const gen6ChainFishingLabels =
          document.getElementById("gen6ChainFishingId");
        // checkbox
        var gen6ChainFishing = document.createElement("input");
        gen6ChainFishing.setAttribute("type", "radio");
        gen6ChainFishing.setAttribute("id", "gen6ChainFishing");
        gen6ChainFishing.setAttribute("name", "gen6Radio");
        gen6ChainFishingLabels.appendChild(gen6ChainFishing);
        // 名称
        gen6ChainFishingLabel.innerHTML += "連続釣り";

        // gen6ShinyCharmを生成
        // label
        var gen6ShinyCharmLabel = document.createElement("label");
        gen6ShinyCharmLabel.setAttribute("for", "gen6ShinyCharm");
        gen6ShinyCharmLabel.setAttribute("class", "genLabel");
        gen6ShinyCharmLabel.setAttribute("id", "gen6ShinyCharmId");
        gen6XYFieldsets.appendChild(gen6ShinyCharmLabel);
        const gen6ShinyCharmLabels =
          document.getElementById("gen6ShinyCharmId");
        // checkbox
        var gen6ShinyCharm = document.createElement("input");
        gen6ShinyCharm.setAttribute("type", "checkbox");
        gen6ShinyCharm.setAttribute("id", "gen6ShinyCharm");
        gen6ShinyCharm.setAttribute("name", "gen6Radio");
        gen6ShinyCharmLabels.appendChild(gen6ShinyCharm);
        // 名称
        gen6ShinyCharmLabel.innerHTML += "ひかるおまもり";
        break;
      case 7:
        // SM,USUM
        // feildset
        var gen7SMUSUMFieldset = document.createElement("fieldset");
        gen7SMUSUMFieldset.setAttribute("class", "genFieldset");
        gen7SMUSUMFieldset.setAttribute("id", "gen7SMUSUMId");
        checkboxs.appendChild(gen7SMUSUMFieldset);
        const gen7SMUSUMFieldsets = document.getElementById("gen7SMUSUMId");
        // legend
        var gen7SMUSUMlegend = document.createElement("legend");
        gen7SMUSUMlegend.innerHTML = "SM, USUM, LGP, LGE";
        gen7SMUSUMFieldsets.appendChild(gen7SMUSUMlegend);

        // gen7Naturalを生成
        // label
        var gen7NaturalLabel = document.createElement("label");
        gen7NaturalLabel.setAttribute("for", "gen7Natural");
        gen7NaturalLabel.setAttribute("class", "genLabel");
        gen7NaturalLabel.setAttribute("id", "gen7NaturalId");
        gen7SMUSUMFieldsets.appendChild(gen7NaturalLabel);
        const gen7NaturalLabels = document.getElementById("gen7NaturalId");
        // checkbox
        var gen7Natural = document.createElement("input");
        gen7Natural.setAttribute("type", "radio");
        gen7Natural.setAttribute("id", "gen7Natural");
        gen7Natural.setAttribute("name", "gen7Radio");
        gen7Natural.setAttribute("checked", "");
        gen7NaturalLabels.appendChild(gen7Natural);
        // 名称
        gen7NaturalLabel.innerHTML += "自然遭遇";

        // gen7MasudaMethodを生成
        // label
        var gen7MasudaMethodLabel = document.createElement("label");
        gen7MasudaMethodLabel.setAttribute("for", "gen7MasudaMethod");
        gen7MasudaMethodLabel.setAttribute("class", "genLabel");
        gen7MasudaMethodLabel.setAttribute("id", "gen7MasudaMethodId");
        gen7SMUSUMFieldsets.appendChild(gen7MasudaMethodLabel);
        const gen7MasudaMethodLabels =
          document.getElementById("gen7MasudaMethodId");
        // checkbox
        var gen7MasudaMethod = document.createElement("input");
        gen7MasudaMethod.setAttribute("type", "radio");
        gen7MasudaMethod.setAttribute("id", "gen7MasudaMethod");
        gen7MasudaMethod.setAttribute("name", "gen7Radio");
        gen7MasudaMethodLabels.appendChild(gen7MasudaMethod);
        // 名称
        gen7MasudaMethodLabel.innerHTML += "国際孵化";

        // gen7SOSBattleを生成
        // label
        var gen7SOSBattleLabel = document.createElement("label");
        gen7SOSBattleLabel.setAttribute("for", "gen7SOSBattle");
        gen7SOSBattleLabel.setAttribute("class", "genLabel");
        gen7SOSBattleLabel.setAttribute("id", "gen7SOSBattleId");
        gen7SMUSUMFieldsets.appendChild(gen7SOSBattleLabel);
        const gen7SOSBattleLabels = document.getElementById("gen7SOSBattleId");
        // checkbox
        var gen7SOSBattle = document.createElement("input");
        gen7SOSBattle.setAttribute("type", "radio");
        gen7SOSBattle.setAttribute("id", "gen7SOSBattle");
        gen7SOSBattle.setAttribute("name", "gen7Radio");
        gen7SOSBattleLabels.appendChild(gen7SOSBattle);
        // 名称
        gen7SOSBattleLabel.innerHTML += "乱入バトル";

        // gen7ShinyCharmを生成
        // label
        var gen7ShinyCharmLabel = document.createElement("label");
        gen7ShinyCharmLabel.setAttribute("for", "gen7ShinyCharm");
        gen7ShinyCharmLabel.setAttribute("class", "genLabel");
        gen7ShinyCharmLabel.setAttribute("id", "gen7ShinyCharmId");
        gen7SMUSUMFieldsets.appendChild(gen7ShinyCharmLabel);
        const gen7ShinyCharmLabels =
          document.getElementById("gen7ShinyCharmId");
        // checkbox
        var gen7ShinyCharm = document.createElement("input");
        gen7ShinyCharm.setAttribute("type", "checkbox");
        gen7ShinyCharm.setAttribute("id", "gen7ShinyCharm");
        gen7ShinyCharm.setAttribute("name", "gen7Radio");
        gen7ShinyCharmLabels.appendChild(gen7ShinyCharm);
        // 名称
        gen7ShinyCharmLabel.innerHTML += "ひかるおまもり";

        // gen7CatchComboLGを生成
        // label
        var gen7CatchComboLGLabel = document.createElement("label");
        gen7CatchComboLGLabel.setAttribute("for", "gen7CatchComboLG");
        gen7CatchComboLGLabel.setAttribute("class", "genLabel");
        gen7CatchComboLGLabel.setAttribute("id", "gen7CatchComboLGId");
        gen7SMUSUMFieldsets.appendChild(gen7CatchComboLGLabel);
        const gen7CatchComboLGLabels =
          document.getElementById("gen7CatchComboLGId");
        // checkbox
        var gen7CatchComboLG = document.createElement("input");
        gen7CatchComboLG.setAttribute("type", "checkbox");
        gen7CatchComboLG.setAttribute("id", "gen7CatchComboLG");
        gen7CatchComboLG.setAttribute("name", "gen7Radio");
        gen7CatchComboLGLabels.appendChild(gen7CatchComboLG);
        // 名称
        gen7CatchComboLGLabel.innerHTML += "31連鎖（捕獲）";

        // gen7LureLGを生成
        // label
        var gen7LureLGLabel = document.createElement("label");
        gen7LureLGLabel.setAttribute("for", "gen7LureLG");
        gen7LureLGLabel.setAttribute("class", "genLabel");
        gen7LureLGLabel.setAttribute("id", "gen7LureLGId");
        gen7SMUSUMFieldsets.appendChild(gen7LureLGLabel);
        const gen7LureLGLabels = document.getElementById("gen7LureLGId");
        // checkbox
        var gen7LureLG = document.createElement("input");
        gen7LureLG.setAttribute("type", "checkbox");
        gen7LureLG.setAttribute("id", "gen7LureLG");
        gen7LureLG.setAttribute("name", "gen7Radio");
        gen7LureLGLabels.appendChild(gen7LureLG);
        // 名称
        gen7LureLGLabel.innerHTML += "むしよせコロン";
        break;
      case 8:
        // SW,SH
        // feildset
        var gen8SWSHFieldset = document.createElement("fieldset");
        gen8SWSHFieldset.setAttribute("class", "genFieldset");
        gen8SWSHFieldset.setAttribute("id", "gen8SWSHId");
        checkboxs.appendChild(gen8SWSHFieldset);
        const gen8SWSHFieldsets = document.getElementById("gen8SWSHId");
        // legend
        var gen8SWSHlegend = document.createElement("legend");
        gen8SWSHlegend.innerHTML = "SWSH, BDSP, LA";
        gen8SWSHFieldsets.appendChild(gen8SWSHlegend);

        // gen8Naturalを生成
        // label
        var gen8NaturalLabel = document.createElement("label");
        gen8NaturalLabel.setAttribute("for", "gen8Natural");
        gen8NaturalLabel.setAttribute("class", "genLabel");
        gen8NaturalLabel.setAttribute("id", "gen8NaturalId");
        gen8SWSHFieldsets.appendChild(gen8NaturalLabel);
        const gen8NaturalLabels = document.getElementById("gen8NaturalId");
        // checkbox
        var gen8Natural = document.createElement("input");
        gen8Natural.setAttribute("type", "radio");
        gen8Natural.setAttribute("id", "gen8Natural");
        gen8Natural.setAttribute("name", "gen8Radio");
        gen8Natural.setAttribute("checked", "");
        gen8NaturalLabels.appendChild(gen8Natural);
        // 名称
        gen8NaturalLabel.innerHTML += "自然遭遇";

        // gen8MasudaMethodを生成
        // label
        var gen8MasudaMethodLabel = document.createElement("label");
        gen8MasudaMethodLabel.setAttribute("for", "gen8MasudaMethod");
        gen8MasudaMethodLabel.setAttribute("class", "genLabel");
        gen8MasudaMethodLabel.setAttribute("id", "gen8MasudaMethodId");
        gen8SWSHFieldsets.appendChild(gen8MasudaMethodLabel);
        const gen8MasudaMethodLabels =
          document.getElementById("gen8MasudaMethodId");
        // checkbox
        var gen8MasudaMethod = document.createElement("input");
        gen8MasudaMethod.setAttribute("type", "radio");
        gen8MasudaMethod.setAttribute("id", "gen8MasudaMethod");
        gen8MasudaMethod.setAttribute("name", "gen8Radio");
        gen8MasudaMethodLabels.appendChild(gen8MasudaMethod);
        // 名称
        gen8MasudaMethodLabel.innerHTML += "国際孵化";

        // gen8PokeRadarを生成
        // label
        var gen8PokeRadarLabel = document.createElement("label");
        gen8PokeRadarLabel.setAttribute("for", "gen8PokeRadar");
        gen8PokeRadarLabel.setAttribute("class", "genLabel");
        gen8PokeRadarLabel.setAttribute("id", "gen8PokeRadarId");
        gen8SWSHFieldsets.appendChild(gen8PokeRadarLabel);
        const gen8PokeRadarLabels = document.getElementById("gen8PokeRadarId");
        // checkbox
        var gen8PokeRadar = document.createElement("input");
        gen8PokeRadar.setAttribute("type", "radio");
        gen8PokeRadar.setAttribute("id", "gen8PokeRadar");
        gen8PokeRadar.setAttribute("name", "gen8Radio");
        gen8PokeRadarLabels.appendChild(gen8PokeRadar);
        // 名称
        gen8PokeRadarLabel.innerHTML += "ポケトレ";

        // gen8KOを生成
        // label
        var gen8KOLabel = document.createElement("label");
        gen8KOLabel.setAttribute("for", "gen8KO");
        gen8KOLabel.setAttribute("class", "genLabel");
        gen8KOLabel.setAttribute("id", "gen8KOId");
        gen8SWSHFieldsets.appendChild(gen8KOLabel);
        const gen8KOLabels = document.getElementById("gen8KOId");
        // checkbox
        var gen8KO = document.createElement("input");
        gen8KO.setAttribute("type", "radio");
        gen8KO.setAttribute("id", "gen8KO");
        gen8KO.setAttribute("name", "gen8Radio");
        gen8KOLabels.appendChild(gen8KO);
        // 名称
        gen8KOLabel.innerHTML += "戦った数（500匹以上）";

        // gen8DynamaxAdventureを生成
        // label
        var gen8DynamaxAdventureLabel = document.createElement("label");
        gen8DynamaxAdventureLabel.setAttribute("for", "gen8DynamaxAdventure");
        gen8DynamaxAdventureLabel.setAttribute("class", "genLabel");
        gen8DynamaxAdventureLabel.setAttribute("id", "gen8DynamaxAdventureId");
        gen8SWSHFieldsets.appendChild(gen8DynamaxAdventureLabel);
        const gen8DynamaxAdventureLabels = document.getElementById(
          "gen8DynamaxAdventureId"
        );
        // checkbox
        var gen8DynamaxAdventure = document.createElement("input");
        gen8DynamaxAdventure.setAttribute("type", "radio");
        gen8DynamaxAdventure.setAttribute("id", "gen8DynamaxAdventure");
        gen8DynamaxAdventure.setAttribute("name", "gen8Radio");
        gen8DynamaxAdventureLabels.appendChild(gen8DynamaxAdventure);
        // 名称
        gen8DynamaxAdventureLabel.innerHTML += "ダイマックスアドベンチャー";

        // gen8ShinyCharmSWSHを生成
        // label
        var gen8ShinyCharmSWSHLabel = document.createElement("label");
        gen8ShinyCharmSWSHLabel.setAttribute("for", "gen8ShinyCharmSWSH");
        gen8ShinyCharmSWSHLabel.setAttribute("class", "genLabel");
        gen8ShinyCharmSWSHLabel.setAttribute("id", "gen8ShinyCharmSWSHId");
        gen8SWSHFieldsets.appendChild(gen8ShinyCharmSWSHLabel);
        const gen8ShinyCharmSWSHLabels = document.getElementById(
          "gen8ShinyCharmSWSHId"
        );
        // checkbox
        var gen8ShinyCharmSWSH = document.createElement("input");
        gen8ShinyCharmSWSH.setAttribute("type", "checkbox");
        gen8ShinyCharmSWSH.setAttribute("id", "gen8ShinyCharmSWSH");
        gen8ShinyCharmSWSH.setAttribute("name", "gen8Radio");
        gen8ShinyCharmSWSHLabels.appendChild(gen8ShinyCharmSWSH);
        // 名称
        gen8ShinyCharmSWSHLabel.innerHTML += "ひかるおまもり SWSH, BDSP";

        // gen8ShinyCharmLAを生成
        // label
        var gen8ShinyCharmLALabel = document.createElement("label");
        gen8ShinyCharmLALabel.setAttribute("for", "gen8ShinyCharmLA");
        gen8ShinyCharmLALabel.setAttribute("class", "genLabel");
        gen8ShinyCharmLALabel.setAttribute("id", "gen8ShinyCharmLAId");
        gen8SWSHFieldsets.appendChild(gen8ShinyCharmLALabel);
        const gen8ShinyCharmLALabels =
          document.getElementById("gen8ShinyCharmLAId");
        // checkbox
        var gen8ShinyCharmLA = document.createElement("input");
        gen8ShinyCharmLA.setAttribute("type", "checkbox");
        gen8ShinyCharmLA.setAttribute("id", "gen8ShinyCharmLA");
        gen8ShinyCharmLA.setAttribute("name", "gen8Radio");
        gen8ShinyCharmLALabels.appendChild(gen8ShinyCharmLA);
        // 名称
        gen8ShinyCharmLALabel.innerHTML += "ひかるおまもり LA";

        // gen8MassOutbreaksを生成
        // label
        var gen8MassOutbreaksLabel = document.createElement("label");
        gen8MassOutbreaksLabel.setAttribute("for", "gen8MassOutbreaks");
        gen8MassOutbreaksLabel.setAttribute("class", "genLabel");
        gen8MassOutbreaksLabel.setAttribute("id", "gen8MassOutbreaksId");
        gen8SWSHFieldsets.appendChild(gen8MassOutbreaksLabel);
        const gen8MassOutbreaksLabels = document.getElementById(
          "gen8MassOutbreaksId"
        );
        // checkbox
        var gen8MassOutbreaks = document.createElement("input");
        gen8MassOutbreaks.setAttribute("type", "checkbox");
        gen8MassOutbreaks.setAttribute("id", "gen8MassOutbreaks");
        gen8MassOutbreaks.setAttribute("name", "gen8Radio");
        gen8MassOutbreaksLabels.appendChild(gen8MassOutbreaks);
        // 名称
        gen8MassOutbreaksLabel.innerHTML += "大量発生";

        // gen8MassiveMassOutbreaksを生成
        // label
        var gen8MassiveMassOutbreaksLabel = document.createElement("label");
        gen8MassiveMassOutbreaksLabel.setAttribute(
          "for",
          "gen8MassiveMassOutbreaks"
        );
        gen8MassiveMassOutbreaksLabel.setAttribute("class", "genLabel");
        gen8MassiveMassOutbreaksLabel.setAttribute(
          "id",
          "gen8MassiveMassOutbreaksId"
        );
        gen8SWSHFieldsets.appendChild(gen8MassiveMassOutbreaksLabel);
        const gen8MassiveMassOutbreaksLabels = document.getElementById(
          "gen8MassiveMassOutbreaksId"
        );
        // checkbox
        var gen8MassiveMassOutbreaks = document.createElement("input");
        gen8MassiveMassOutbreaks.setAttribute("type", "checkbox");
        gen8MassiveMassOutbreaks.setAttribute("id", "gen8MassiveMassOutbreaks");
        gen8MassiveMassOutbreaks.setAttribute("name", "gen8Radio");
        gen8MassiveMassOutbreaksLabels.appendChild(gen8MassiveMassOutbreaks);
        // 名称
        gen8MassiveMassOutbreaksLabel.innerHTML += "大大大発生";

        // gen8Rankを生成
        // label
        var gen8RankLabel = document.createElement("label");
        gen8RankLabel.setAttribute("for", "gen8Rank");
        gen8RankLabel.setAttribute("class", "genLabel");
        gen8RankLabel.setAttribute("id", "gen8RankId");
        gen8SWSHFieldsets.appendChild(gen8RankLabel);
        const gen8RankLabels = document.getElementById("gen8RankId");
        // checkbox
        var gen8Rank = document.createElement("input");
        gen8Rank.setAttribute("type", "checkbox");
        gen8Rank.setAttribute("id", "gen8Rank");
        gen8Rank.setAttribute("name", "gen8Radio");
        gen8RankLabels.appendChild(gen8Rank);
        // 名称
        gen8RankLabel.innerHTML += "図鑑研究レベル10";

        // gen8ResearchTaskを生成
        // label
        var gen8ResearchTaskLabel = document.createElement("label");
        gen8ResearchTaskLabel.setAttribute("for", "gen8ResearchTask");
        gen8ResearchTaskLabel.setAttribute("class", "genLabel");
        gen8ResearchTaskLabel.setAttribute("id", "gen8ResearchTaskId");
        gen8SWSHFieldsets.appendChild(gen8ResearchTaskLabel);
        const gen8ResearchTaskLabels =
          document.getElementById("gen8ResearchTaskId");
        // checkbox
        var gen8ResearchTask = document.createElement("input");
        gen8ResearchTask.setAttribute("type", "checkbox");
        gen8ResearchTask.setAttribute("id", "gen8ResearchTask");
        gen8ResearchTask.setAttribute("name", "gen8Radio");
        gen8ResearchTaskLabels.appendChild(gen8ResearchTask);
        // 名称
        gen8ResearchTaskLabel.innerHTML += "図鑑タスク完璧";
        break;
      case 9:
        // SV
        // feildset
        var gen8SVFieldset = document.createElement("fieldset");
        gen8SVFieldset.setAttribute("class", "genFieldset");
        gen8SVFieldset.setAttribute("id", "gen9SVId");
        checkboxs.appendChild(gen8SVFieldset);
        const gen9SVFieldsets = document.getElementById("gen9SVId");
        // legend
        var gen8SVlegend = document.createElement("legend");
        gen8SVlegend.innerHTML = "SV";
        gen9SVFieldsets.appendChild(gen8SVlegend);

        // gen9Naturalを生成
        // label
        var gen9NaturalLabel = document.createElement("label");
        gen9NaturalLabel.setAttribute("for", "gen9Natural");
        gen9NaturalLabel.setAttribute("class", "genLabel");
        gen9NaturalLabel.setAttribute("id", "gen9NaturalId");
        gen9SVFieldsets.appendChild(gen9NaturalLabel);
        const gen9NaturalLabels = document.getElementById("gen9NaturalId");
        // checkbox
        var gen9Natural = document.createElement("input");
        gen9Natural.setAttribute("type", "radio");
        gen9Natural.setAttribute("id", "gen9Natural");
        gen9Natural.setAttribute("name", "gen9Radio");
        gen9Natural.setAttribute("checked", "");
        gen9NaturalLabels.appendChild(gen9Natural);
        // 名称
        gen9NaturalLabel.innerHTML += "自然遭遇";

        // gen9MasudaMethodを生成
        // label
        var gen9MasudaMethodLabel = document.createElement("label");
        gen9MasudaMethodLabel.setAttribute("for", "gen9MasudaMethod");
        gen9MasudaMethodLabel.setAttribute("class", "genLabel");
        gen9MasudaMethodLabel.setAttribute("id", "gen9MasudaMethodId");
        gen9SVFieldsets.appendChild(gen9MasudaMethodLabel);
        const gen9MasudaMethodLabels =
          document.getElementById("gen9MasudaMethodId");
        // checkbox
        var gen9MasudaMethod = document.createElement("input");
        gen9MasudaMethod.setAttribute("type", "radio");
        gen9MasudaMethod.setAttribute("id", "gen9MasudaMethod");
        gen9MasudaMethod.setAttribute("name", "gen9Radio");
        gen9MasudaMethodLabels.appendChild(gen9MasudaMethod);
        // 名称
        gen9MasudaMethodLabel.innerHTML += "国際孵化";

        // gen9ShinyCharmSVを生成
        // label
        var gen9ShinyCharmSVLabel = document.createElement("label");
        gen9ShinyCharmSVLabel.setAttribute("for", "gen9ShinyCharmSV");
        gen9ShinyCharmSVLabel.setAttribute("class", "genLabel");
        gen9ShinyCharmSVLabel.setAttribute("id", "gen9ShinyCharmSVId");
        gen9SVFieldsets.appendChild(gen9ShinyCharmSVLabel);
        const gen9ShinyCharmSVLabels =
          document.getElementById("gen9ShinyCharmSVId");
        // checkbox
        var gen9ShinyCharmSV = document.createElement("input");
        gen9ShinyCharmSV.setAttribute("type", "checkbox");
        gen9ShinyCharmSV.setAttribute("id", "gen9ShinyCharmSV");
        gen9ShinyCharmSV.setAttribute("name", "gen9Radio");
        gen9ShinyCharmSVLabels.appendChild(gen9ShinyCharmSV);
        // 名称
        gen9ShinyCharmSVLabel.innerHTML += "ひかるおまもり";

        // gen9MassOutbreakSVを生成
        // label
        var gen9MassOutbreakSVLabel = document.createElement("label");
        gen9MassOutbreakSVLabel.setAttribute("for", "gen9MassOutbreakSV");
        gen9MassOutbreakSVLabel.setAttribute("class", "genLabel");
        gen9MassOutbreakSVLabel.setAttribute("id", "gen9MassOutbreakSVId");
        gen9SVFieldsets.appendChild(gen9MassOutbreakSVLabel);
        const gen9MassOutbreakSVLabels = document.getElementById(
          "gen9MassOutbreakSVId"
        );
        // checkbox
        var gen9MassOutbreakSV = document.createElement("input");
        gen9MassOutbreakSV.setAttribute("type", "checkbox");
        gen9MassOutbreakSV.setAttribute("id", "gen9MassOutbreakSV");
        gen9MassOutbreakSV.setAttribute("name", "gen9Radio");
        gen9MassOutbreakSVLabels.appendChild(gen9MassOutbreakSV);
        // 名称
        gen9MassOutbreakSVLabel.innerHTML += "大量発生";

        // gen9SparklingPowerSVを生成
        // label
        var gen9SparklingPowerSVLabel = document.createElement("label");
        gen9SparklingPowerSVLabel.setAttribute("for", "gen9SparklingPowerSV");
        gen9SparklingPowerSVLabel.setAttribute("class", "genLabel");
        gen9SparklingPowerSVLabel.setAttribute("id", "gen9SparklingPowerSVId");
        gen9SVFieldsets.appendChild(gen9SparklingPowerSVLabel);
        const gen9SparklingPowerSVLabels = document.getElementById(
          "gen9SparklingPowerSVId"
        );
        // checkbox
        var gen9SparklingPowerSV = document.createElement("input");
        gen9SparklingPowerSV.setAttribute("type", "checkbox");
        gen9SparklingPowerSV.setAttribute("id", "gen9SparklingPowerSV");
        gen9SparklingPowerSV.setAttribute("name", "gen9Radio");
        gen9SparklingPowerSVLabels.appendChild(gen9SparklingPowerSV);
        // 名称
        gen9SparklingPowerSVLabel.innerHTML += "かがやきパワーLv3";
        break;
      default:
        console.log("case: default");
        break;
    }
  };

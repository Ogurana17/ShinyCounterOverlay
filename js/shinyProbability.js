// ShinyProbability
// メモ
// ・ラジオボタンで確率をセットしたい
// ・ラジオボタンの配置を完了させたい

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
// document.getElementById('').onclick = function setProbability() {
//   const shinyProbabilityNumerator = document.getElementById(
//     'shinyProbabilityNumerator'
//   );
//   const shinyProbabilityDenominator = document.getElementById(
//     'shinyProbabilityDenominator'
//   );

//   // iを取り出す
//   for (let i = 0; i < gen1radio.length; i++) {
//     if (gen1radio[i].checked) {
//       str = gen1radio[i].value;
//       break;
//     }
//   }
// }

// inputNumberの有効桁数制限
// デフォルトでは有効桁数を6桁に設定
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
  // HTML要素から要素を読み込み
  const encounterProbabilityTitle = document.getElementById(
    "encounterProbabilityTitle"
  );
  const shinyProbabilityNumerator = document.getElementById(
    "shinyProbabilityNumerator"
  );
  const shinyProbabilityDenominator = document.getElementById(
    "shinyProbabilityDenominator"
  );

  // 演算
  // toLocaleStringで小数点以下の有効桁数を3桁に制限
  var shinyProbabilityNum =
    (1 -
      Math.pow(
        1 - shinyProbabilityNumerator.value / shinyProbabilityDenominator.value,
        traialsInput.value
      )) *
    100;
  var shinyProbabilityValue = shinyProbabilityNum.toLocaleString(undefined, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  encounterProbabilityTitle.innerHTML = shinyProbabilityValue;

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
  console.log("次に色違いが出る確率: " + encounterProbabilityTitle.innerHTML);
}

// 世代の選択によってチェックボックスを作成
document.getElementById("generationSelector").onchange =
  function createCheckbox() {
    const generationSelector = document.getElementById("generationSelector");
    const checkboxs = document.getElementById("checkboxs");

    // 確認用
    console.log("generation: " + generationSelector.value);

    // 生成済みのチェックボックスを削除
    while (checkboxs.firstChild) {
      checkboxs.removeChild(checkboxs.firstChild);
    }

    switch (Number(generationSelector.value)) {
      case 1:
      // 1世代と2世代は色違いにする方法が同じ
      case 2:
        // RGBP, GSC
        // feildset
        var gen1RGBPFieldset = document.createElement('fieldset');
        gen1RGBPFieldset.setAttribute('class', 'genFieldset');
        gen1RGBPFieldset.setAttribute('id', 'gen1RGBPId');
        checkboxs.appendChild(gen1RGBPFieldset);
        const gen1RGBPFieldsets =
          document.getElementById('gen1RGBPId');
        // legend
        var gen1RGBPlegend = document.createElement('legend');
        gen1RGBPlegend.innerHTML = 'RGBP, GSC';
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
        var gen3RSEFieldset = document.createElement('fieldset');
        gen3RSEFieldset.setAttribute('class', 'genFieldset');
        gen3RSEFieldset.setAttribute('id', 'gen3RSEId');
        checkboxs.appendChild(gen3RSEFieldset);
        const gen3RSEFieldsets =
          document.getElementById('gen3RSEId');
        // legend
        var gen3RSElegend = document.createElement('legend');
        gen3RSElegend.innerHTML = 'RSE, FRLG';
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
        gen3NaturalLabels.appendChild(gen3Natural);
        // 名称
        gen3NaturalLabel.innerHTML += "自然遭遇";
        break;
      case 4:
        // DPt, HGSS
        // feildset
        var gen4DptFieldset = document.createElement('fieldset');
        gen4DptFieldset.setAttribute('class', 'genFieldset');
        gen4DptFieldset.setAttribute('id', 'gen4DptId');
        checkboxs.appendChild(gen4DptFieldset);
        const gen4DptFieldsets =
          document.getElementById('gen4DptId');
        // legend
        var gen4Dptlegend = document.createElement('legend');
        gen4Dptlegend.innerHTML = 'DPt, HGSS';
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
        var gen5BWBW2Fieldset = document.createElement('fieldset');
        gen5BWBW2Fieldset.setAttribute('class', 'genFieldset');
        gen5BWBW2Fieldset.setAttribute('id', 'gen5BWBW2Id');
        checkboxs.appendChild(gen5BWBW2Fieldset);
        const gen5BWBW2Fieldsets =
          document.getElementById('gen5BWBW2Id');
        // legend
        var gen5BWBW2legend = document.createElement('legend');
        gen5BWBW2legend.innerHTML = 'BW, BW2';
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
        gen5ShinyCharm.setAttribute("name", "gen5checkbox");
        gen5ShinyCharmLabels.appendChild(gen5ShinyCharm);
        // 名称
        gen5ShinyCharmLabel.innerHTML += "ひかるおまもり";
        break;
      case 6:
        // XY
        // feildset
        var gen6XYFieldset = document.createElement('fieldset');
        gen6XYFieldset.setAttribute('class', 'genFieldset');
        gen6XYFieldset.setAttribute('id', 'gen6XYId');
        checkboxs.appendChild(gen6XYFieldset);
        const gen6XYFieldsets =
          document.getElementById('gen6XYId');
        // legend
        var gen6XYlegend = document.createElement('legend');
        gen6XYlegend.innerHTML = 'XY';
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

        // gen6IndexNaviを生成
        // label
        var gen6IndexNaviLabel = document.createElement("label");
        gen6IndexNaviLabel.setAttribute("for", "gen6IndexNavi");
        gen6IndexNaviLabel.setAttribute("class", "genLabel");
        gen6IndexNaviLabel.setAttribute("id", "gen6IndexNaviId");
        gen6XYFieldsets.appendChild(gen6IndexNaviLabel);
        const gen6IndexNaviLabels = document.getElementById("gen6IndexNaviId");
        // checkbox
        var gen6IndexNavi = document.createElement("input");
        gen6IndexNavi.setAttribute("type", "radio");
        gen6IndexNavi.setAttribute("id", "gen6IndexNavi");
        gen6IndexNavi.setAttribute("name", "gen6Radio");
        gen6IndexNaviLabels.appendChild(gen6IndexNavi);
        // 名称
        gen6IndexNaviLabel.innerHTML += "ずかんナビ";

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
        gen6ShinyCharm.setAttribute("name", "gen6checkbox");
        gen6ShinyCharmLabels.appendChild(gen6ShinyCharm);
        // 名称
        gen6ShinyCharmLabel.innerHTML += "ひかるおまもり";

        // ORAS
        // feildset
        var gen6ORASFieldset = document.createElement('fieldset');
        gen6ORASFieldset.setAttribute('class', 'genFieldset');
        gen6ORASFieldset.setAttribute('id', 'gen6ORASId');
        checkboxs.appendChild(gen6ORASFieldset);
        const gen6ORASFieldsets =
          document.getElementById('gen6ORASId');
        // legend
        var gen6ORASlegend = document.createElement('legend');
        gen6ORASlegend.innerHTML = 'ORAS';
        gen6ORASFieldsets.appendChild(gen6ORASlegend);
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
        gen7SMUSUMlegend.innerHTML = "SM, USUM";
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
        gen7ShinyCharm.setAttribute("name", "gen7checkbox");
        gen7ShinyCharmLabels.appendChild(gen7ShinyCharm);
        // 名称
        gen7ShinyCharmLabel.innerHTML += "ひかるおまもり";

        // LGP,LGE
        // feildset
        var gen7LGPLGEFieldset = document.createElement("fieldset");
        gen7LGPLGEFieldset.setAttribute("class", "genFieldset");
        gen7LGPLGEFieldset.setAttribute("id", "gen7LGPLGEId");
        checkboxs.appendChild(gen7LGPLGEFieldset);
        const gen7LGPLGEFieldsets = document.getElementById("gen7LGPLGEId");
        // legend
        var gen7LGPLGElegend = document.createElement("legend");
        gen7LGPLGElegend.innerHTML = "LGP, LGE";
        gen7LGPLGEFieldsets.appendChild(gen7LGPLGElegend);

        // gen7NaturalLGを生成
        // label
        var gen7NaturalLGLabel = document.createElement("label");
        gen7NaturalLGLabel.setAttribute("for", "gen7NaturalLG");
        gen7NaturalLGLabel.setAttribute("class", "genLabel");
        gen7NaturalLGLabel.setAttribute("id", "gen7NaturalLGId");
        gen7LGPLGEFieldsets.appendChild(gen7NaturalLGLabel);
        const gen7NaturalLGLabels = document.getElementById("gen7NaturalLGId");
        // checkbox
        var gen7NaturalLG = document.createElement("input");
        gen7NaturalLG.setAttribute("type", "radio");
        gen7NaturalLG.setAttribute("id", "gen7NaturalLG");
        gen7NaturalLG.setAttribute("name", "gen7Radio");
        gen7NaturalLGLabels.appendChild(gen7NaturalLG);
        // 名称
        gen7NaturalLGLabel.innerHTML += "自然遭遇";

        // gen7ShinyCharmLGを生成
        // label
        var gen7ShinyCharmLGLabel = document.createElement("label");
        gen7ShinyCharmLGLabel.setAttribute("for", "gen7ShinyCharmLG");
        gen7ShinyCharmLGLabel.setAttribute("class", "genLabel");
        gen7ShinyCharmLGLabel.setAttribute("id", "gen7ShinyCharmLGId");
        gen7LGPLGEFieldsets.appendChild(gen7ShinyCharmLGLabel);
        const gen7ShinyCharmLGLabels =
          document.getElementById("gen7ShinyCharmLGId");
        // checkbox
        var gen7ShinyCharmLG = document.createElement("input");
        gen7ShinyCharmLG.setAttribute("type", "checkbox");
        gen7ShinyCharmLG.setAttribute("id", "gen7ShinyCharmLG");
        gen7ShinyCharmLG.setAttribute("name", "gen7checkbox");
        gen7ShinyCharmLGLabels.appendChild(gen7ShinyCharmLG);
        // 名称
        gen7ShinyCharmLGLabel.innerHTML += "ひかるおまもり";

        // gen7CatchComboLGを生成
        // label
        var gen7CatchComboLGLabel = document.createElement("label");
        gen7CatchComboLGLabel.setAttribute("for", "gen7CatchComboLG");
        gen7CatchComboLGLabel.setAttribute("class", "genLabel");
        gen7CatchComboLGLabel.setAttribute("id", "gen7CatchComboLGId");
        gen7LGPLGEFieldsets.appendChild(gen7CatchComboLGLabel);
        const gen7CatchComboLGLabels =
          document.getElementById("gen7CatchComboLGId");
        // checkbox
        var gen7CatchComboLG = document.createElement("input");
        gen7CatchComboLG.setAttribute("type", "checkbox");
        gen7CatchComboLG.setAttribute("id", "gen7CatchComboLG");
        gen7CatchComboLG.setAttribute("name", "gen7checkbox");
        gen7CatchComboLGLabels.appendChild(gen7CatchComboLG);
        // 名称
        gen7CatchComboLGLabel.innerHTML += "31連鎖（捕獲）";

        // gen7LureLGを生成
        // label
        var gen7LureLGLabel = document.createElement("label");
        gen7LureLGLabel.setAttribute("for", "gen7LureLG");
        gen7LureLGLabel.setAttribute("class", "genLabel");
        gen7LureLGLabel.setAttribute("id", "gen7LureLGId");
        gen7LGPLGEFieldsets.appendChild(gen7LureLGLabel);
        const gen7LureLGLabels = document.getElementById("gen7LureLGId");
        // checkbox
        var gen7LureLG = document.createElement("input");
        gen7LureLG.setAttribute("type", "checkbox");
        gen7LureLG.setAttribute("id", "gen7LureLG");
        gen7LureLG.setAttribute("name", "gen7checkbox");
        gen7LureLGLabels.appendChild(gen7LureLG);
        // 名称
        gen7LureLGLabel.innerHTML += "むしよせコロン";
        break;
      case 8:
        // SW,SH
        // feildset
        var gen8SWSHFieldset = document.createElement('fieldset');
        gen8SWSHFieldset.setAttribute('class', 'genFieldset');
        gen8SWSHFieldset.setAttribute('id', 'gen8SWSHId');
        checkboxs.appendChild(gen8SWSHFieldset);
        const gen8SWSHFieldsets =
          document.getElementById('gen8SWSHId');
        // legend
        var gen8SWSHlegend = document.createElement('legend');
        gen8SWSHlegend.innerHTML = 'SW, SH';
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

        // gen8ShinyCharmを生成
        // label
        var gen8ShinyCharmLabel = document.createElement("label");
        gen8ShinyCharmLabel.setAttribute("for", "gen8ShinyCharm");
        gen8ShinyCharmLabel.setAttribute("class", "genLabel");
        gen8ShinyCharmLabel.setAttribute("id", "gen8ShinyCharmId");
        gen8SWSHFieldsets.appendChild(gen8ShinyCharmLabel);
        const gen8ShinyCharmLabels =
          document.getElementById("gen8ShinyCharmId");
        // checkbox
        var gen8ShinyCharm = document.createElement("input");
        gen8ShinyCharm.setAttribute("type", "checkbox");
        gen8ShinyCharm.setAttribute("id", "gen8ShinyCharm");
        gen8ShinyCharm.setAttribute("name", "gen8checkbox");
        gen8ShinyCharmLabels.appendChild(gen8ShinyCharm);
        // 名称
        gen8ShinyCharmLabel.innerHTML += "ひかるおまもり";

        // BD,SP
        // feildset
        var gen8BDSPFieldset = document.createElement('fieldset');
        gen8BDSPFieldset.setAttribute('class', 'genFieldset');
        gen8BDSPFieldset.setAttribute('id', 'gen8BDSPId');
        checkboxs.appendChild(gen8BDSPFieldset);
        const gen8BDSPFieldsets =
          document.getElementById('gen8BDSPId');
        // legend
        var gen8BDSPlegend = document.createElement('legend');
        gen8BDSPlegend.innerHTML = 'BD, SP';
        gen8BDSPFieldsets.appendChild(gen8BDSPlegend);

        // gen8ShinyCharmBDSPを生成
        // label
        var gen8ShinyCharmBDSPLabel = document.createElement("label");
        gen8ShinyCharmBDSPLabel.setAttribute("for", "gen8ShinyCharmBDSP");
        gen8ShinyCharmBDSPLabel.setAttribute("class", "genLabel");
        gen8ShinyCharmBDSPLabel.setAttribute("id", "gen8ShinyCharmBDSPId");
        gen8BDSPFieldsets.appendChild(gen8ShinyCharmBDSPLabel);
        const gen8ShinyCharmBDSPLabels =
          document.getElementById("gen8ShinyCharmBDSPId");
        // checkbox
        var gen8ShinyCharmBDSP = document.createElement("input");
        gen8ShinyCharmBDSP.setAttribute("type", "checkbox");
        gen8ShinyCharmBDSP.setAttribute("id", "gen8ShinyCharmBDSP");
        gen8ShinyCharmBDSP.setAttribute("name", "gen8checkbox");
        gen8ShinyCharmBDSPLabels.appendChild(gen8ShinyCharmBDSP);
        // 名称
        gen8ShinyCharmBDSPLabel.innerHTML += "ひかるおまもり";

        // LA
        // feildset
        var gen8LAFieldset = document.createElement('fieldset');
        gen8LAFieldset.setAttribute('class', 'genFieldset');
        gen8LAFieldset.setAttribute('id', 'gen8LAId');
        checkboxs.appendChild(gen8LAFieldset);
        const gen8LAFieldsets =
          document.getElementById('gen8LAId');
        // legend
        var gen8LAlegend = document.createElement('legend');
        gen8LAlegend.innerHTML = 'LA';
        gen8LAFieldsets.appendChild(gen8LAlegend);
        break;
      case 9:
        // SV
        // feildset
        var gen8SVFieldset = document.createElement('fieldset');
        gen8SVFieldset.setAttribute('class', 'genFieldset');
        gen8SVFieldset.setAttribute('id', 'gen8SVId');
        checkboxs.appendChild(gen8SVFieldset);
        const gen9SVFieldsets =
          document.getElementById('gen8SVId');
        // legend
        var gen8SVlegend = document.createElement('legend');
        gen8SVlegend.innerHTML = 'SV';
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
        gen9ShinyCharmSV.setAttribute("name", "gen9checkbox");
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
        const gen9MassOutbreakSVLabels =
          document.getElementById("gen9MassOutbreakSVId");
        // checkbox
        var gen9MassOutbreakSV = document.createElement("input");
        gen9MassOutbreakSV.setAttribute("type", "checkbox");
        gen9MassOutbreakSV.setAttribute("id", "gen9MassOutbreakSV");
        gen9MassOutbreakSV.setAttribute("name", "gen9checkbox");
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
        const gen9SparklingPowerSVLabels =
          document.getElementById("gen9SparklingPowerSVId");
        // checkbox
        var gen9SparklingPowerSV = document.createElement("input");
        gen9SparklingPowerSV.setAttribute("type", "checkbox");
        gen9SparklingPowerSV.setAttribute("id", "gen9SparklingPowerSV");
        gen9SparklingPowerSV.setAttribute("name", "gen9checkbox");
        gen9SparklingPowerSVLabels.appendChild(gen9SparklingPowerSV);
        // 名称
        gen9SparklingPowerSVLabel.innerHTML += "かがやきパワーLv3";
        break;
      default:
        console.log("case: default");
        break;
    }
  };

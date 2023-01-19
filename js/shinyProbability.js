// ShinyProbability
document.getElementById('traialsIncrementButton').onclick = function addCnt () {
    //HTML要素から要素を読み込み
    const traialsInput = document.getElementById('traialsInput');

    //試行回数を+1
    traialsInput.value++;

    //確率計算を行って反映
    shinyProbability();
}

document.getElementById('traialsDecrementButton').onclick = function subCnt () {
    //HTML要素から要素を読み込み
    const traialsInput = document.getElementById('traialsInput');

    //試行回数を-1
    traialsInput.value--;

    //確率計算を行って反映
    shinyProbability();
}

//inputNumberの有効桁数制限
//デフォルトでは有効桁数を6桁に設定
//足を切り捨てする動作
//似た動作なのでイベントをまとめたい
document.getElementById('traialsInput').oninput = function sliceMaxLength() {
    traialsInput.value = traialsInput.value.slice(0, 9);
}

document.getElementById('shinyProbabilityNumerator').oninput = function sliceMaxLength() {
    shinyProbabilityNumerator.value = shinyProbabilityNumerator.value.slice(0, 9);
}

document.getElementById('shinyProbabilityDenominator').oninput = function sliceMaxLength() {
    shinyProbabilityDenominator.value = shinyProbabilityDenominator.value.slice(0, 9);
}

//カーソルが外れたら再計算
//対象はinputNumberのみ（増えるとカウンターボタンからの再計算は過剰と判断）
//似た動作なのでイベントをまとめたい
document.getElementById('traialsInput').onblur = function reCalc() {
    shinyProbability();
}

document.getElementById('shinyProbabilityNumerator').onblur = function reCalc() {
    shinyProbability();
}

document.getElementById('shinyProbabilityDenominator').onblur = function reCalc() {
    shinyProbability();
}

//起動時にcookie読み込んで反映
window.onload = function onload() {
    //cookieの内容を`;'で分割
    //(キー1)=(値1); (キー2)=(値2);
    //↓
    //cookieItem[0] = '(キー1)=(値1)'
    //cookieItem[2] = '(キー2)=(値2)'
    var cookies = document.cookie;
    var cookieItem = cookies.split(';');

    //cookieItemを`=`で区切る
    //elem[0]とemem[1]でペア、elem[2]とelem[3]でペア...
    var cookieValue = '';
    for (i = 0; i < cookieItem.length; i++) {
        var elem = cookieItem[i].split('=');
        //
        if (elem[0].trim() == 'traialsInput') {
            cookieValue = unescape(elem[1]);
            //試行回数をページに反映
            traialsInput.value = decodeURIComponent(cookieValue);
            console.log('cookie試行回数: ' + cookieValue);
        } else if (elem[0].trim() == 'shinyProbabilityNumerator') {
            cookieValue = unescape(elem[1]);
            //分子をページに反映
            shinyProbabilityNumerator.value = decodeURIComponent(cookieValue);
            console.log('cookie分子: ' + cookieValue);
        } else if (elem[0].trim() == 'shinyProbabilityDenominator') {
            cookieValue = unescape(elem[1]);
            //分母をページに反映
            shinyProbabilityDenominator.value = decodeURIComponent(cookieValue);
            console.log('cookie分母: ' + cookieValue);
        } else {
            continue;
      }
    }
    //確率計算を行って反映
    shinyProbability()
  }

function shinyProbability() {
    //HTML要素から要素を読み込み
    const encounterProbabilityTitle = document.getElementById('encounterProbabilityTitle');
    const shinyProbabilityNumerator = document.getElementById('shinyProbabilityNumerator');
    const shinyProbabilityDenominator = document.getElementById('shinyProbabilityDenominator');

    //演算
    //toLocaleStringで小数点以下の有効桁数を3桁に制限
    var shinyProbabilityNum = ((1 - (Math.pow(1 - (shinyProbabilityNumerator.value / shinyProbabilityDenominator.value), traialsInput.value))) * 100);
    var shinyProbabilityValue = shinyProbabilityNum.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    encounterProbabilityTitle.innerHTML = shinyProbabilityValue;

    //cookie書き込み
    //cookieの有効期限は1年（これが妥当かは分かりかねますが...）
    document.cookie = 'traialsInput=' + encodeURIComponent(traialsInput.value) + '; max-age=' + 60 * 60 * 24 * 365;
    document.cookie = 'shinyProbabilityNumerator=' + encodeURIComponent(shinyProbabilityNumerator.value) + '; max-age=' + 60 * 60 * 24 * 365;
    document.cookie = 'shinyProbabilityDenominator=' + encodeURIComponent(shinyProbabilityDenominator.value) + '; max-age=' + 60 * 60 * 24 * 365;

    //log書き込み
    //consoleで確認する用途
    console.log('試行回数: ' + traialsInput.value);
    console.log('次に色違いが出る確率: ' + encounterProbabilityTitle.innerHTML);
}
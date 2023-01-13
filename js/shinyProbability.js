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
    traialsInput.value = traialsInput.value.slice(0, 6);
}

document.getElementById('shingleShinyProbabilityNumerator').oninput = function sliceMaxLength() {
    shingleShinyProbabilityNumerator.value = shingleShinyProbabilityNumerator.value.slice(0, 6);
}

document.getElementById('shingleShinyProbabilityDenominator').oninput = function sliceMaxLength() {
    shingleShinyProbabilityDenominator.value = shingleShinyProbabilityDenominator.value.slice(0, 6);
}

//カーソルが外れたら再計算
//対象はinputNumberのみ（増えるとカウンターボタンからの再計算は過剰と判断）
//似た動作なのでイベントをまとめたい
document.getElementById('traialsInput').onblur = function reCalc() {
    shinyProbability();
}

document.getElementById('shingleShinyProbabilityNumerator').onblur = function reCalc() {
    shinyProbability();
}

document.getElementById('shingleShinyProbabilityDenominator').onblur = function reCalc() {
    shinyProbability();
}

function shinyProbability() {
    //HTML要素から要素を読み込み
    const nextShinyProbabilityTitle = document.getElementById('nextShinyProbabilityTitle');
    const shingleShinyProbabilityNumerator = document.getElementById('shingleShinyProbabilityNumerator');
    const shingleShinyProbabilityDenominator = document.getElementById('shingleShinyProbabilityDenominator');

    //演算
    //本当は文字列と数字で分裂させたい
    //計算部分と文字処理部分を分割したい
    nextShinyProbabilityTitle.innerHTML = '✨' + ((1 - (Math.pow(1 - (shingleShinyProbabilityNumerator.value / shingleShinyProbabilityDenominator.value), traialsInput.value)))*100).toFixed(3) + '%✨';

    //log書き込み
    //consoleで確認する用途
    console.log('試行回数 : ' + traialsInput.value);
    console.log('次に色違いが出る確率' + nextShinyProbabilityTitle.innerHTML);
}
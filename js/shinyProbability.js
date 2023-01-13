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

document.getElementById('shingleShinyProbabilityInput').oninput = function sliceMaxLength() {
    shingleShinyProbabilityInput.value = shingleShinyProbabilityInput.value.slice(0, 6);
}

function shinyProbability() {
    //HTML要素から要素を読み込み
    const nextShinyProbabilityTitle = document.getElementById('nextShinyProbabilityTitle');
    const shingleShinyProbabilityInput = document.getElementById('shingleShinyProbabilityInput');

    //演算
    //本当は文字列と数字で分裂させたい
    //計算部分と文字処理部分を分割したい
    nextShinyProbabilityTitle.innerHTML = '✨' + ((1 - (Math.pow(1 - (1 / shingleShinyProbabilityInput.value), traialsInput.value)))*100).toFixed(3) + '%✨';

    //log書き込み
    //consoleで確認する用途
    console.log(traialsInput.value);
    console.log(nextShinyProbabilityTitle.innerHTML);
}
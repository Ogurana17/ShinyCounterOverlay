// ShinyProbability
document.getElementById('traialsInputButton').onclick = function addCnt () {
    //初期設定
    const traialsInput = document.getElementById('traialsInput');
    const nextShinyProbabilityTitle = document.getElementById('nextShinyProbabilityTitle');
    const shingleShinyProbabilityInput = document.getElementById('shingleShinyProbabilityInput');

    //演算
    traialsInput.value++;
    nextShinyProbabilityTitle.innerHTML = '✨' + ((1 - (Math.pow(1 - (1 / shingleShinyProbabilityInput.value), traialsInput.value)))*100).toFixed(3) + '%✨';

    //log書き込み
    console.log(traialsInput.value);
    console.log(nextShinyProbabilityTitle.innerHTML);
}

//inputnumberの有効桁数制限
document.getElementById('traialsInput').oninput = function sliceMaxLength() {
    traialsInput.value = traialsInput.value.slice(0, 6);
}

document.getElementById('shingleShinyProbabilityInput').oninput = function sliceMaxLength() {
    shingleShinyProbabilityInput.value = shingleShinyProbabilityInput.value.slice(0, 6);
}
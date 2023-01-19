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

    // 確認用
    console.log('試行回数: ' + traialsInput.value);
    console.log('次に色違いが出る確率: ' + encounterProbabilityTitle.innerHTML);
}

// 世代の選択によってチェックボックスを作成
document.getElementById('generationSelector').onchange = function createCheckbox() {
    const generationSelector = document.getElementById('generationSelector');
    const checkboxs = document.getElementById('checkboxs');

    // 確認用
    console.log('generation: ' + generationSelector.value);

    // 生成済みのチェックボックスを削除
    while (checkboxs.firstChild) {
        checkboxs.removeChild(checkboxs.firstChild);
    }

    switch (Number(generationSelector.value)) {
        case 1:
            // 1世代と2世代は色違いにする方法が同じ
        case 2:
            // gen1Naturalを生成
            // checkbox
            var gen1Natural = document.createElement('input');
            gen1Natural.setAttribute('type', 'radio');
            gen1Natural.setAttribute('id', 'gen1Natural');
            gen1Natural.setAttribute('name', 'gen1Radio');
            checkboxs.appendChild(gen1Natural);
            // label
            var gen1NaturalLabel = document.createElement('label');
            gen1NaturalLabel.setAttribute('for', 'gen1Natural');
            gen1NaturalLabel.innerHTML = '自然遭遇';
            checkboxs.appendChild(gen1NaturalLabel);

            // gen1Heredityを生成
            // input
            var gen1Heredity = document.createElement('input');
            gen1Heredity.setAttribute('type', 'radio');
            gen1Heredity.setAttribute('id', 'gen1Heredity');
            gen1Heredity.setAttribute('name', 'gen1Radio');
            checkboxs.appendChild(gen1Heredity);
            // label
            var gen1HeredityLabel = document.createElement('label');
            gen1HeredityLabel.setAttribute('for', 'gen1Heredity');
            gen1HeredityLabel.innerHTML = '遺伝';
            checkboxs.appendChild(gen1HeredityLabel);
            break;
        case 3:
            // gen3Naturalを生成
            // checkbox
            var gen3Natural = document.createElement('input');
            gen3Natural.setAttribute('type', 'radio');
            gen3Natural.setAttribute('id', 'gen3Natural');
            gen3Natural.setAttribute('name', 'gen3Radio');
            checkboxs.appendChild(gen3Natural);
            // label
            var gen3NaturalLabel = document.createElement('label');
            gen3NaturalLabel.setAttribute('for', 'gen3Natural');
            gen3NaturalLabel.innerHTML = '自然遭遇';
            checkboxs.appendChild(gen3NaturalLabel);
            break;
        case 4:
            // gen4Naturalを生成
            // checkbox
            var gen4Natural = document.createElement('input');
            gen4Natural.setAttribute('type', 'radio');
            gen4Natural.setAttribute('id', 'gen4Natural');
            gen4Natural.setAttribute('name', 'gen4Radio');
            checkboxs.appendChild(gen4Natural);
            // label
            var gen4NaturalLabel = document.createElement('label');
            gen4NaturalLabel.setAttribute('for', 'gen4Natural');
            gen4NaturalLabel.innerHTML = '自然遭遇';
            checkboxs.appendChild(gen4NaturalLabel);

            // gen4MasudaMethodを生成
            // checkbox
            var gen4MasudaMethod = document.createElement('input');
            gen4MasudaMethod.setAttribute('type', 'radio');
            gen4MasudaMethod.setAttribute('id', 'gen4MasudaMethod');
            gen4MasudaMethod.setAttribute('name', 'gen4Radio');
            checkboxs.appendChild(gen4MasudaMethod);
            // label
            var gen4MasudaMethodLabel = document.createElement('label');
            gen4MasudaMethodLabel.setAttribute('for', 'gen4MasudaMethod');
            gen4MasudaMethodLabel.innerHTML = '国際孵化';
            checkboxs.appendChild(gen4MasudaMethodLabel);

            // gen4PokeRadarを生成
            // checkbox
            var gen4PokeRadar = document.createElement('input');
            gen4PokeRadar.setAttribute('type', 'radio');
            gen4PokeRadar.setAttribute('id', 'gen4PokeRadar');
            gen4PokeRadar.setAttribute('name', 'gen4Radio');
            checkboxs.appendChild(gen4PokeRadar);
            // label
            var gen4PokeRadarLabel = document.createElement('label');
            gen4PokeRadarLabel.setAttribute('for', 'gen4PokeRadar');
            gen4PokeRadarLabel.innerHTML = 'ポケトレ';
            checkboxs.appendChild(gen4PokeRadarLabel);
            break;
        case 5:
            // gen5Naturalを生成
            // checkbox
            var gen5Natural = document.createElement('input');
            gen5Natural.setAttribute('type', 'radio');
            gen5Natural.setAttribute('id', 'gen5Natural');
            gen5Natural.setAttribute('name', 'gen5Radio');
            checkboxs.appendChild(gen5Natural);
            // label
            var gen5NaturalLabel = document.createElement('label');
            gen5NaturalLabel.setAttribute('for', 'gen5Natural');
            gen5NaturalLabel.innerHTML = '自然遭遇';
            checkboxs.appendChild(gen5NaturalLabel);

            // gen5MasudaMethodを生成
            // checkbox
            var gen5MasudaMethod = document.createElement('input');
            gen5MasudaMethod.setAttribute('type', 'radio');
            gen5MasudaMethod.setAttribute('id', 'gen5MasudaMethod');
            gen5MasudaMethod.setAttribute('name', 'gen5Radio');
            checkboxs.appendChild(gen5MasudaMethod);
            // label
            var gen5MasudaMethodLabel = document.createElement('label');
            gen5MasudaMethodLabel.setAttribute('for', 'gen5MasudaMethod');
            gen5MasudaMethodLabel.innerHTML = '国際孵化';
            checkboxs.appendChild(gen5MasudaMethodLabel);

            // gen5ShinyCharmを生成
            // checkbox
            var gen5ShinyCharm = document.createElement('input');
            gen5ShinyCharm.setAttribute('type', 'checkbox');
            gen5ShinyCharm.setAttribute('id', 'gen5ShinyCharm');
            gen5ShinyCharm.setAttribute('name', 'gen5checkbox');
            checkboxs.appendChild(gen5ShinyCharm);
            // label
            var gen5ShinyCharmLabel = document.createElement('label');
            gen5ShinyCharmLabel.setAttribute('for', 'gen5ShinyCharm');
            gen5ShinyCharmLabel.innerHTML = 'ひかるおまもり';
            checkboxs.appendChild(gen5ShinyCharmLabel);
            break;
        case 6:
            // gen6Naturalを生成
            // checkbox
            var gen6Natural = document.createElement('input');
            gen6Natural.setAttribute('type', 'radio');
            gen6Natural.setAttribute('id', 'gen6Natural');
            gen6Natural.setAttribute('name', 'gen6Radio');
            checkboxs.appendChild(gen6Natural);
            // label
            var gen6NaturalLabel = document.createElement('label');
            gen6NaturalLabel.setAttribute('for', 'gen6Natural');
            gen6NaturalLabel.innerHTML = '自然遭遇';
            checkboxs.appendChild(gen6NaturalLabel);

            // gen6MasudaMethodを生成
            // checkbox
            var gen6MasudaMethod = document.createElement('input');
            gen6MasudaMethod.setAttribute('type', 'radio');
            gen6MasudaMethod.setAttribute('id', 'gen6MasudaMethod');
            gen6MasudaMethod.setAttribute('name', 'gen6Radio');
            checkboxs.appendChild(gen6MasudaMethod);
            // label
            var gen6MasudaMethodLabel = document.createElement('label');
            gen6MasudaMethodLabel.setAttribute('for', 'gen6MasudaMethod');
            gen6MasudaMethodLabel.innerHTML = '国際孵化';
            checkboxs.appendChild(gen6MasudaMethodLabel);

            // gen6PokeRadarを生成
            // checkbox
            var gen6PokeRadar = document.createElement('input');
            gen6PokeRadar.setAttribute('type', 'radio');
            gen6PokeRadar.setAttribute('id', 'gen6PokeRadar');
            gen6PokeRadar.setAttribute('name', 'gen6Radio');
            checkboxs.appendChild(gen6PokeRadar);
            // label
            var gen6PokeRadarLabel = document.createElement('label');
            gen6PokeRadarLabel.setAttribute('for', 'gen6PokeRadar');
            gen6PokeRadarLabel.innerHTML = 'ポケトレ';
            checkboxs.appendChild(gen6PokeRadarLabel);

            // gen6FriendSafariを生成
            // checkbox
            var gen6FriendSafari = document.createElement('input');
            gen6FriendSafari.setAttribute('type', 'radio');
            gen6FriendSafari.setAttribute('id', 'gen6FriendSafari');
            gen6FriendSafari.setAttribute('name', 'gen6Radio');
            checkboxs.appendChild(gen6FriendSafari);
            // label
            var gen6FriendSafariLabel = document.createElement('label');
            gen6FriendSafariLabel.setAttribute('for', 'gen6FriendSafari');
            gen6FriendSafariLabel.innerHTML = 'フレンドサファリ';
            checkboxs.appendChild(gen6FriendSafariLabel);

            // gen6ChainFishingを生成
            // checkbox
            var gen6ChainFishing = document.createElement('input');
            gen6ChainFishing.setAttribute('type', 'radio');
            gen6ChainFishing.setAttribute('id', 'gen6ChainFishing');
            gen6ChainFishing.setAttribute('name', 'gen6Radio');
            checkboxs.appendChild(gen6ChainFishing);
            // label
            var gen6ChainFishingLabel = document.createElement('label');
            gen6ChainFishingLabel.setAttribute('for', 'gen6ChainFishing');
            gen6ChainFishingLabel.innerHTML = '連続釣り';
            checkboxs.appendChild(gen6ChainFishingLabel);

            // gen6IndexNaviを生成
            // checkbox
            var gen6IndexNavi = document.createElement('input');
            gen6IndexNavi.setAttribute('type', 'radio');
            gen6IndexNavi.setAttribute('id', 'gen6IndexNavi');
            gen6IndexNavi.setAttribute('name', 'gen6Radio');
            checkboxs.appendChild(gen6IndexNavi);
            // label
            var gen6IndexNaviLabel = document.createElement('label');
            gen6IndexNaviLabel.setAttribute('for', 'gen6IndexNavi');
            gen6IndexNaviLabel.innerHTML = 'ずかんナビ';
            checkboxs.appendChild(gen6IndexNaviLabel);

            // gen6ShinyCharmを生成
            // checkbox
            var gen6ShinyCharm = document.createElement('input');
            gen6ShinyCharm.setAttribute('type', 'checkbox');
            gen6ShinyCharm.setAttribute('id', 'gen6ShinyCharm');
            gen6ShinyCharm.setAttribute('name', 'gen6checkbox');
            checkboxs.appendChild(gen6ShinyCharm);
            // label
            var gen6ShinyCharmLabel = document.createElement('label');
            gen6ShinyCharmLabel.setAttribute('for', 'gen6ShinyCharm');
            gen6ShinyCharmLabel.innerHTML = 'ひかるおまもり';
            checkboxs.appendChild(gen6ShinyCharmLabel);
            break;
        case 7:
            // gen7Naturalを生成
            // checkbox
            var gen7Natural = document.createElement('input');
            gen7Natural.setAttribute('type', 'radio');
            gen7Natural.setAttribute('id', 'gen7Natural');
            gen7Natural.setAttribute('name', 'gen7Radio');
            checkboxs.appendChild(gen7Natural);
            // label
            var gen7NaturalLabel = document.createElement('label');
            gen7NaturalLabel.setAttribute('for', 'gen7Natural');
            gen7NaturalLabel.innerHTML = '自然遭遇';
            checkboxs.appendChild(gen7NaturalLabel);

            // gen7MasudaMethodを生成
            // checkbox
            var gen7MasudaMethod = document.createElement('input');
            gen7MasudaMethod.setAttribute('type', 'radio');
            gen7MasudaMethod.setAttribute('id', 'gen7MasudaMethod');
            gen7MasudaMethod.setAttribute('name', 'gen7Radio');
            checkboxs.appendChild(gen7MasudaMethod);
            // label
            var gen7MasudaMethodLabel = document.createElement('label');
            gen7MasudaMethodLabel.setAttribute('for', 'gen7MasudaMethod');
            gen7MasudaMethodLabel.innerHTML = '国際孵化';
            checkboxs.appendChild(gen7MasudaMethodLabel);
            break;
        case 8:
            // gen8Naturalを生成
            // checkbox
            var gen8Natural = document.createElement('input');
            gen8Natural.setAttribute('type', 'radio');
            gen8Natural.setAttribute('id', 'gen8Natural');
            gen8Natural.setAttribute('name', 'gen8Radio');
            checkboxs.appendChild(gen8Natural);
            // label
            var gen8NaturalLabel = document.createElement('label');
            gen8NaturalLabel.setAttribute('for', 'gen8Natural');
            gen8NaturalLabel.innerHTML = '自然遭遇';
            checkboxs.appendChild(gen8NaturalLabel);

            // gen8MasudaMethodを生成
            // checkbox
            var gen8MasudaMethod = document.createElement('input');
            gen8MasudaMethod.setAttribute('type', 'radio');
            gen8MasudaMethod.setAttribute('id', 'gen8MasudaMethod');
            gen8MasudaMethod.setAttribute('name', 'gen8Radio');
            checkboxs.appendChild(gen8MasudaMethod);
            // label
            var gen8MasudaMethodLabel = document.createElement('label');
            gen8MasudaMethodLabel.setAttribute('for', 'gen8MasudaMethod');
            gen8MasudaMethodLabel.innerHTML = '国際孵化';
            checkboxs.appendChild(gen8MasudaMethodLabel);
            break;
        case 9:
            // gen9Naturalを生成
            // checkbox
            var gen9Natural = document.createElement('input');
            gen9Natural.setAttribute('type', 'radio');
            gen9Natural.setAttribute('id', 'gen9Natural');
            gen9Natural.setAttribute('name', 'gen9Radio');
            checkboxs.appendChild(gen9Natural);
            // label
            var gen9NaturalLabel = document.createElement('label');
            gen9NaturalLabel.setAttribute('for', 'gen9Natural');
            gen9NaturalLabel.innerHTML = '自然遭遇';
            checkboxs.appendChild(gen9NaturalLabel);

            // gen9MasudaMethodを生成
            // checkbox
            var gen9MasudaMethod = document.createElement('input');
            gen9MasudaMethod.setAttribute('type', 'radio');
            gen9MasudaMethod.setAttribute('id', 'gen9MasudaMethod');
            gen9MasudaMethod.setAttribute('name', 'gen9Radio');
            checkboxs.appendChild(gen9MasudaMethod);
            // label
            var gen9MasudaMethodLabel = document.createElement('label');
            gen9MasudaMethodLabel.setAttribute('for', 'gen9MasudaMethod');
            gen9MasudaMethodLabel.innerHTML = '国際孵化';
            checkboxs.appendChild(gen9MasudaMethodLabel);
            break;
        default:
            console.log('case: default');
            break;
    }
}

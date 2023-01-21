# Shiny Counter Overlay

![screenshot](src/2023-01-14_00-24-27.mkv_snapshot_00.00.414.jpg)

ポケットモンスターシリーズの色違いのポケモンが出現する確率をOBS等のオーバーレイとして表示するためのリポジトリ。
GitHubPagesを利用して動かします。

## 特徴

- 配信画面に配置できるタイプのカウンター
- cookieによる確率の保存機能
- スマホやタブレットでもカウント可能
- 背景が半透明なのでゲーム画面またはお使いのオーバーレイに馴染みます

## 進捗

- [x] 1匹のときの計算結果を出力する
- [x] cookieによる保存機能
- [x] 約分機能の追加
- [x] 色違いの確率のプリセットを用意する
- [ ] **デザインを整える←←←**
- [ ] ~~背景をグリーンにするオプション~~

### 検討中

- [ ] ファイルのI/Oによる保存機能
- [ ] 2匹以上の場合の確率計算

## 使用方法

### OBS側

1. ブラウザソースを追加
2. URLに`https://ogurana17.github.io/ShinyCounterOverlay/`を入力
3. 幅`210`高さ`300`にする（幅と高さに同じ倍率を適用すれば、ある程度は破綻しません）
4. `OK`を押す
5. 任意の位置に移動または拡大をする
6. 追加したブラウザソースを右クリックし、`対話（操作）`をクリック

### Shiny Counter Overlay側

1. `元の確率`に数値を入力（9桁まで入力可能）
2. `試行回数`に数値を入力（9桁まで入力可能）
3. `+1`ボタンを押すと1ずつ試行回数が増えていき、`-1`を押すと1ずつ試行回数が減っていきます

元の確率は下記のURLを参照ください。

| 参考元      | URL                                                               |
| -------- | ----------------------------------------------------------------- |
| 色違いの確率   | <https://wiki.xn--rckteqa2e.com/wiki/%E8%89%B2%E9%81%95%E3%81%84> |
| あかし持ちの確率 | <https://wiki.xn--rckteqa2e.com/wiki/%E3%81%82%E3%81%8B%E3%81%97> |

### 確率計算の例

ニャオハの`♀`, `最小`, `色違い`を狙うとする。

ちびちびパワーLv3、かがやきパワーLv3（または国際孵化）、ひかるおまもり有りの場合

$$
\\begin{equation}
\\begin{split}
x &= {1 \\over 8} \\times {1 \\over 64} \\times {1 \\over } \\times {8 \\over 4096} \\
x &= {1 \\over 262144}
\\end{split}
\\end{equation}
$$

ちびちびパワーLv3無し、かがやきパワーLv3（または国際孵化）無し、ひかるおまもり無しの場合

$$
\\begin{equation}
\\begin{split}
x &= {1 \\over 8} \\times {1 \\over 16512} \\times {1 \\over 4096} \\
x &= {1 \\over 541065216}
\\end{split}
\\end{equation}
$$

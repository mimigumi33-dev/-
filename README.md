# ヤンデレライト

`index.html` をブラウザで開くと遊べる、スマホ対応のノベルゲームです。3人の攻略対象それぞれに3種類、計9つのバッドエンドがあります。

## 素材の差し替え

- 背景・立ち絵: `assets/backgrounds/` / `assets/characters/` に画像を置き、`style.css` の `.magic`、`.angel`、`.dream`、`.daily` を `background-image: url(...)` に差し替えます。
- BGM: `assets/bgm/` に音声ファイルを置き、`script.js` 冒頭の `AUDIO_PATH` に例として `"assets/bgm/main.mp3"` を設定します。

現在の背景は、素材到着前でもそのまま雰囲気を確認できるCSS製の仮ビジュアルです。

## スマホで遊ぶ

公開URLで開けば、iPhone / Android のブラウザでそのまま遊べます。PWA対応済みのため、Safariなら共有メニューの「ホーム画面に追加」、Chromeなら「アプリをインストール」でアプリ風に起動できます。

公開には GitHub Pages、Netlify、Cloudflare Pages などの静的サイト公開サービスが使えます。HTTPSで公開するとオフライン起動も有効になります。

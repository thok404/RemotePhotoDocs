---
title: 設定
---
## コア構造

RemotePhotoSystem は4種類のコンポーネントで構成されます：

| コンポーネント | 能力 |
| -------------------- | ------------------------ |
| `RemotePhotoManager` | ギャラリー、再生モード、読み込みモード、プリロードキャッシュ、管理グループを管理 |
| `RemotePhotoGroup` | フレームのグループを管理し、写真切り替えイベントを提供 |
| `RemotePhotoFrame` | メッシュマテリアル上にリモート画像を表示 |
| `RemotePhotoButton` | ボタン操作を Group イベントへ転送 |

RemotePhotoSystem は写真をワールドファイルからリモート URL へ移しますが、ランタイムでは依然としてダウンロード、Texture、VRAM、マテリアルインスタンス、draw call、同期コストを支払う必要があります。



## 1. Manager

1つのシーンでは `RemotePhotoManager` を1つだけ使用します。複数 Manager のケースは未検証で、致命的なbugを引き起こす可能性があります。

`RemotePhotoManager` はギャラリー、再生、読み込み、Group 順序、Shader チェックを一元管理します。

| 機能 | 説明 |
| -------------------------- | ----------------------------- |
| `Language` | 本プロジェクトの Inspector 文言言語を切り替え、ゲーム内表示には影響しません |
| `Gallery Config JSON` | WebTool が出力したギャラリー JSON を受け取ります |
| `Import JSON Into Gallery` | JSON をランタイム URL 配列へ Bake します |
| `Play Mode` | Group 触発時の選図方式を制御します |
| `Loading Mode` | 画像をプリロードキャッシュに入れるかどうかを制御します |
| `Load Once On Start` | ワールド開始後、すべての管理グループを一度自動で触発します |
| `Managed Groups` | Manager が管理する Group リスト |

Unity はメモリ節約のため `url` と `orientation` だけを記録します。JSON 内の `id`、`tags`、`note`、`metadata` は WebTool がギャラリー管理をしやすくするために読み取ります。

より大きなギャラリーを作成すると、主に JSON Bake 後の配列、Unity シリアライズデータ、保守コストが増えます。

表示中の画像と `Preload` にキャッシュされた画像が最大のパフォーマンスコストを使います。

## 2. Gallery

| WebTool 能力 | 説明 |
| ------------- | ------------------------------------ |
| URL インポート | 少量の手入力または大量の一括 URL を受け取ります |
| タグ / メモ | ギャラリー保守だけに使われ、ランタイム配列には入りません |
| 画像サイズ検出 | `Landscape` / `Portrait` の判断を補助できます |
| Unity JSON エクスポート | Manager の `Gallery Config JSON` に使用します |

WebTool の詳細説明は[こちら](webtool.md)で確認できます。

画像 URL は VRChat の画像読み込み要件に従う必要があります。関連制限は公式ドキュメントを参照してください：  
https://creators.vrchat.com/worlds/udon/image-loading/

個人画像ホスティング関連の内容は[こちら](self-hosted-image-solution.md)で詳しく確認できます。

各 Frame は対応する方向のギャラリーからのみ画像を取ります：

| Frame 方向 | 使用ギャラリー |
|---|---|
| `Landscape` | 横画像ギャラリー |
| `Portrait` | 縦画像ギャラリー |

縦向きフレームを横画像の回転で解決しないでください。ギャラリー内の縦画像は `Portrait` にし、Frame も `Portrait` に設定してください。

Landscape フレームを Portrait フレームへ変換する場合、正しい画像向きを得るために**フレームオブジェクトを反時計回りに 90° 回転**してください。

ある方向のギャラリーが空の場合、その方向の Frame には使用可能な画像がありません。

## 3. Playback

`Play Mode` は Group 触発時に URL をどう選択するかを決定します。

| モード | 能力 | 利用可能イベント |
| ------------------------------------- | --------------------------------- | ------------------------------------- |
| `Random` | Group 内 Frame にランダムで画像を割り当て、同一バッチ同方向ではできるだけ重複を避けます | `TriggerRandom()` |
| `SequenceForward`/  `SequenceReverse` | ギャラリーを正順/逆順でページ送りします | `TriggerPrevious()` / `TriggerNext()` |

ランダムモードと順序モードは排他的です。

順序モードでは、横向き Frame は Landscape キューだけを進め、縦向き Frame は Portrait キューだけを進めます。1つの Group は横縦 Frame を混在できます。

## 4. Loading

`Loading Mode` は画像ダウンロード経路を制御します。

| モード | 能力 |
| ------------ | -------------------------- |
| `NonPreload` | 画像が必要なとき直接ダウンロードし、プリロードキャッシュを保持しません |
| `Preload` | 一部の画像を事前にキャッシュへダウンロードし、読み込み時にキャッシュ命中すればより速く表示できます |

`Preload` はメモリ、VRAM、ダウンロードキューを表示速度と交換します。キャッシュが大きいほど、ランタイムリソース使用量が高くなります。

`NonPreload` はキャッシュを保持せず、表示画像の数と解像度だけがパフォーマンスに影響します


おおよその Texture コスト：

| 解像度 | RGBA テクスチャの概算 |
|---|---|
| 1024 x 1024 | 約 4 MB |
| 2048 x 2048 | 約 16 MB |
| 4096 x 4096 | 約 64 MB |

超大画像と大きなキャッシュを組み合わせると、メモリとVRAMの圧力が急速に拡大します。Android 端末ではリスクがより高くなります。


`Load Once On Start` を有効にすると、`Load Once Delay Seconds` 後に `Managed Groups` の順序で全管理 Group を一度触発します。

`Retry Attempts` と `Retry Delay Seconds` はダウンロード失敗時のグローバル再試行設定です。

## 5. Groups

`RemotePhotoGroup` は独立して更新できるフレーム領域を計画します。

| 機能 | 説明 |
|---|---|
| `Permission Mode` | この Group を誰が触発できるかを制御します |
| `Trigger Cooldown Seconds` | 成功触発間の最短間隔を制限します |
| `Frames` | この Group が制御する Frame リスト |

Group と Frame はどちらも上位管理リストの順序で URL を取得し画像を読み込みます。

ボタンをクリックしてプレイヤーの現在位置から見えないフレームまで更新するのは無駄です。VRChat では5秒ごとに最大1枚の画像しか読み込めないため、エリアごとに Group を分けるのは良い選択です。

複数人の連続触発は同期状態とダウンロードキューの圧力を増やします。クールダウン時間は成功触発頻度を制限するために使います。5 秒は良い選択です。

## 6. Frames

`RemotePhotoFrame` はリモート画像を現在オブジェクトの `MeshRenderer` マテリアルへ書き込む役割を持ちます。

| 機能 | 説明 |
|---|---|
| `Orientation` | Frame が Landscape または Portrait ギャラリーのどちらを使うかを決定します |
| `Material Slot` | どのマテリアルスロットへ書き込むかを指定します |
| `Texture Property` | どのテクスチャプロパティへ書き込むかを指定し、プロジェクト専用 Shader は通常 `_MainTex` のままです |
| `Default Texture` | 起動時に表示するデフォルトテクスチャ |
| `Use Fallback Texture` | 読み込み失敗時に Fallback を表示するかを制御します |
| `Fallback Texture` | 読み込み失敗時に表示するフォールバックテクスチャ |
| `Background Color` | `Contain` の余白と `Box` 側面の塗りつぶし色 |

`Use Fallback Texture` をオフにすると、読み込み失敗時に現在の画面を上書きしません。オンにすると、読み込み失敗時に `Fallback Texture` を表示します。

### 画像フィット

| `Photo Fit Mode` | 効果 |
| ---------------- | -------------------------------- |
| `Crop` | フレーム比率に合わせて画像を裁切し、画面をフレームいっぱいにします |
| `Contain` | 画像全体を保持し、空白領域に `Background Color` を使用します |
| `Stretch` | 画像をフレーム比率へ直接引き伸ばします |
| `Tile` | 画像を繰り返しタイル表示します |

### 投射方式

| `Projection Mode` | 効果 |
| ----------------- | ----------------------------------------- |
| `Mesh UV` | モデル自身の UV で画像を表示します |
| `Box` | 最短辺を厚みとして扱い、前後面に画像を投射し、側面には `Background Color` を使用します |

`Horizontal Flip` は `Box` にのみ作用し、Box 投射結果を水平反転するために使います。

### 比率と回転

| 機能 | 説明 |
|---|---|
| `Manual` | `Manual Aspect Ratio` を固定幅高比として使用します |
| `Auto` | 現在のメッシュから幅高比を自動計算します |
| `Reference Box` | カスタム Reference Box を使って幅高比を計算します |
| `Photo Rotation Offset` | 最終画像表示結果に回転補正を追加し、`Mesh UV` と `Box` をサポートします |

## 7. Shader

写真表示マテリアルはプロジェクト専用 Shader を使う必要があります：

| Shader | 用途 |
| --------------------------------------------- | ------------------------ |
| `RemotePhotoSystem/Photo Frame Display Unlit` | シーンライティングを計算せず、スクリーンのように表示し、性能に優しい |
| `RemotePhotoSystem/Photo Frame Display Lit` | シーンライティングを計算し、環境になじみやすく、drawcall が増えます |

各 `RemotePhotoFrame` は異なる画像を表示するため、ランタイムで独立したマテリアルインスタンスが必要です。

フレーム数が増えると Drawcall も増えます

Manager は `Managed Groups -> Frames` がカバーするフレームをスキャンします。フレームマテリアルがプロジェクト専用 Shader を使用していない場合、Inspector に警告が表示されます。

警告エリアには2つのクイック設定ボタンがあります
この2つのボタンは、現在の Manager が `Managed Groups` を通じて接続している Frame マテリアルだけを処理します。

## 8. Buttons

`RemotePhotoButton` は `Button Action` を対象 Group イベントへマッピングします。

| `Button Action` | 呼び出しイベント | 利用可能な再生モード |
|---|---|---|
| `Random` | `TriggerRandom()` | `Random` |
| `Previous` | `TriggerPrevious()` | `SequenceForward` / `SequenceReverse` |
| `Next` | `TriggerNext()` | `SequenceForward` / `SequenceReverse` |

外部 VRC ボタン、スイッチ、メニュー、トリガーアセットは `RemotePhotoGroup` の公開イベントへ直接接続できます：

| 操作 | イベント |
|---|---|
| ランダム写真切り替え | `TriggerRandom()` |
| 前のページへ | `TriggerPrevious()` |
| 次のページへ | `TriggerNext()` |

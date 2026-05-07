---
title: RemotePhotoManager
---
# RemotePhotoManager

![446](Pasted%20image%2020260507000125.png)

RemotePhotoManager はシステム全体の動作を管理します。ギャラリー JSON の取り込み、再生モード、読み込みモード、Group の接続を設定します。

> 1 つのシーンに存在できる RemotePhotoManager は 1 つだけです。

## パラメーター

| パラメーター | 説明 |
|---|---|
| Language (言語) | コンポーネントのエディター内表示言語を切り替えます。 |
| Gallery Config JSON (ギャラリー設定 JSON) | Web ツールで生成した JSON を取り込み、ギャラリーを作成します。ギャラリーは Landscape / Portrait の向きごとに分かれ、対応する Frame に使われます。 |
| Play Mode (再生モード) | ギャラリー内の写真の並び方を切り替えます。Random / Sequence Forward / Sequence Reverse のうち、全体で 1 つだけ使用します。 |
| Loading Mode (読み込みモード) | Preload と NonPreload を切り替えます。 |
| Load Once On Start (開始時に一度読み込む) | インスタンス開始時に、管理対象のすべての Frame に写真を自動で読み込みます。 |
| Load Once Delay Seconds (一度読み込み遅延秒数) | インスタンス開始後、`Load Once On Start` を実行するまでの遅延秒数です。 |
| Retry Attempts (再試行回数) | 画像読み込み失敗時の最大再試行回数です。 |
| Retry Delay Seconds (再試行間隔秒数) | 画像読み込み失敗後、再試行するまでの間隔です。 |
| Debug Logs (デバッグログ) | デバッグログを出力します。 |
| Managed Groups (管理グループ) | シーン内の Group を管理します。ここに追加された Group だけが有効になります。 |

## Preload Only

| パラメーター | 説明 |
|---|---|
| Landscape Cache Size (横向きキャッシュ数) | Preload キャッシュが保持する Landscape 写真の数です。 |
| Portrait Cache Size (縦向きキャッシュ数) | Preload キャッシュが保持する Portrait 写真の数です。 |

# RemotePhotoGroup

![512](Pasted%20image%2020260507002012.png)

RemotePhotoGroup は、各 Group の操作権限、ボタンクールダウン、接続する Frame を設定します。

## パラメーター

| パラメーター | 説明 |
|---|---|
| Permission Mode (権限モード) | この Group を操作できるユーザーを設定します。`Everyone`、`Owner Only`、`Master Only` から選べます。多くの場合は `Everyone` を使います。 |
| Trigger Cooldown Seconds (トリガークールダウン秒数) | 写真変更イベントの後、次にトリガーできるまでの秒数です。連続クリックの間隔として考えられます。 |
| Frames (フレーム) | この Group に接続する Frame を管理します。RemotePhotoManager に管理されている Group 内の Frame だけが有効です。この並び順が、ギャラリーから写真を取得する順番になります。 |

## イベント

| イベント | 説明 |
|---|---|
| TriggerRandom() | ランダム写真変更を実行します。Random モードでのみ有効です。 |
| TriggerPrevious() | 前のページへ移動します。Sequence / Reverse Sequence モードでのみ有効です。 |
| TriggerNext() | 次のページへ移動します。Sequence / Reverse Sequence モードでのみ有効です。 |

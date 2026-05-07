---
title: RemotePhotoButton
---
# RemotePhotoButton

![562](../../assets/images/Pasted-image-20260507120138.png)

RemotePhotoButton はプレハブボタン用のコンポーネントです。

> 外部ボタンアセットを使う場合は、このコンポーネントではなく、RemotePhotoGroup の `TriggerRandom()`、`TriggerPrevious()`、`TriggerNext()` イベントを使って 3 種類のボタンを作成してください。

いずれにせよこのコンポーネントを使用して独自のボタンを作成したい場合は、`TriggerSelectedAction()` イベントを呼び出します。たとえば Button コンポーネントの On Click でこのコンポーネントを参照し、`UdonBehaviour.SendCustomEvent` を `TriggerSelectedAction` に設定します。

![564](../../assets/images/Pasted-image-20260507121858.png)

## パラメーター

| パラメーター | 説明 |
|---|---|
| Remote Photo Group (Remote Photo Group) | このボタンが操作する Group を入れます。RemotePhotoGroup コンポーネントが付いた GameObject を指定します。 |
| Button Action (ボタン動作) | このボタンがトリガーするイベントを選びます。 |

## Button Action

| オプション | 説明 |
|---|---|
| Random | Group の `TriggerRandom()` イベントを実行します。ランダムボタンに使います。 |
| Previous | Group の `TriggerPrevious()` イベントを実行します。前ページボタンに使います。 |
| Next | Group の `TriggerNext()` イベントを実行します。次ページボタンに使います。 |

## イベント

| イベント | 説明 |
|---|---|
| TriggerSelectedAction() | `Button Action` の 3 種類の内蔵イベントを橋渡しします。 |

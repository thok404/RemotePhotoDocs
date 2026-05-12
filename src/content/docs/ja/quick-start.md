---
title: クイックスタート
---

# クイックスタート

クイックスタートが行うことは1つだけです：**まずランダム写真ボタンがシーン内でリモート画像を正常に読み込めるようにする**。

ここでは原理をあまり説明しません。先に手順を完了し、正常に動作することを確認してから、他の内容を読み返してください。

## 0. 環境要件

解像度<=2048 x 2048 の画像直リンクを数枚用意します。直リンクは多くの場合、`.jpg`、`.png`、`.gif`、`.webp` などの画像形式で終わります。より詳細な画像要件はVRChat公式ドキュメントを参照してください https://creators.vrchat.com/worlds/udon/image-loading/

ネットワーク転送、保存、ゲーム性能の体験を良くするため、jpg形式と1024前後の解像度の画像を使うことをおすすめします

Webで画像直リンクを検索して取得してもよいですし、自分の画像を画像ホスティングへアップロードして直リンクを取得してもよいです。GitHubリポジトリやCloudFlareR2を使って長期的に安定した個人画像ホスティングを作ることもできます。個人画像ホスティングについてはこちらをクリックして詳しく確認できます。


できるだけ以下のバージョン以上を使用してください：

| 依存 | バージョン |
| ------------------- | ------------- |
| Unity | `2022.3.22f1` |
| VRChat SDK - Worlds | `3.10.3` 以上 |
| VRChat SDK - Base | `3.10.3` 以上 |

> より低いバージョンの環境でも動作する可能性はありますが、致命的なエラーが存在する可能性があります。

## 1. RemotePhotoSystem をインポート

`RemotePhotoSystem` の `unitypackage` を Unity プロジェクトへインポートします。

![](../../../assets/images/Pasted%20image%2020260508212908.png)

## 2. フレームとボタンを配置

`Prefab` フォルダ内でフレームとボタンのプレハブを見つけ、シーンへドラッグします。

このチュートリアルではランダムボタン1つだけを示します。ランダムモードと順序ページモードを同じ Manager 内で混用しないでください。

![](../../../assets/images/Pasted%20image%2020260508213732.png)

## 3. Manager を作成

`Hierarchy` の空白部分で右クリックし、次を選択します：

`Remote Photo System -> Create Manager`

これにより、`RemotePhotoManager` コンポーネントを持つオブジェクトがシーン内に作成されます。

![236](../../../assets/images/Pasted%20image%2020260508214533.png)

## 4. WebTool でギャラリー JSON を作成

プロジェクト内の `WebTool` フォルダを開き、ブラウザで `index.html` を開きます。

画像直リンクを `Bulk URL Import` に貼り付けます。1行に1つの URL を入れ、`Import Pasted URLs` をクリックします。

![](../../../assets/images/Pasted%20image%2020260508215209.png)

## 5. Landscape / Portrait を自動認識

Webページを下へスクロールし、`Probe Scope` を `Missing Metadata` に設定して、`Probe Image Sizes` をクリックします。

Webツールは画像サイズの読み取りを試み、自動的に `Orientation` を入力します。

![](../../../assets/images/Pasted%20image%2020260508215426.png)

> 一部の画像が自動認識できない場合は、手動で `Landscape` または `Portrait` に設定すればよいです。

## 6. Unity JSON をエクスポート

画像リストに問題がないことを確認したら、ページ上部へ戻り、右上の `Export Unity JSON` をクリックします。

ブラウザがギャラリー設定ファイルをダウンロードします。この JSON ファイルを Unity プロジェクトの `Assets` ディレクトリ内の好きな場所へ置きます。

![](../../../assets/images/Pasted%20image%2020260508215653.png)

## 7. Manager へギャラリーをインポート

Unity に戻り、手順3で作成した Manager を選択します。

先ほどエクスポートした JSON ファイルを `Gallery Config JSON` へドラッグし、次をクリックします：

`Import JSON Into Gallery`

下の `Total photos` がインポートした画像数になれば、ギャラリーのインポートは成功です。

![](../../../assets/images/Pasted%20image%2020260508220510.png)

## 8. Group を作成

Manager Inspector 下部の `Managed Groups` を見つけ、次をクリックします：

`Add Group`

システムは Manager の下に新しい子オブジェクトを作成し、自動的に `RemotePhotoGroup` を追加します。

![](../../../assets/images/Pasted%20image%2020260508220830.png)

## 9. フレームを Group に追加

フレームプレハブの階層を展開し、実際に写真を表示する `Photo` 子オブジェクトを見つけます。

作成した Group を選択し、これらの `Photo` 子オブジェクトを Group の `Frames` リストへドラッグします。

> `Frames` の順序が写真割り当てと読み込みの順序です。最初はシーン内で左から右、近くから遠くなど、直感的な順序で入れればよいです。

![](../../../assets/images/Pasted%20image%2020260508221218.png)

## 10. ボタンを接続

ボタンオブジェクトを選択し、作成した Group をボタンコンポーネントの `Remote Photo Group` へドラッグします。

その後、`Button Action` が次に設定されていることを確認します：

`Random`

![](../../../assets/images/Pasted%20image%2020260508221624.png)


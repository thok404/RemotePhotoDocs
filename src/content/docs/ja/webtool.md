---
title: Webツール
---
WebTool はローカル静的ギャラリーマネージャーです。画像 URL データを保守し、Unity がインポートできるギャラリー JSON をエクスポートします。

## データ範囲

WebTool は完全なギャラリーエントリを管理します：

| フィールド | 用途 |
|---|---|
| `id` | エントリ識別名 |
| `url` | 画像直リンク |
| `orientation` | `Landscape` / `Portrait` 分類 |
| `tags` | タグ |
| `note` | メモ |
| `metadata` | 画像検出結果 |

Unity Bake は `url` と `orientation` だけを読み取ります。他のフィールドは WebTool が使用します。

## インポート

WebTool は3種類のデータ入口をサポートします：

| 入口 | 内容 |
|---|---|
| `Import JSON` | 既存のギャラリー JSON を読み取ります |
| `Import URL TXT` | 1行1 URL のテキストファイルを読み取ります |
| `Bulk URL Import` | 複数行の URL を貼り付けます |

`Default Orientation` は一括インポート時の初期方向に使用されます。

## 編集

テーブルはエントリ単位の編集を提供します：

| 項目 | 内容 |
|---|---|
| URL | 画像アドレス |
| Orientation | 横画像 / 縦画像分類 |
| Tags | タグテキスト |
| Note | メモテキスト |
| Metadata | 検出状態とサイズ情報 |

`Add Blank Entry` は空エントリの作成に使用します。

## フィルターとページング

| コントロール | 作用 |
|---|---|
| `Search` | URL、ID、タグ、メモを検索 |
| `Orientation` | 横画像 / 縦画像でフィルター |
| `Metadata` | 探測状態でフィルター |
| `Page Size` | 1ページに表示する数を設定 |

上部の統計は総数、横画像数、縦画像数、無効 URL 数、選択数、Metadata OK 数を表示します。

## 一括操作

| 操作 | 結果 |
| -------------------------- | -------------------- |
| `Select Page` | 現在のページを選択 |
| `Select Filtered` | 現在のフィルター結果を選択 |
| `Clear Selection` | 選択をクリア |
| `Set Selected Landscape` | 選択エントリを `Landscape` に設定 |
| `Set Selected Portrait` | 選択エントリを `Portrait` に設定 |
| `Generate IDs` | URL ファイル名から ID を生成 |
| `Remove Duplicate URLs` | 重複 URL を削除 |
| `Delete Selected` | 選択エントリを削除 |
| `Add Tag To Selected` | 選択エントリにタグを追加 |
| `Remove Tag From Selected` | 選択エントリからタグを削除 |

## 画像サイズ検出

`Probe Image Sizes` はブラウザに画像を読み込ませ、幅と高さを読み取ります。

検出に成功すると、`metadata` はサイズと状態を記録します。`Apply Detected Orientation` が有効な場合、ツールは幅と高さに基づいて方向を書き込みます：
幅>=高さ    `Landscape`
高さ>幅    `Portrait`


`Probe Scope` は検出範囲を制御します：

| 範囲 | 内容 |
| ------------------ | --------------- |
| `Selected` | 選択中のエントリ |
| `Filtered` | 現在のフィルター結果 |
| `Missing Metadata` | metadata がないエントリ |
| `All` | すべてのエントリ |

## ローカルキャッシュ

画像検出結果はブラウザの `IndexedDB` にキャッシュされ、キャッシュキーは画像 URL です。

通常の検出はキャッシュに命中した場合、画像を再読み込みしません。`Force Refresh` はキャッシュを無視して再検出します。

## エクスポート

`Export Unity JSON` は Unity が使用するギャラリー設定ファイルを出力します。

エクスポートされた JSON は WebTool に再インポートすることも、`RemotePhotoManager` に渡して `Import JSON Into Gallery` を実行することもできます。


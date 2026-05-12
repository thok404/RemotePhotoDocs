---
title: 网页工具
---
WebTool 是本地静态图库管理器。它维护图片 URL 数据，并导出 Unity 可以导入的图库 JSON。

## 数据范围

WebTool 管理完整图库条目：

| 字段 | 用途 |
|---|---|
| `id` | 条目识别名 |
| `url` | 图片直链 |
| `orientation` | `Landscape` / `Portrait` 分类 |
| `tags` | 标签 |
| `note` | 备注 |
| `metadata` | 图片探测结果 |

Unity Bake 只读取 `url` 和 `orientation`。其他字段供 WebTool 使用。

## 导入

WebTool 支持三种数据入口：

| 入口 | 内容 |
|---|---|
| `Import JSON` | 读取现有图库 JSON |
| `Import URL TXT` | 读取一行一个 URL 的文本文件 |
| `Bulk URL Import` | 粘贴多行 URL |

`Default Orientation` 用于批量导入时的初始方向。

## 编辑

表格提供条目级编辑：

| 项目 | 内容 |
|---|---|
| URL | 图片地址 |
| Orientation | 横图 / 竖图分类 |
| Tags | 标签文本 |
| Note | 备注文本 |
| Metadata | 探测状态和尺寸信息 |

`Add Blank Entry` 用于创建空条目。

## 筛选和分页

| 控件 | 作用 |
|---|---|
| `Search` | 搜索 URL、ID、标签、备注 |
| `Orientation` | 按横图 / 竖图筛选 |
| `Metadata` | 按探测状态筛选 |
| `Page Size` | 设置每页显示数量 |

顶部统计显示总数、横图数、竖图数、无效 URL 数、选中数、Metadata OK 数。

## 批量操作

| 操作 | 结果 |
| -------------------------- | -------------------- |
| `Select Page` | 选中当前页 |
| `Select Filtered` | 选中当前筛选结果 |
| `Clear Selection` | 清空选择 |
| `Set Selected Landscape` | 将选中条目标记为 `Landscape` |
| `Set Selected Portrait` | 将选中条目标记为 `Portrait` |
| `Generate IDs` | 根据 URL 文件名生成 ID |
| `Remove Duplicate URLs` | 删除重复 URL |
| `Delete Selected` | 删除选中条目 |
| `Add Tag To Selected` | 给选中条目添加标签 |
| `Remove Tag From Selected` | 从选中条目移除标签 |

## 图片尺寸探测

`Probe Image Sizes` 会让浏览器加载图片并读取宽高。

探测成功后，`metadata` 记录尺寸和状态。启用 `Apply Detected Orientation` 时，工具会根据宽高写入方向：
宽度>=高度    `Landscape`
高度>宽度    `Portrait`


`Probe Scope` 控制探测范围：

| 范围 | 内容 |
| ------------------ | --------------- |
| `Selected` | 选中的条目 |
| `Filtered` | 当前的筛选结果 |
| `Missing Metadata` | 缺少 metadata 的条目 |
| `All` | 全部条目 |

## 本地缓存

图片探测结果缓存在浏览器 `IndexedDB` 中，缓存键为图片 URL。

普通探测命中缓存时不会重新读取图片。`Force Refresh` 会忽略缓存并重新探测。

## 导出

`Export Unity JSON` 输出 Unity 使用的图库配置文件。

导出的 JSON 可以继续被 WebTool 重新导入，也可以交给 `RemotePhotoManager` 执行 `Import JSON Into Gallery`。


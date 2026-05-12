---
title: WebTool
---
WebTool is a local static gallery manager. It maintains image URL data and exports gallery JSON that Unity can import.

## Data scope

WebTool manages complete gallery entries:

| Field | Purpose |
|---|---|
| `id` | Entry identifier |
| `url` | Image direct link |
| `orientation` | `Landscape` / `Portrait` classification |
| `tags` | Tags |
| `note` | Note |
| `metadata` | Image probe result |

Unity Bake only reads `url` and `orientation`. Other fields are used by WebTool.

## Import

WebTool supports three data entry points:

| Entry | Content |
|---|---|
| `Import JSON` | Reads existing gallery JSON |
| `Import URL TXT` | Reads a text file with one URL per line |
| `Bulk URL Import` | Pastes multiple lines of URLs |

`Default Orientation` is used as the initial orientation during batch import.

## Edit

The table provides entry-level editing:

| Item | Content |
|---|---|
| URL | Image address |
| Orientation | Landscape / Portrait classification |
| Tags | Tag text |
| Note | Note text |
| Metadata | Probe status and size information |

`Add Blank Entry` is used to create an empty entry.

## Filter and pagination

| Control | Effect |
|---|---|
| `Search` | Searches URL, ID, tags, and notes |
| `Orientation` | Filters by Landscape / Portrait |
| `Metadata` | Filters by probe status |
| `Page Size` | Sets the number of items shown per page |

Top statistics show total count, Landscape count, Portrait count, invalid URL count, selected count, and Metadata OK count.

## Batch operations

| Operation | Result |
| -------------------------- | -------------------- |
| `Select Page` | Selects the current page |
| `Select Filtered` | Selects the current filtered result |
| `Clear Selection` | Clears selection |
| `Set Selected Landscape` | Marks selected entries as `Landscape` |
| `Set Selected Portrait` | Marks selected entries as `Portrait` |
| `Generate IDs` | Generates IDs from URL filenames |
| `Remove Duplicate URLs` | Deletes duplicate URLs |
| `Delete Selected` | Deletes selected entries |
| `Add Tag To Selected` | Adds a tag to selected entries |
| `Remove Tag From Selected` | Removes a tag from selected entries |

## Image size probing

`Probe Image Sizes` makes the browser load images and read width and height.

After probing succeeds, `metadata` records size and status. When `Apply Detected Orientation` is enabled, the tool writes orientation based on width and height:
width>=height    `Landscape`
height>width    `Portrait`


`Probe Scope` controls the probe range:

| Scope | Content |
| ------------------ | --------------- |
| `Selected` | Selected entries |
| `Filtered` | Current filtered result |
| `Missing Metadata` | Entries missing metadata |
| `All` | All entries |

## Local cache

Image probe results are cached in browser `IndexedDB`, with image URL as the cache key.

Normal probes do not read images again when they hit cache. `Force Refresh` ignores cache and probes again.

## Export

`Export Unity JSON` outputs the gallery config file used by Unity.

The exported JSON can be re-imported by WebTool, or handed to `RemotePhotoManager` to execute `Import JSON Into Gallery`.


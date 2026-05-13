---
title: 自托管图片方案
---
## 为什么使用自托管图片

有很多方法可以获得**图片直链**。最常见的是**图片托管服务平台**。它很方便，有成熟的 app，你给它图片，它就会给你一个 URL。但它们可能会审核你的图片，可能会泄露你的图片，也可能会未经允许移除你的图片。原因是使用这种托管方式时，你并没有对自己的图片拥有更大的控制权。使用知名云服务商提供的云存储，例如 **Cloudflare R2、AWS S3**，并自己搭建图片托管服务，你可以获得从服务器到客户端的**全链路控制权**。对于 VRC 相册来说，它们的**免费套餐**已经足够使用。

接下来我只介绍 **CloudFlareR2**，这也是我自己使用的方案。

## 1. 域名与 R2 访问方式

对于这个方案，最好有一个**自己的域名**。最直接的好处是图片加载会变得**稳定和快速**，一些网络受限地区的玩家也可能有机会看到你的图片。当然，使用 R2 提供的开发测试域名，也可以让 **RemotePhotoSystem** 方案成功运行。

CloudFlare 关于公开 **R2 buckets** 的文档解释了**自定义域名**的好处：
https://developers.cloudflare.com/r2/buckets/public-buckets/

| 对比项 | `r2.dev` 测试域名 | 自定义域名 |
| ----- | ---------------------------------------------------------- | -------------------------------------- |
| 定位 | 开发 / 测试环境 | 正式生产环境 |
| 域名 | 随机分配的乱码域名 | 类似 `example.com` 这种常见网站形式的域名 |
| 限流 | 有 rate limit，超出后可能被临时 throttled，并可能返回 `429 Too Many Requests` | 这条限流规则不适用。自定义域名使用 CloudFlare 套餐提供的优质服务 |
| 缓存 | 不支持 | 支持 Cloudflare Cache 加速 R2 访问 |
| CDN加速 | 不支持 | 支持 CDN 加速和全球访问 |
| 安全 | 很弱，无法自定义 | 使用 CloudFlare 的 DDoS 防御、防滥用、AI 爬虫控制等多种安全措施 |

获取域名时，你可以直接在 **CloudFlare** 购买，也可以从其他域名服务商购买。我的案例中，我从 **NameSilo** 用 $1.88 购买了一年 .top 域名。续费这个域名每年需要 $4.88。

![image-01](../../../assets/images/Pasted%20image%2020260512034510.png)

当你有了域名后，跟随 **CloudFlare add domain** 指引将你的域名连接到 CF，然后让 CF 完全接管你的域名 **DNS**，并配置安全防御开关。不用担心，CloudFlare 会给你推荐设置。

如果你在购买域名或把域名绑定到 CloudFlare 时遇到阻碍，可以在视频网站搜索相关教程。这类操作有很多成熟教程，或者你也可以查看 CloudFlare 和域名服务商的帮助文档，或者询问 AI。

这里有一份给熟悉流程的开发者阅读的简短指引：https://imageport.app/en/docs/for-cloudflare-r2

![image-02](../../../assets/images/Pasted%20image%2020260512035732.png)

![image-03](../../../assets/images/Pasted%20image%2020260512040102.png)

## 2. 创建 R2 Bucket

现在终于到了 R2 阶段。在 CloudFlare 侧边栏找到 **R2 Object Storage**，点击 **Create Bucket**

给这个 bucket 起一个名字。检查 **Location** 是否是你的 VRC 世界主要玩家所在的区域。如果不是，你可以手动指定。确保 **Default Storage Class** 使用 **Standard**，然后点击 **Create bucket**。

![image-04](../../../assets/images/Pasted%20image%2020260512041210.png)

## 3. 绑定自定义域名或启用 r2.dev

恭喜，你已经创建了一个 **R2 Bucket**，但先不要急着上传图片。点击 **Settings**。如果你购买并绑定了自己的域名，点击 **Custom Domains** 下的 **Add** 按钮，跟随 CF 的指引为这个 R2 Bucket 分配域名。如果你的域名不只是打算用于 VRC 相册，或者你也想为未来开发留下空间，请为 R2 分配一个**子域名**。

- Subdomain: xxxx.your-domian.com
- Root domain: your-domian.com

![image-05](../../../assets/images/Pasted%20image%2020260512042038.png)

你只需要在 **Add** 框中给 R2 一个子域名。如图所示，在前面加上 **photos** 就可以被识别为子域名。点击 **Continue** 后，在确认界面点击 **Connect domain**，等待一会儿，现在你应该可以用你的域名访问 R2 了。

如果你想先使用 R2 的开发测试域名，需要点击 **Public Development URL** 后面的 **Enable**。窗口会弹出并询问你。在输入框中输入 **allow**，然后点击 **Allow** 按钮。这时你应该会得到一个 **.r2.dev domain**。

## 4. 图片管理方案

接下来是上传图片。但在上传图片之前，我们需要知道，R2 bucket 的图片管理窗口就像下图一样，是一个**纯目录结构**。它缺少**图片可视化操作界面**。为了流畅地管理图片操作，我推荐：

![image-06](../../../assets/images/Pasted%20image%2020260512043123.png)

> **S3 Image Port** ——A dashboard to manage your images in S3 buckets. 

https://github.com/yy4382/s3-image-port

![image-07](../../../assets/images/Pasted%20image%2020260512043929.png)

**S3 Image Port** 可以提供这样直观的操作界面，并且直接连接 R2。你可以在 S3 Image Port 中上传/删除图片，它也支持在上传前**压缩图片**，节省存储空间并帮助网络传输。另外，你**不需要下载任何程序**。这是一个**静态前端应用**。访问 https://imageport.app/ 就可以直接使用。你的 R2 凭据会保存在**浏览器本地**，或者你可以启用加密同步到远程 Redis 服务。S3 Image Port 本身**不存储图片、不分发图片，并且完全没有后端**。

截至这篇文档完成时，S3 Image Port 还没有加入**批量复制 URLs 功能**。为了方便连接 **RPS web tool**，你可以考虑使用我的分支 https://github.com/thok404/s3-image-port/tree/feature/gallery-bulk-actions   **==这个分支没有配置文件同步功能==**

**可直接使用的网页应用：** https://imageport.thok.top/

你可以阅读简洁的 S3 Image Port 官方指引： https://imageport.app/en/docs/for-cloudflare-r2

> **重要勘误：** API Token 权限需要选择 **Admin Read & Write**，不是 **Object Read & Write**。

也可以阅读下面的图文教程
## 5. 配置 R2 CORS

![image-08](../../../assets/images/Pasted%20image%2020260512053314.png)
首先，允许 R2 被 S3 Image Port 访问。回到 **R2 Settings** 页面，找到 **CORS Policy**，点击 **Add**，删除弹出代码框中的所有内容，并替换为：

```
[
  {
    "AllowedOrigins": ["https://imageport.thok.top"],
    "AllowedMethods": ["GET", "PUT", "DELETE", "HEAD", "POST"],
    "AllowedHeaders": ["*"]
  }
]
```

然后点击 **Save**。这样你的 R2 就可以接受来自 **imageport.thok.top** 的请求。如果你使用原项目的 main branch，请使用下面的代码。

```
[
  {
    "AllowedOrigins": ["https://imageport.app"],
    "AllowedMethods": ["GET", "PUT", "DELETE", "HEAD", "POST"],
    "AllowedHeaders": ["*"]
  }
]
```



## 6. 创建 R2 API Token

![image-09](../../../assets/images/Pasted%20image%2020260512054851.png)
回到 R2 的 **Overview** 面板，找到 **Account Details → API Tokens → Manage**，根据你的需要选择 Account/User token。这个案例演示点击 **Create Account API token**。

![](../../../assets/images/Pasted%20image%2020260513183516.png)

给它一个 **Token name**。Premissions 选择 **Admin Read & Write**。TTL 根据你的偏好设置。这个案例使用 **Forever**。Client IP Address Filtering 留空，然后点击 **Create Account/User API Token**


> 在你完成 S3 Image Port 配置或记下所有 Keys 之前，不要关闭这个页面

![image-11](../../../assets/images/Pasted%20image%2020260512060331.png)

For security reasons, these token values will not be shown again. [Learn more about API token generation](https://developers.cloudflare.com/r2/api/s3/tokens/)

## 7. 连接 S3 Image Port

接下来，进入 S3 Image Port 的 **Settings → S3** 页面

![image-12](../../../assets/images/341830310738fe6eb788056066702e83.png)

- **Endpoint**: 填入刚刚 API Token 页面中的 Use jurisdiction-specific endpoints for S3 clients 链接
- **Bucket Name**: your-bucket-name
- **Region**: R2 Bucket → Settings → General → Location   或者使用默认值 auto

![image-13](../../../assets/images/Pasted%20image%2020260512061131.png)

- **Access Key**: API Token 页面上的 Access Key ID
- **Secret Key**: API Token 页面上的 Secret Access Key
- **Public URL**: 连接到 R2 的 Custom Domain 或 Public Development URL。注意它必须以 https:// 开头

然后点击 **Test** 按钮。如果出现 **Valid**，配置就完成了

**S3 Image Port 和 R2 终于绑定完成**

现在你可以切换到 **Profiles** 页面，点击 **Rename**，给这个配置文件一个新的名字

![image-14](../../../assets/images/Pasted%20image%2020260512063206.png)

如果你想切换 S3 Image Port 分支，或者使用其他浏览器设备，你不需要重复上面的绑定步骤。只需要点击 **Export**，将一个 JSON 导出到剪贴板，把它保存在你喜欢的文档里。下次只要把这个 JSON 复制到剪贴板，然后点击 Profiles 页面右上角的 **Import Profile**。

![image-15](../../../assets/images/Pasted%20image%2020260512063732.png)

## 8. 上传图片并复制 URLs

**Settings Upload page** 定义了一些上传图片时的行为。我的 **Default Key template** 只填写了 **{{filename}}**，这意味着上传图片的默认命名模板只包含文件名。换句话说，上传后的图片名和本地图片名相同。这个解释有点啰嗦，但如果你上传几张图片并看一下路径，就会明白。上面的 docs 链接解释了每个 Key 的用法

**Image convertion and compression** 可以转换格式并压缩图片。对于网络图片传输需求（**VRC RemotePhotoSystem**），建议使用 **JPEG format and compression**

点击导航中的 **Upload**，上传几张图片，回到 **Gallery** 并稍微刷新一下，你应该就能看到 R2 中的图片出现在眼前。

接下来你可以凭直觉操作。左上角有一个**全选按钮**。选择图片后，会出现取消全部选择、复制所选 URLs、删除所选图片（这会删除 R2 Bucket 中的图片）。左下角可以切换每页显示 20、50 或 100 张图片。双击图片可以进入单图查看。

**全选 + 复制所选 URLs 功能**可以让你快速连接到 [RemotePhotoSystemWebtool](webtool.md)，这也是我们使用它的原因。

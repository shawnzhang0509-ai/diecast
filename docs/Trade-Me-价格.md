# Trade Me 价格怎么快速同步

## 结论

| 方式 | 速度 | 说明 |
|------|------|------|
| **官方 API + `npm run sync:trademe`** | 最快（自动化） | 要一次 OAuth 配置 |
| 手改 `trademe-links.json` 里的 `price` | 慢 | 适合只有几个 SKU |
| 爬网页 | 不推荐 | 易挂、可能违规 |

独立站**稳定 id**（`r2-06`）不变；Trade Me **listing id / 价格** 用 `trademe-product-map.json` + API 刷新。

---

## 一次性：Trade Me Developer

1. 打开 [developer.trademe.co.nz](https://developer.trademe.co.nz) 注册应用  
2. 用**你老婆的卖家账号**做 OAuth，拿到 4 个值：  
   - Consumer Key / Consumer Secret  
   - Access Token / Access Token Secret  
3. 写入 `.env.local`：

```env
TRADEME_CONSUMER_KEY=...
TRADEME_CONSUMER_SECRET=...
TRADEME_ACCESS_TOKEN=...
TRADEME_ACCESS_TOKEN_SECRET=...
TRADEME_MEMBER_LISTING=5600782
```

> 2026 年起 Marketplace API 新申请可能限 **in-trade** 卖家；若申请不过，只能手改价格。

---

## 绑定商品（每个 SKU 一次）

`trademe-product-map.json`：

```json
{
  "r2-06": { "listingId": 1234567890 },
  "r2-07": { "listingId": 9876543210 }
}
```

`listingId` = 链接里 `/listing/` 后面的数字。  
**Relist 后只改这里的 `listingId`。**

---

## 拉价格

```bash
npm run sync:trademe
```

会更新 `public/trademe-links.json` 里的 **price**、**sold**、**listingId**。

网站要读这个文件，在 Vercel / `.env` 设：

```env
VITE_TRADEME_LINKS=true
```

然后 push 部署。

---

## 日常

1. R2 新图 → `npm run sync:r2`  
2. Trade Me 上新 / relist → 改 `trademe-product-map.json` 的 listingId（如有变）  
3. `npm run sync:trademe` → push  
4. 或定时（如 GitHub Action 每天跑一次 sync:trademe）

---

## 自动对标题（未做）

Trade Me 标题和 R2 文件夹名往往不一致，**不会**自动猜哪条 listing 对应哪个 `r2-xx`。  
用 `trademe-product-map.json` 手动绑一次最稳。

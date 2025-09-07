# 🌱 迷你 Grow Cube

一個用 **React + TypeScript** 製作的小型互動遊戲，靈感來自經典的 **Grow Cube**。  
玩家可以選擇不同元素（水、火、樹、人）放到方塊上，觸發動畫與互動效果。

---

## 🎮 遊戲玩法
- 點擊下方按鈕選擇元素：
  - 💧 水
  - 🔥 火
  - 🌳 樹
  - 👌 人
- 每個元素會觸發不同的動畫變化。
- 四種元素皆被放置後，遊戲進入結束狀態，可按下 **Reset** 重新開始。

---

## 🖼️ 畫面截圖
> （建議放一張 `assets/demo.png` 或遊戲畫面 GIF）

---

## 🛠️ 技術棧
- **React** + **TypeScript**
- **CSS 模組化**（簡單樣式）
- **狀態管理**：React Hooks (`useState`, `useEffect`, `useRef`)

---

## 📂 專案結構
```
.
├── App.tsx              # 主程式與遊戲邏輯
├── models/
│   ├── Cube.ts          # 遊戲方塊核心邏輯
│   └── CubeElement.ts   # 元素相關設定
├── public/assets/       # 遊戲素材（圖片）
└── styles.css           # 樣式
```

---

## ⚙️ 安裝與執行

```bash
# Clone 專案
git clone https://github.com/your-username/grow-cube-mini.git
cd grow-cube-mini

# 安裝依賴
npm install

# 啟動開發伺服器
npm run start
```

然後打開 [http://localhost:3000](http://localhost:3000) 開始遊玩 🎉

---

## 🚀 未來規劃
- [ ] 增加更多互動元素
- [ ] 完善動畫效果
- [ ] 加入音效

---

## 🤝 貢獻
歡迎提出 **Issue** 或 **Pull Request**！  

---

## 📜 授權
本專案使用 [MIT License](LICENSE) 授權。

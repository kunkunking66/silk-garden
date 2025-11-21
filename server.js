import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Replicate from 'replicate';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProxyAgent } from 'undici';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors()); // 允許所有跨域請求
app.use(express.json({ limit: '50mb' })); // 允許大圖片傳輸

// 🔥🔥🔥 環境與代理配置 🔥🔥🔥
const isProduction = process.env.NODE_ENV === 'production';

let dispatcher = undefined;
if (!isProduction) {
    // 本地模式：使用環境變量中的代理，或者默認 7897
    const PROXY_URL = process.env.HTTPS_PROXY || 'http://127.0.0.1:7897';
    console.log(`🔧 本地開發模式：啟用代理 ${PROXY_URL}`);
    dispatcher = new ProxyAgent(PROXY_URL);
} else {
    console.log(`☁️ 生產環境模式 (Render)：直接連接互聯網`);
}

// 初始化 Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  fetch: (url, init) => {
    // 雲端時 dispatcher 為 undefined，fetch 會自動直連
    return fetch(url, { ...init, dispatcher: dispatcher });
  }
});

// 配置上傳目錄：雲端只能寫入 /tmp，本地寫入 uploads
const uploadDir = isProduction ? '/tmp' : 'uploads';
if (!fs.existsSync(uploadDir) && !isProduction) {
  fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: uploadDir });

// --- API 路由 ---
app.post('/api/try-on', upload.fields([{ name: 'human_img' }, { name: 'garm_img' }]), async (req, res) => {
  try {
    console.log('----------------------------------------------------');
    console.log(`🕒 收到請求 [${new Date().toLocaleTimeString()}]`);
    
    const productPrompt = req.body.prompt || "clothes";
    const category = req.body.category || "upper_body";
    
    // 1. 讀取用戶圖片
    if (!req.files['human_img']) return res.status(400).json({ error: "缺少模特圖片" });
    const humanPath = req.files['human_img'][0].path;
    const humanImg = `data:image/jpeg;base64,${fs.readFileSync(humanPath).toString('base64')}`;

    // 2. 讀取商品圖片 (文件 或 URL)
    let garmImg = "";
    if (req.files['garm_img']) {
      const garmPath = req.files['garm_img'][0].path;
      garmImg = `data:image/jpeg;base64,${fs.readFileSync(garmPath).toString('base64')}`;
      try { fs.unlinkSync(garmPath); } catch(e) {}
    } else if (req.body.garm_img_url) {
      console.log(`🔗 下載商品圖 URL...`);
      // 下載圖片時，本地走代理，雲端直連
      const fetchOpts = isProduction ? {} : { dispatcher };
      const imgResp = await fetch(req.body.garm_img_url, fetchOpts);
      if (!imgResp.ok) throw new Error("無法下載商品圖片");
      const buffer = await imgResp.arrayBuffer();
      garmImg = `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`;
    }

    console.log('🚀 調用 AI 模型...');

    // 3. 調用 Replicate
    const output = await replicate.run(
      "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
      {
        input: {
          human_img: humanImg,
          garm_img: garmImg,
          garment_des: productPrompt,
          category: category,
          crop: false,
          seed: 42,
          steps: 30
        }
      }
    );

    console.log('✅ AI 生成 URL:', output);
    
    // 4. 下載結果圖並轉為 Base64 (解決前端顯示問題)
    console.log('⬇️ 轉換結果圖為 Base64...');
    const resultUrl = String(output);
    const resultFetchOpts = isProduction ? {} : { dispatcher };
    const resultResp = await fetch(resultUrl, resultFetchOpts);
    
    if (!resultResp.ok) throw new Error("無法下載結果圖片");
    
    const resultBuffer = await resultResp.arrayBuffer();
    const base64Result = `data:image/png;base64,${Buffer.from(resultBuffer).toString('base64')}`;
    
    // 清理臨時文件
    try { fs.unlinkSync(humanPath); } catch(e) {}

    res.json({ resultUrl: base64Result });

  } catch (error) {
    console.error('❌ 錯誤:', error.message);
    res.status(500).json({ error: error.message || "後端處理失敗" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ 服務器運行在端口 ${PORT}`));
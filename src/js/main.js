import '@/assets/css/style.css'

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// 引入 Lenis 套件
import Lenis from "lenis";

// 初始化 Lenis，設置滾動效果
const lenis = new Lenis({
  easing: (t) => t, // 緩動函數，調整滾動的感覺
  smoothWheel: true, // 啟用平滑滾動
  smoothTouch: false, // 禁用觸控設備的平滑滾動
  direction: 'vertical', // 垂直滾動
});

let split = new SplitText('h1', { type: 'lines' }); // 使用 SplitText 將 h1 拆分成多行
let masks = []; // 用來儲存每行文字對應的遮罩元素

// 定義主要動畫效果
function makeItHappen() {
  masks = []; // 清空遮罩陣列（避免重複）

  // 遍歷每一行文字
  split.lines.forEach((line) => {
    // 為每行文字建立一個遮罩元素 <span class="mask">
    const mask = document.createElement('span');
    mask.className = 'mask';
    line.style.position = 'relative'; // 讓遮罩相對定位於文字行
    line.append(mask); // 將遮罩加到文字行中
    masks.push(mask); // 收集到遮罩陣列

    // 設定每個遮罩的滾動動畫
    gsap.to(mask, {
      scaleX: 0, // 從原始寬度縮放到 0
      transformOrigin: 'right center', // 從右邊開始縮放
      ease: 'none', // 無緩動
      scrollTrigger: {
        trigger: line,         // 每行為觸發區域
        scrub: true,           // 平滑地跟隨滾動條進度
        start: 'top center',   // 當每行頂部碰到視窗中央時觸發
        end: 'bottom center',  // 當每行底部碰到視窗中央時結束
      },
    });
  });
}

// 在視窗尺寸變動時重新執行動畫初始化
window.addEventListener('resize', newTriggers);

function newTriggers() {
  // 移除所有現有的 ScrollTrigger 動畫
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  // 移除所有遮罩元素
  masks.forEach((mask) => mask.remove());

  // 還原 SplitText 對 DOM 所做的處理
  if (split?.revert) split.revert();

  // 重新分割文字
  split = new SplitText('h1', { type: 'lines' });

  // 重新套用動畫效果
  makeItHappen();
}

// 頁面加載完成後立即初始化動畫
makeItHappen();

// 使用 requestAnimationFrame 與 Lenis 更新滾動動畫與 ScrollTrigger
function raf(time) {
  lenis.raf(time);           // Lenis 處理自定義滾動邏輯
  ScrollTrigger.update();    // 更新 ScrollTrigger 狀態
  requestAnimationFrame(raf); // 持續循環呼叫 raf
}

requestAnimationFrame(raf); // 啟動動畫循環
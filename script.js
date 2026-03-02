// script.js

// 1. 資料庫：多國語言設定 (文字內容 + 語音代碼)
const languages = {
    'zh-TW': { text: "你好，世界！", langCode: "zh-TW" },
    'en-US': { text: "Hello, World!", langCode: "en-US" },
    'ja-JP': { text: "こんにちは、世界！", langCode: "ja-JP" },
    'fr-FR': { text: "Bonjour le monde!", langCode: "fr-FR" },
    'es-ES': { text: "¡Hola Mundo!", langCode: "es-ES" },
    'code':  { text: 'print("Hello World")', langCode: "en-US" }
};

// 2. DOM 元素選取
const select = document.getElementById('language-select');
const greetingElement = document.getElementById('greeting-text');
const btnSpeak = document.getElementById('btn-speak');
const btnCopy = document.getElementById('btn-copy');
const toast = document.getElementById('toast');

let currentLang = 'zh-TW';
let typeWriterTimeout;

// 3. 核心功能：打字機特效
function typeWriter(text, index = 0) {
    if (index === 0) {
        greetingElement.textContent = ''; // 清空
    }

    if (index < text.length) {
        greetingElement.textContent += text.charAt(index);
        // 隨機打字速度，模擬真實感
        const speed = Math.random() * 100 + 50; 
        typeWriterTimeout = setTimeout(() => typeWriter(text, index + 1), speed);
    }
}

// 4. 核心功能：更新畫面
function updateGreeting() {
    clearTimeout(typeWriterTimeout); // 停止舊的打字動畫
    currentLang = select.value;
    const data = languages[currentLang];
    
    // 啟動打字效果
    typeWriter(data.text);
}

// 5. 核心功能：語音朗讀 (使用瀏覽器原生 Web Speech API)
function speakText() {
    const data = languages[currentLang];
    
    // 檢查瀏覽器支援
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.text);
        utterance.lang = data.langCode; // 設定發音語系
        utterance.rate = 0.9; // 稍微放慢語速比較可愛
        utterance.pitch = 1.1; // 稍微調高音調比較活潑
        window.speechSynthesis.cancel(); // 停止目前正在說的話
        window.speechSynthesis.speak(utterance);
    } else {
        alert("您的瀏覽器不支援語音功能 😢");
    }
}

// 6. 核心功能：複製到剪貼簿
async function copyText() {
    const text = greetingElement.textContent;
    try {
        await navigator.clipboard.writeText(text);
        showToast();
    } catch (err) {
        console.error('複製失敗:', err);
    }
}

// 顯示提示訊息
function showToast() {
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2000);
}

// 7. 事件監聽 (Event Listeners)
select.addEventListener('change', updateGreeting);
btnSpeak.addEventListener('click', () => {
    // 按鈕點擊動畫效果 (Scale)
    btnSpeak.style.transform = 'scale(0.95)';
    setTimeout(() => btnSpeak.style.transform = 'scale(1)', 100);
    speakText();
});
btnCopy.addEventListener('click', copyText);

// 初始化：載入時執行一次
window.onload = updateGreeting;
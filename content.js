// content.js
(function() {
    'use strict';

    // 1. 取得 URL 中的 prompt 參數
    const params = new URLSearchParams(window.location.search);
    const promptText = params.get('prompt') || params.get('q'); // 支援 ?prompt= 或 ?q=

    // 如果沒有 prompt 參數，就什麼都不做
    if (!promptText) return;

    // 2. 定義尋找並填入輸入框的函式
    function fillGeminiInput() {
        // Gemini 的輸入框通常是一個 contenteditable 的 div
        const inputBox = document.querySelector('div[contenteditable="true"][role="textbox"]');
        
        if (inputBox) {
            // 確保輸入框已準備好
            inputBox.focus();

            // 填入文字
            inputBox.textContent = promptText; 
            
            // 觸發 'input' 事件，讓 Gemini 的底層框架知道輸入框有內容了
            inputBox.dispatchEvent(new Event('input', { bubbles: true }));
            
            console.log('Gemini Prompt Prefill: 成功填入文字');

            // 給予框架一點時間更新狀態，然後模擬按下 Enter 鍵
            setTimeout(() => {
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true
                });
                inputBox.dispatchEvent(enterEvent);
                console.log('Gemini Prompt Prefill: 自動按下 Enter 送出');

                // 移除 URL 中的 prompt 或 q 參數，保持網址列乾淨
                const url = new URL(window.location);
                url.searchParams.delete('prompt');
                url.searchParams.delete('q');
                window.history.replaceState({}, document.title, url.toString());
                console.log('Gemini Prompt Prefill: 已清除 URL 參數');

            }, 150); // 150 毫秒的延遲

            return true; // 成功
        }
        return false; // 尚未找到
    }

    // 3. 嘗試執行 (輪詢)
    let attempts = 0;
    const maxAttempts = 20; // 最多嘗試 10 秒 (20 * 500ms)
    
    const intervalId = setInterval(() => {
        attempts++;
        const success = fillGeminiInput();
        
        if (success || attempts >= maxAttempts) {
            clearInterval(intervalId);
        }
    }, 500);

})();

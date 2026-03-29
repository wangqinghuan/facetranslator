class MirrorTranslator {
    constructor() {
        this.chineseRecognition = null;
        this.englishRecognition = null;
        
        this.chineseMicBtn = document.getElementById('chinese-mic');
        this.englishMicBtn = document.getElementById('english-mic');
        this.chineseText = document.getElementById('chinese-text');
        this.englishText = document.getElementById('english-text');
        this.chineseStatus = document.getElementById('chinese-status');
        this.englishStatus = document.getElementById('english-status');
        
        this.init();
    }
    
    init() {
        this.initSpeechRecognition();
        this.initEventListeners();
    }
    
    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            this.showError('您的浏览器不支持语音识别，请使用 Chrome/Edge 浏览器');
            return;
        }
        
        this.chineseRecognition = new SpeechRecognition();
        this.chineseRecognition.lang = 'zh-CN';
        this.chineseRecognition.continuous = false;
        this.chineseRecognition.interimResults = true;
        
        this.englishRecognition = new SpeechRecognition();
        this.englishRecognition.lang = 'en-US';
        this.englishRecognition.continuous = false;
        this.englishRecognition.interimResults = true;
        
        this.setupRecognition(this.chineseRecognition, 'chinese');
        this.setupRecognition(this.englishRecognition, 'english');
    }
    
    setupRecognition(recognition, type) {
        recognition.onstart = () => {
            this.updateStatus(type, '正在聆听...');
            this.toggleMicButton(type, true);
        };
        
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            
            if (event.results[0].isFinal) {
                this.processSpeech(type, transcript);
            }
        };
        
        recognition.onerror = (event) => {
            this.updateStatus(type, '识别错误: ' + event.error);
            this.toggleMicButton(type, false);
        };
        
        recognition.onend = () => {
            this.toggleMicButton(type, false);
        };
    }
    
    processSpeech(type, text) {
        const targetLang = type === 'chinese' ? 'en' : 'zh';
        
        this.updateStatus(type, '翻译中...');
        
        this.translate(text, targetLang)
            .then(translatedText => {
                if (type === 'chinese') {
                    this.englishText.innerHTML = translatedText;
                } else {
                    this.chineseText.innerHTML = translatedText;
                }
                this.updateStatus(type, '翻译完成');
            })
            .catch(error => {
                this.updateStatus(type, '翻译失败: ' + error.message);
            });
    }
    
    async translate(text, targetLang) {
        const sourceLang = targetLang === 'en' ? 'zh-CN' : 'en';
        const langPair = `${sourceLang}|${targetLang}`;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`翻译请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.responseStatus !== 200) {
            throw new Error(data.responseDetails || '翻译失败');
        }
        
        return data.responseData.translatedText;
    }
    
    toggleMicButton(type, isRecording) {
        const btn = type === 'chinese' ? this.chineseMicBtn : this.englishMicBtn;
        
        if (isRecording) {
            btn.classList.add('recording');
        } else {
            btn.classList.remove('recording');
        }
    }
    
    updateStatus(type, message) {
        const status = type === 'chinese' ? this.chineseStatus : this.englishStatus;
        status.textContent = message;
        
        setTimeout(() => {
            status.textContent = '';
        }, 3000);
    }
    
    showError(message) {
        console.error(message);
        this.chineseText.innerHTML = `<span style="font-size: 16px; opacity: 0.8;">${message}</span>`;
    }
    
    initEventListeners() {
        this.chineseMicBtn.addEventListener('click', () => {
            if (this.chineseRecognition) {
                try {
                    this.chineseRecognition.start();
                } catch (e) {
                    console.error(e);
                }
            }
        });
        
        this.englishMicBtn.addEventListener('click', () => {
            if (this.englishRecognition) {
                try {
                    this.englishRecognition.start();
                } catch (e) {
                    console.error(e);
                }
            }
        });
    }
    
}

document.addEventListener('DOMContentLoaded', () => {
    new MirrorTranslator();
});

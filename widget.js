(function() {
  const SYSTEM_PROMPT = "You are the personal AI assistant for Somya Bhalani\'s portfolio website. Answer questions concisely and professionally. \nContext:\nSomya Bhalani is an AI Solutions Architect and Intelligence Architect based in Gujarat, India (Vadodara), and the founder of Ananta Labs. He is pursuing a B.Tech in CS & Engineering (AI). His tagline is \'Architecting intelligence that reasons, perceives, and acts.\' Portfolio: https://somyabhalani-portfolio.vercel.app/. Studio: https://www.anantalabs.app. GitHub: https://github.com/somyabhalani. Contact: somyabhalani@gmail.com or hello@anantalabs.app.\nHe builds working, technically substantial AI systems. His work covers AI reasoning systems, computer vision, robotics, and forward deployed engineering. He prioritizes raw data extraction and hybrid retrieval over generic cloud wrappers.\nTechnical expertise:\n1. Forward deployed engineering\n2. Computer vision (byte-level, OpenCV pipelines)\n3. AI & LLMs (RAG, custom integration, embedding pipelines)\n4. Full-stack integration (React, Next.js, Node.js, AI widgets)\nProjects:\n1. Tile Extractor: PDF parsing utility for lossless image extraction using byte-level extraction. (https://tile-extractor-r3ce.onrender.com/)\n2. Cinehaul: Community-driven platform for discovering and tracking movies/TV series. (https://cinehaul.vercel.app/)\n3. Kiwi AI: RAG-based SaaS chatbot builder. (https://kiwi-ai-rho.vercel.app/)\n4. Ananta Memory: Privacy-first offline browser extension for saving reading history. (https://ananta-extension.vercel.app/)\n5. Solara: Offline-capable solar planning platform. (https://solara-dash.vercel.app/)\n6. SvaraTV: Live, ad-free streaming application. (https://svaratv.vercel.app)";

  // Inject CSS
  const style = document.createElement('style');
  style.innerHTML = `
    #ai-widget-fab {
        position: fixed;
        top: 24px;
        right: 24px;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background-image: url('./assets/icon.jpeg');
        background-size: cover;
        background-position: center;
        box-shadow: 
          0 8px 16px rgba(0,0,0,0.25),
          inset 0 2px 4px rgba(255,255,255,0.6),
          inset 0 -4px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        z-index: 9999;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        border: none;
      }
      #ai-widget-fab:hover {
        transform: scale(1.05) translateY(-4px);
        box-shadow: 
          0 12px 24px rgba(0,0,0,0.3),
          inset 0 2px 4px rgba(255,255,255,0.7),
          inset 0 -4px 8px rgba(0,0,0,0.4);
      }
      #ai-widget-fab:active {
        transform: scale(0.95);
        box-shadow: 
          0 4px 12px rgba(0,0,0,0.2),
          inset 0 4px 8px rgba(0,0,0,0.5);
        transition: all 0.1s;
      }
    #ai-widget-fab.hidden-start {
      transform: translateY(-100px) scale(0.5) rotateX(45deg);
      opacity: 0;
      pointer-events: none;
    }
    
    #ai-widget-window {
        position: fixed;
        top: 100px;
        right: 24px;
        width: 380px;
        height: 550px;
        max-height: calc(100vh - 130px);
        border-radius: 24px;
        box-shadow: 0 16px 40px rgba(0,0,0,0.25);
        z-index: 9998;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
        pointer-events: none;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        background: transparent;
      }
      #ai-widget-window::before {
        content: '';
        position: absolute;
        inset: -10px;
        background: url('./assets/card-bg.png') no-repeat center center;
        background-size: cover;
        filter: blur(2px);
        z-index: -1;
      }
    #ai-widget-window.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    
    #ai-widget-blur-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.15);
        z-index: 0;
    }

    #ai-widget-header {
      padding: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    
    #ai-widget-messages {
      flex: 1;
      padding: 16px 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      z-index: 1;
      scrollbar-width: none;
    }
    #ai-widget-messages::-webkit-scrollbar {
      display: none;
    }

    .ai-msg, .user-msg {
      max-width: 85%;
      padding: 12px 18px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 15px;
      line-height: 1.5;
      animation: msgPop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes msgPop {
      0% { opacity: 0; transform: translateY(10px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    .ai-msg {
      align-self: flex-start;
      background: rgba(0, 0, 0, 0.4);
      color: white;
      border-radius: 20px 20px 20px 4px;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .user-msg {
      align-self: flex-end;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%);
      color: white;
      border-radius: 20px 20px 4px 20px;
      backdrop-filter: blur(24px) saturate(1.5);
      -webkit-backdrop-filter: blur(24px) saturate(1.5);
      border: 1px solid rgba(255,255,255,0.2);
      box-shadow: 
        0 4px 16px rgba(0,0,0,0.1),
        inset 0 1px 1px rgba(255,255,255,0.4);
    }

    .loading-dots {
      display: flex;
      gap: 4px;
      padding: 6px 4px;
    }
    .loading-dots span {
      width: 6px;
      height: 6px;
      background: white;
      border-radius: 50%;
      animation: pulse 1s infinite ease-in-out;
    }
    .loading-dots span:nth-child(1) { animation-delay: 0s; }
    .loading-dots span:nth-child(2) { animation-delay: 0.15s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.3s; }
    
    @keyframes pulse {
      0%, 100% { transform: translateY(0); opacity: 0.5; }
      50% { transform: translateY(-4px); opacity: 1; }
    }

    #ai-widget-input-area {
      padding: 16px 24px 24px 24px;
      position: relative;
      z-index: 1;
    }
                    #ai-widget-input {
      width: 100%;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.4);
      border: none;
      border-radius: 30px;
      padding: 16px 54px 16px 24px;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 15px;
      letter-spacing: 0.3px;
      outline: none;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 
        0 8px 24px rgba(0, 0, 0, 0.3),
        inset 0 2px 2px rgba(255, 255, 255, 0.2),
        inset 0 -2px 4px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(24px) saturate(1.5);
      -webkit-backdrop-filter: blur(24px) saturate(1.5);
    }
    #ai-widget-input:focus {
      background: rgba(0, 0, 0, 0.5);
      box-shadow: 
        0 12px 32px rgba(0, 0, 0, 0.4),
        inset 0 2px 2px rgba(255, 255, 255, 0.3),
        inset 0 -2px 4px rgba(0, 0, 0, 0.6);
      transform: translateY(-2px);
    }
    #ai-widget-input::placeholder {
      color: rgba(255,255,255,0.7);
      transition: color 0.3s;
    }
    #ai-widget-input:focus::placeholder {
      color: rgba(255,255,255,0.6);
    }

            #ai-widget-send {
      position: absolute;
      right: 36px;
      top: 40px;
      transform: translateY(-50%);
      background: white;
      border: none;
      color: #000;
      cursor: pointer;
      opacity: 0.95;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      padding: 0;
    }
    #ai-widget-send svg {
      width: 14px;
      height: 14px;
      margin-top: -1px;
    }
    #ai-widget-send:hover {
      opacity: 1;
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }    }
  `;
  document.head.appendChild(style);

  // Inject HTML
  const container = document.createElement('div');
  container.innerHTML = `
    <div id="ai-widget-window">
      <div id="ai-widget-blur-overlay"></div>
      <div id="ai-widget-header">
        <div style="width: 32px; height: 32px; border-radius: 50%; background-image: url('./assets/icon.jpeg'); background-size: cover; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2);"></div>
      </div>
      <div id="ai-widget-messages">
        <div class="ai-msg">Hello! How can I help you today?</div>
      </div>
      <div id="ai-widget-input-area">
        <input type="text" id="ai-widget-input" placeholder="Message..." autocomplete="off">
        <button id="ai-widget-send">
          <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 5.41V21a1 1 0 0 1-2 0V5.41l-6.29 6.3a1 1 0 0 1-1.42-1.42l8-8a1 1 0 0 1 1.42 0l8 8a1 1 0 0 1-1.42 1.42L13 5.41z"/>
            </svg>
        </button>
      </div>
    </div>
    <div id="ai-widget-fab" class="hidden-start"></div>
  `;
  document.body.appendChild(container);

  // Logic
  const fab = document.getElementById('ai-widget-fab');
  const win = document.getElementById('ai-widget-window');
  const input = document.getElementById('ai-widget-input');
  const sendBtn = document.getElementById('ai-widget-send');
  const messagesWrap = document.getElementById('ai-widget-messages');

  let isOpen = false;
  let chatHistory = [];

  setTimeout(() => {
    fab.classList.remove('hidden-start');
  }, 2000);

  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen = !isOpen;
    if(isOpen) {
      win.classList.add('open');
      setTimeout(() => input.focus(), 100);
    } else {
      win.classList.remove('open');
      input.blur();
    }
  });

  document.addEventListener('click', (e) => {
    if (isOpen && !win.contains(e.target) && !fab.contains(e.target)) {
      isOpen = false;
      win.classList.remove('open');
      input.blur();
    }
  });
  
  async function doApiRequest(loadingId) {
    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...chatHistory.map(msg => {
          if (msg.parts) return { role: msg.role === 'model' ? 'assistant' : msg.role, content: '[Voice Message - Not supported by text model]' };
          return msg;
        })
      ];

              const response = await fetch('https://portfolio-widget-pnvj.onrender.com/api/chat', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            messages: messages
          })
        });
      
      const data = await response.json();
      
      if (!response.ok || !data.choices) {
        chatHistory.pop();
        throw new Error(data.error?.message || "Unknown API Error");
      }
      
      const reply = data.choices[0].message.content;
      chatHistory.push({ role: 'assistant', content: reply });
      
      const loadingEl = document.getElementById(loadingId);
      if(loadingEl) {
        loadingEl.textContent = reply; 
        loadingEl.removeAttribute('id');
      } else {
        addMessage(reply, 'ai-msg');
      }
    } catch(err) {
      console.error(err);
      const loadingEl = document.getElementById(loadingId);
      if(loadingEl) {
        loadingEl.textContent = "Error: " + err.message;
        loadingEl.style.opacity = '0.7';
        loadingEl.removeAttribute('id');
      }
    }
  }

  async function sendMessage() {
    const text = input.value.trim();
    if(!text) return;

    // Add user msg
    addMessage(text, 'user-msg');
    input.value = '';
    
    // Add loading indicator
    const loadingId = 'loading-' + Date.now();
    const loadingHtml = '<div class="loading-dots"><span></span><span></span><span></span></div>';
    addMessage(loadingHtml, 'ai-msg', loadingId);

    // Prepare history for Gemini
    chatHistory.push({ role: 'user', content: text });
    
    await doApiRequest(loadingId);
  }

  function addMessage(content, className, id = null) {
    const div = document.createElement('div');
    div.className = className;
    if(id) div.id = id;
    div.innerHTML = content;
    messagesWrap.appendChild(div);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') sendMessage();
  });

})();


























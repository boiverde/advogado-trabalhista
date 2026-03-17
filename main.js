// START CONFIG INJECTION (DEMO CUSTOMIZATION)
function applyDynamicConfig() {
  const confRaw = localStorage.getItem('lawyer_template_config');
  if (!confRaw) {
     window.WHATSAPP_NUMBER_OVERRIDE = null;
     return; // Use default hardcoded
  }
  
  try {
    const c = JSON.parse(confRaw);
    
    function replaceText(selector, text) {
      if(!text) return;
      document.querySelectorAll(selector).forEach(el => {
         // Keep text or simple HTML tags
         el.innerHTML = text; 
      });
    }
    
    // 1. Branding
    replaceText('.logo strong, footer .footer-links p:first-child strong', c.lawFirmName);
    replaceText('.logo span', c.lawFirmSubtitle);
    replaceText('.profile-info h2', c.lawyerName);
    
    if(c.lawyerImage) {
      document.querySelectorAll('.lawyer-photo').forEach(el => el.setAttribute('src', c.lawyerImage));
    }
    
    // 2. Contact overrides
    if(c.whatsappNumber) {
       window.WHATSAPP_NUMBER_OVERRIDE = c.whatsappNumber; 
    }
    if(c.contactEmail) {
       document.querySelectorAll('footer').forEach(el => {
           el.innerHTML = el.innerHTML.replace(/seu@email\.com\.br/g, c.contactEmail).replace(/your@email\.com/g, c.contactEmail);
       });
    }
    
    if(c.ctaMain) {
      document.querySelectorAll('.btn-cta:not(#chat-finish-btn):not(.floating-wpp)').forEach(el => {
        const svg = el.querySelector('svg');
        el.innerHTML = '';
        if(svg) el.appendChild(svg);
        el.appendChild(document.createTextNode(' ' + c.ctaMain));
      });
    }
    replaceText('.btn-primary', c.ctaSecondary);
    
    // 3. Hero
    replaceText('.hero-badge', c.heroBadge);
    replaceText('.hero h1', c.heroHeadline);
    replaceText('.subheadline', c.heroSubheadline);
    replaceText('.urgency-warning', c.heroUrgency);
    
    // 4. Social Proof
    const authNums = document.querySelectorAll('.authority-text');
    const authLbls = document.querySelectorAll('.authority-label');
    if(authNums.length >= 3 && authLbls.length >= 3) {
        if(c.stat1Value) authNums[0].innerHTML = c.stat1Value;
        if(c.stat1Label) authLbls[0].innerHTML = c.stat1Label;
        if(c.stat2Value) authNums[1].innerHTML = c.stat2Value;
        if(c.stat2Label) authLbls[1].innerHTML = c.stat2Label;
        if(c.stat3Value) authNums[2].innerHTML = c.stat3Value;
        if(c.stat3Label) authLbls[2].innerHTML = c.stat3Label;
    }
    
    // 5. Case Result Override (First item)
    if(c.caseTitle) {
        const case1 = document.querySelector('.case-card');
        if(case1) {
            if(c.caseTitle) case1.querySelector('.case-title').innerHTML = c.caseTitle;
            if(c.caseProblem) case1.querySelector('.case-body p:nth-child(1)').innerHTML = `<strong>O Problema / The Issue:</strong> ${c.caseProblem}`;
            if(c.caseResult) case1.querySelector('.case-body p:nth-child(2)').innerHTML = `<strong>O Resultado / The Result:</strong> ${c.caseResult}`;
            if(c.caseAmount) case1.querySelector('.case-value').innerHTML = `Valor / Amount: <span class="highlight-gold-text">${c.caseAmount}</span>`;
        }
    }

    // 6. Testimonial Override (First item)
    if(c.testName) {
        const test1 = document.querySelector('.testimonial-card');
        if(test1) {
            if(c.testName) test1.querySelector('.client-info h4').innerHTML = c.testName;
            if(c.testRole) test1.querySelector('.client-info .role').innerHTML = c.testRole;
            if(c.testText) test1.querySelector('.review').innerHTML = `"${c.testText}"`;
        }
    }
  
    // Virtual Assistant Toggle
    if (c.showChatbot === false) {
        const chatSec = document.getElementById('avaliacao');
        if(chatSec) chatSec.style.display = 'none';
    }
    
    if (c.assistantName) {
        replaceText('.chat-title h3', c.assistantName);
        window.CHATBOT_NAME_OVERRIDE = c.assistantName;
    }
    if (c.assistantCta) {
        window.CHATBOT_CTA_OVERRIDE = c.assistantCta;
    }
    
    // Sections toggle
    if (c.footerCopyright) {
        replaceText('.copyright', c.footerCopyright);
    }
    
    // License Badge
    const navContent = document.querySelector('.navbar .nav-content');
    if (navContent) {
        const badge = document.createElement('div');
        badge.className = 'public-license-badge';
        if (c.licenseKey && c.licenseKey.trim().length > 0) {
            badge.innerHTML = '✔ Licensed version';
            badge.classList.add('licensed');
        } else {
            const isEnglish = document.documentElement.lang === 'en';
            badge.innerHTML = isEnglish ? '⚠️ Demo version' : '⚠️ Versão de Demonstração';
            badge.classList.add('demo');
        }
        navContent.appendChild(badge);
    }

  } catch (err) {
      console.warn('Failed to parse admin customizations.', err);
  }
}

// Inject immediately on load since <script type="module"> executes after DOM is ready
applyDynamicConfig();

// --- END CONFIG INJECTION ---

// WhatsApp Configuration
const WHATSAPP_NUMBER = '5511999999999'; // Example number, replace with real one
const DEFAULT_MESSAGE = 'Olá! Gostaria de falar com um advogado especialista em direito do trabalho. Vim pelo site.';

// Function to generate WhatsApp URL
function getWhatsAppUrl(message) {
  const numberToUse = window.WHATSAPP_NUMBER_OVERRIDE || WHATSAPP_NUMBER;
  const text = encodeURIComponent(message || DEFAULT_MESSAGE);
  return `https://wa.me/${numberToUse}?text=${text}`;
}

// 1. Update all generic WhatsApp Links on page load
document.addEventListener('DOMContentLoaded', () => {
  const whatsappButtons = document.querySelectorAll('#hero-whatsapp-btn, .cta-wpp, .floating-wpp');
  
  whatsappButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(getWhatsAppUrl(), '_blank');
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      navbar.style.padding = '10px 0';
    } else {
      navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
      navbar.style.padding = '15px 0';
    }
  });

  // Chatbot Logic Initiation
  initChatBot();
});

function initChatBot() {
  const chatBody = document.getElementById('chat-body');
  const chatFooter = document.getElementById('chat-footer');
  const chatProgressBar = document.getElementById('chat-progress-bar');
  const restartBtn = document.getElementById('chat-restart');
  
  if (!chatBody || !chatFooter) return;

  const isEnglish = document.documentElement.lang === 'en';
  
  const translations = {
    step1_bot: isEnglish ? "Hello! Let's quickly check your case. What is your name?" : "Olá! Vamos fazer uma verificação rápida do seu caso. Qual é o seu nome?",
    step2_bot: isEnglish ? "Do you have a formal job contract (registered)?" : "Você tem ou tinha carteira assinada no emprego em que o problema ocorreu?",
    step2_opts: isEnglish ? ["Yes", "No"] : ["Sim", "Não"],
    step3_bot: isEnglish ? "What is your main issue?" : "Qual é o principal problema que você identificou?",
    step3_opts: isEnglish 
      ? ["Unpaid overtime", "Unfair dismissal", "Workplace harassment", "No formal contract", "Other"]
      : ["Horas extras não pagas", "Demissão injusta/verbas retidas", "Assédio moral", "Trabalho sem registro", "Outro detalhe"],
    step4_bot: isEnglish ? "Have you been fired recently?" : "Você foi demitido recentemente?",
    step4_opts: isEnglish ? ["Yes", "No"] : ["Sim", "Não"],
    step5_bot: isEnglish ? "How would you like to be contacted?" : "Como você prefere ser contatado pela nossa equipe?",
    step5_opts: isEnglish ? ["WhatsApp message", "Phone call"] : ["Mensagem de WhatsApp", "Ligação"],
    final_bot: isEnglish ? "Great. Based on your answers, you may have a valid case. Let our specialists analyze the details and calculate exactly what you can claim." : "Excelente. Com base nas suas respostas, verificamos que você pode ter uma causa ganha. Deixe nossos especialistas avaliarem para descobrir os valores exatos de indenização.",
    final_btn: window.CHATBOT_CTA_OVERRIDE || (isEnglish ? "Continue on WhatsApp" : "Continuar no WhatsApp"),
    placeholder: isEnglish ? "Type your answer..." : "Digite sua resposta...",
    send: isEnglish ? "Send" : "Enviar",
    typingUser: isEnglish ? "Thinking..." : "Digitando..."
  };

  const steps = [
    { type: 'input', question: translations.step1_bot, field: 'name' },
    { type: 'choice', question: translations.step2_bot, options: translations.step2_opts, field: 'contract' },
    { type: 'choice', question: translations.step3_bot, options: translations.step3_opts, field: 'issue' },
    { type: 'choice', question: translations.step4_bot, options: translations.step4_opts, field: 'fired' },
    { type: 'choice', question: translations.step5_bot, options: translations.step5_opts, field: 'contactType' }
  ];

  let currentStep = 0;
  let userData = {};

  function scrollToBottom() {
    setTimeout(() => {
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth' });
    }, 50);
  }

  function showTyping(callback) {
    chatFooter.innerHTML = '';
    const typingId = 'typing-' + Date.now();
    chatBody.innerHTML += `
      <div class="typing-indicator" id="${typingId}">
        <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
      </div>
    `;
    scrollToBottom();
    
    // Simulate thinking delay between 1.0 to 1.5 secs
    setTimeout(() => {
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();
      callback();
    }, 1200); 
  }

  function addBotMessage(text) {
    chatBody.innerHTML += `<div class="chat-message bot">${text}</div>`;
    scrollToBottom();
  }

  function addUserMessage(text) {
    chatBody.innerHTML += `<div class="chat-message user">${text}</div>`;
    scrollToBottom();
  }

  function updateProgress() {
    const progress = (currentStep / steps.length) * 100;
    chatProgressBar.style.width = `${progress}%`;
  }

  function renderStep() {
    if (currentStep >= steps.length) {
      finishChat();
      return;
    }
    
    updateProgress();
    const step = steps[currentStep];

    showTyping(() => {
      addBotMessage(step.question);
      
      if (step.type === 'input') {
        chatFooter.innerHTML = `
          <div class="chat-input-wrapper">
             <input type="text" id="chat-text-input" placeholder="${translations.placeholder}" autocomplete="off" />
             <button class="chat-send-btn" id="chat-text-submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
             </button>
          </div>
        `;
        const inputStr = document.getElementById('chat-text-input');
        const btnStr = document.getElementById('chat-text-submit');
        
        const submitHandler = () => {
          const val = inputStr.value.trim();
          if (val) handleAnswer(val, step.field);
        };
        
        btnStr.addEventListener('click', submitHandler);
        inputStr.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') submitHandler();
        });
        
      } else if (step.type === 'choice') {
        let optsHtml = '<div class="chat-options">';
        step.options.forEach(opt => {
          optsHtml += `<button class="chat-option-btn">${opt}</button>`;
        });
        optsHtml += '</div>';
        chatFooter.innerHTML = optsHtml;
        
        const btns = chatFooter.querySelectorAll('.chat-option-btn');
        btns.forEach(btn => {
          btn.addEventListener('click', () => {
             handleAnswer(btn.innerText, step.field);
          });
        });
      }
    });
  }

  function handleAnswer(answer, field) {
    userData[field] = answer;
    chatFooter.innerHTML = '';
    addUserMessage(answer);
    currentStep++;
    renderStep();
  }

  function finishChat() {
    chatProgressBar.style.width = '100%';
    showTyping(() => {
      addBotMessage(translations.final_bot);
      chatFooter.innerHTML = `
        <button class="chat-cta-btn" id="chat-finish-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          ${translations.final_btn}
        </button>
      `;
      
      document.getElementById('chat-finish-btn').addEventListener('click', () => {
         let messageTemplate = '';
         if(isEnglish) {
           messageTemplate = `Hello, I would like to analyze my labor case.\n\nName: ${userData.name}\nFormal contract: ${userData.contract}\nIssue: ${userData.issue}\nFired recently: ${userData.fired}\nPreferred contact: ${userData.contactType}\n\nI would like to know if I have compensation to receive.`;
         } else {
           messageTemplate = `Olá, gostaria de analisar o meu caso trabalhista.\n\nNome: ${userData.name}\nCarteira Assinada: ${userData.contract}\nProblema: ${userData.issue}\nDemitido recentemente: ${userData.fired}\nContato Preferido: ${userData.contactType}\n\nGostaria de saber se tenho indenização a receber.`;
         }
         window.open(getWhatsAppUrl(messageTemplate), '_blank');
      });
      scrollToBottom();
    });
  }

  function startChat() {
    chatBody.innerHTML = '';
    chatFooter.innerHTML = '';
    currentStep = 0;
    userData = {};
    chatProgressBar.style.width = '0%';
    renderStep();
  }

  if(restartBtn) {
    restartBtn.addEventListener('click', startChat);
  }

  // Start on load
  startChat();
}

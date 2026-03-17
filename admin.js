const schema = {
  branding: {
    id: "branding", icon: "🏢", title: "1. Branding & Identity",
    fields: [
      { name: "lawFirmName", label: "Law Firm Name", type: "text", placeholder: "Your Law Firm Name" },
      { name: "lawFirmSubtitle", label: "Subtitle / Niche", type: "text", placeholder: "Labor Law Specialists" },
      { name: "lawyerImage", label: "Lawyer Photo URL", type: "text", placeholder: "/advogado.png", help: "Paste a web HTML image address or use default /advogado.png" },
      { name: "lawyerName", label: "Lawyer Name (Profile Section)", type: "text", placeholder: "Dr. Lawyer's Name" },
    ]
  },
  contact: {
    id: "contact", icon: "📞", title: "2. Contact & CTA",
    fields: [
      { name: "whatsappNumber", label: "WhatsApp Number", type: "text", placeholder: "5511999999999", help: "Enter WhatsApp with country code (e.g. 5511999999999)" },
      { name: "contactEmail", label: "Contact Email", type: "text", placeholder: "your@email.com" },
      { name: "ctaMain", label: "Main CTA Button Text", type: "text", placeholder: "Get Clients via WhatsApp Now" },
      { name: "ctaSecondary", label: "Secondary CTA Button Text", type: "text", placeholder: "Get a free case evaluation" }
    ]
  },
  hero: {
    id: "hero", icon: "🚀", title: "3. Hero Section",
    fields: [
      { name: "heroBadge", label: "Top Badge Text", type: "text", placeholder: "🚀 Built for High Conversion" },
      { name: "heroHeadline", label: "Main Headline (HTML <span> allowed)", type: "textarea", placeholder: "Have you been fired..." },
      { name: "heroSubheadline", label: "Subheadline", type: "textarea", placeholder: "Immediate support..." },
      { name: "heroUrgency", label: "Urgency Warning", type: "text", placeholder: "⚠️ You could lose this right..." }
    ]
  },
  social: {
    id: "social", icon: "⭐", title: "4. Social Proof Numbers",
    fields: [
      { name: "stat1Value", label: "Stat 1 Value", type: "text", half: true },
      { name: "stat1Label", label: "Stat 1 Label", type: "text", half: true },
      { name: "stat2Value", label: "Stat 2 Value", type: "text", half: true },
      { name: "stat2Label", label: "Stat 2 Label", type: "text", half: true },
      { name: "stat3Value", label: "Stat 3 Value", type: "text", half: true },
      { name: "stat3Label", label: "Stat 3 Label", type: "text", half: true }
    ]
  },
  cases: {
    id: "cases", icon: "📊", title: "5. Case Results (Editable Card 1)",
    fields: [
      { name: "caseTitle", label: "Case Title", type: "text" },
      { name: "caseProblem", label: "Case Problem", type: "textarea" },
      { name: "caseResult", label: "Case Result", type: "textarea" },
      { name: "caseAmount", label: "Recovered Amount", type: "text" }
    ]
  },
  testimonials: {
    id: "testimonials", icon: "💬", title: "6. Testimonials (Editable Card 1)",
    fields: [
      { name: "testName", label: "Client Name", type: "text" },
      { name: "testRole", label: "Client Role", type: "text" },
      { name: "testText", label: "Testimonial Message", type: "textarea" }
    ]
  },
  chatbot: {
    id: "chatbot", icon: "🤖", title: "7. Virtual Assistant Settings",
    fields: [
      { name: "showChatbot", label: "Enable Virtual Assistant Section", type: "checkbox" },
      { name: "assistantName", label: "Virtual Assistant Name", type: "text", placeholder: "Virtual Assistant" },
      { name: "assistantCta", label: "Final WhatsApp CTA Button Text", type: "text", placeholder: "Continue on WhatsApp" }
    ]
  },
  settings: {
    id: "settings", icon: "⚙️", title: "8. Display Settings & Footer",
    fields: [
      { name: "showFeatures", label: "Show Template Features Section", type: "checkbox" },
      { name: "showPerfectFor", label: "Show Perfect For Section", type: "checkbox" },
      { name: "footerCopyright", label: "Footer Copyright Text", type: "text" }
    ]
  }
};

const navEl = document.getElementById('nav-links');
const formEl = document.getElementById('admin-form');

// Build UI Dynamically
let navHtml = '';
let formHtml = '';

Object.values(schema).forEach(section => {
  navHtml += `
    <a href="#${section.id}" class="nav-item">
      <span class="nav-icon">${section.icon}</span>
      <span class="nav-text">${section.title.split('. ')[1]}</span>
    </a>`;
  
  formHtml += `<div class="section-panel" id="${section.id}">
    <div class="section-header-row">
       <span class="section-icon">${section.icon}</span>
       <h3>${section.title}</h3>
    </div>`;
    
  let openTwoCol = false;
  
  section.fields.forEach((field, i) => {
    if(field.half && !openTwoCol) {
      formHtml += `<div class="two-col">`;
      openTwoCol = true;
    } else if (!field.half && openTwoCol) {
      formHtml += `</div>`;
      openTwoCol = false;
    }
    
    if(field.type === 'checkbox') {
        formHtml += `<div class="form-group checkbox-lbl"><input type="checkbox" name="${field.name}" id="${field.name}"><label for="${field.name}" style="margin:0;">${field.label}</label></div>`;
    } else if (field.type === 'textarea') {
        formHtml += `<div class="form-group"><label>${field.label}</label><textarea name="${field.name}" placeholder="${field.placeholder || ''}"></textarea>${field.help ? `<div class="form-text">${field.help}</div>` : ''}</div>`;
    } else {
        formHtml += `<div class="form-group"><label>${field.label}</label><input type="text" name="${field.name}" placeholder="${field.placeholder || ''}">${field.help ? `<div class="form-text">${field.help}</div>` : ''}</div>`;
    }
  });
  
  if (openTwoCol) formHtml += `</div>`;
  formHtml += `</div>`;
});

navEl.innerHTML = navHtml;
formEl.innerHTML = formHtml;

// Load Config
let currentConfig = JSON.parse(localStorage.getItem('lawyer_template_config') || '{}');

function populateForm(cfg) {
  formEl.reset();

  // Special defaults for toggles if config is empty
  if(Object.keys(cfg).length === 0) {
      cfg.showChatbot = true;
      cfg.showFeatures = true;
      cfg.showPerfectFor = true;
  } else {
      if(cfg.showChatbot === undefined) cfg.showChatbot = true;
      if(cfg.showFeatures === undefined) cfg.showFeatures = true;
      if(cfg.showPerfectFor === undefined) cfg.showPerfectFor = true;
  }

  Object.keys(cfg).forEach(key => {
    const el = formEl.elements[key];
    if (el) {
      if (el.type === 'checkbox') el.checked = !!cfg[key];
      else el.value = cfg[key];
    }
  });
}

populateForm(currentConfig);

// Unsaved Changes State Logic
const statusBadge = document.getElementById('save-status');
const statusText = statusBadge.querySelector('.status-text');
let isSaved = true;

function markUnsaved() {
    if(!isSaved) return;
    isSaved = false;
    statusBadge.classList.remove('saved');
    statusBadge.classList.add('unsaved');
    statusText.innerText = 'Unsaved Changes';
}

function markSaved() {
    isSaved = true;
    statusBadge.classList.remove('unsaved');
    statusBadge.classList.add('saved');
    statusText.innerText = 'Saved';
}

formEl.addEventListener('input', markUnsaved);
formEl.addEventListener('change', markUnsaved);

// WA Live Preview Logic
document.addEventListener('DOMContentLoaded', () => {
    const waInput = document.querySelector('input[name="whatsappNumber"]');
    if(waInput) {
        waInput.insertAdjacentHTML('afterend', `
            <div id="wa-preview" class="wa-preview">
                <div class="wa-preview-header">
                    <span id="wa-preview-status">✅ WhatsApp Link Ready</span>
                    <button type="button" class="wa-copy-btn" id="wa-copy-btn">Copy Link</button>
                </div>
                <div class="wa-preview-link" id="wa-link-text"></div>
            </div>
        `);
        
        const previewBox = document.getElementById('wa-preview');
        const linkText = document.getElementById('wa-link-text');
        const copyBtn = document.getElementById('wa-copy-btn');
        const statusIconTxt = document.getElementById('wa-preview-status');
        
        function updateWaPreview() {
            const val = waInput.value.trim().replace(/\D/g,''); // allow only digits
            if(!val) {
                previewBox.style.display = 'none';
                return; 
            }
            previewBox.style.display = 'flex';
            
            // Simple validation: strictly digits, size between 10-15
            if(val.length >= 10 && val.length <= 15) {
                previewBox.classList.remove('error');
                statusIconTxt.innerText = '✅ Active WhatsApp Link';
                const link = `https://wa.me/${val}`;
                linkText.innerText = link;
                copyBtn.style.display = 'block';
            } else {
                previewBox.classList.add('error');
                statusIconTxt.innerText = '⚠️ Invalid Form (Need 10-15 Digits)';
                linkText.innerText = 'Please ensure you added country code. Letters are ignored.';
                copyBtn.style.display = 'none';
            }
        }
        
        waInput.addEventListener('input', updateWaPreview);
        updateWaPreview();
        
        copyBtn.addEventListener('click', (e) => {
             e.preventDefault();
             navigator.clipboard.writeText(linkText.innerText);
             const og = copyBtn.innerText;
             copyBtn.innerText = 'Copied!';
             setTimeout(() => copyBtn.innerText = og, 2000);
        });
    }
});


function runValidations(cfg) {
    if(!cfg.whatsappNumber || cfg.whatsappNumber.trim() === '') {
        console.warn("WhatsApp Number is empty.");
    }
}

// Save Config
document.getElementById('btn-save').addEventListener('click', (e) => {
  e.preventDefault();
  const formData = new FormData(formEl);
  const cfg = {};
  
  const allCheckboxes = Array.from(formEl.querySelectorAll('input[type="checkbox"]')).map(el => el.name);
  
  for(let pair of formData.entries()) {
    cfg[pair[0]] = pair[1];
  }
  
  allCheckboxes.forEach(cb => {
    cfg[cb] = !!formData.get(cb);
  });
  
  runValidations(cfg);

  localStorage.setItem('lawyer_template_config', JSON.stringify(cfg));
  markSaved();
  
  const toast = document.getElementById('toast');
  document.getElementById('toast-desc').innerText = 'Your template customizations have been applied securely.';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
});

// Reset
document.getElementById('btn-reset').addEventListener('click', (e) => {
  if(confirm('Are you sure you want to reset all customizations and return to the default template themes?')) {
     localStorage.removeItem('lawyer_template_config');
     currentConfig = {};
     populateForm(currentConfig);
     markSaved();
     
     // trigger input events manually to format preview box
     const waInput = document.querySelector('input[name="whatsappNumber"]');
     if(waInput) {
         waInput.dispatchEvent(new Event('input'));
     }

     const toast = document.getElementById('toast');
     toast.querySelector('strong').innerText = 'Template Reset';
     document.getElementById('toast-desc').innerText = 'Settings removed back to defaults.';
     toast.classList.add('show');
     setTimeout(() => {
         toast.classList.remove('show');
         setTimeout(()=> {
             toast.querySelector('strong').innerText = 'Changes saved successfully';
         }, 500);
     }, 3000);
  }
});

// Export JSON
document.getElementById('btn-export').addEventListener('click', () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem('lawyer_template_config') || '{}');
  const dNode = document.createElement('a');
  dNode.setAttribute("href", dataStr);
  dNode.setAttribute("download", "lawyer_template_config.json");
  document.body.appendChild(dNode);
  dNode.click();
  dNode.remove();
});

// Import JSON
document.getElementById('btn-import').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const parsed = JSON.parse(evt.target.result);
      localStorage.setItem('lawyer_template_config', JSON.stringify(parsed));
      populateForm(parsed);
      markUnsaved(); // they imported but want them to see they need to save or verify? Actually let's mark saved because we set format.
      markSaved();
      
      const waInput = document.querySelector('input[name="whatsappNumber"]');
      if(waInput) waInput.dispatchEvent(new Event('input'));

      const toast = document.getElementById('toast');
      toast.querySelector('strong').innerText = 'Import Successful';
      document.getElementById('toast-desc').innerText = 'Config loaded. Live preview updated.';
      toast.classList.add('show');
      setTimeout(() => {
         toast.classList.remove('show');
         setTimeout(()=> {
             toast.querySelector('strong').innerText = 'Changes saved successfully';
         }, 500);
     }, 3000);
    } catch(err) {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
});

// Navigation Highlight
const sections = document.querySelectorAll('.section-panel');
const navLinks = document.querySelectorAll('#nav-links a');
document.querySelector('.content').addEventListener('scroll', () => {
    let current = '';
    const content = document.querySelector('.content');
    sections.forEach(sec => {
        const secTop = sec.offsetTop;
        if (content.scrollTop >= secTop - 250) {
            current = sec.getAttribute('id');
        }
    });

    navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) {
            a.classList.add('active');
        }
    });
});

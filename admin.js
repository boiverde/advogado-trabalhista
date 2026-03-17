const schema = {
  branding: {
    id: "branding", title: "1. Branding & Identity",
    fields: [
      { name: "lawFirmName", label: "Law Firm Name", type: "text", placeholder: "Your Law Firm Name" },
      { name: "lawFirmSubtitle", label: "Subtitle / Niche", type: "text", placeholder: "Labor Law Specialists" },
      { name: "lawyerImage", label: "Lawyer Photo URL", type: "text", placeholder: "/advogado.png", help: "Paste a web HTML image address or use default /advogado.png" },
      { name: "lawyerName", label: "Lawyer Name (Profile Section)", type: "text", placeholder: "Dr. Lawyer's Name" },
    ]
  },
  contact: {
    id: "contact", title: "2. Contact & CTA",
    fields: [
      { name: "whatsappNumber", label: "WhatsApp Number", type: "text", placeholder: "5511999999999", help: "Important: Country code + area code + number. Only numbers." },
      { name: "contactEmail", label: "Contact Email", type: "text", placeholder: "your@email.com" },
      { name: "ctaMain", label: "Main CTA Button Text", type: "text", placeholder: "Get Clients via WhatsApp Now" },
      { name: "ctaSecondary", label: "Secondary CTA Button Text", type: "text", placeholder: "Get a free case evaluation" }
    ]
  },
  hero: {
    id: "hero", title: "3. Hero Section",
    fields: [
      { name: "heroBadge", label: "Top Badge Text", type: "text", placeholder: "🚀 Built for High Conversion" },
      { name: "heroHeadline", label: "Main Headline (HTML <span> allowed)", type: "textarea", placeholder: "Have you been fired..." },
      { name: "heroSubheadline", label: "Subheadline", type: "textarea", placeholder: "Immediate support..." },
      { name: "heroUrgency", label: "Urgency Warning", type: "text", placeholder: "⚠️ You could lose this right..." }
    ]
  },
  social: {
    id: "social", title: "4. Social Proof Numbers",
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
    id: "cases", title: "5. Case Results (Editable Card 1)",
    fields: [
      { name: "caseTitle", label: "Case Title", type: "text" },
      { name: "caseProblem", label: "Case Problem", type: "textarea" },
      { name: "caseResult", label: "Case Result", type: "textarea" },
      { name: "caseAmount", label: "Recovered Amount", type: "text" }
    ]
  },
  testimonials: {
    id: "testimonials", title: "6. Testimonials (Editable Card 1)",
    fields: [
      { name: "testName", label: "Client Name", type: "text" },
      { name: "testRole", label: "Client Role", type: "text" },
      { name: "testText", label: "Testimonial Message", type: "textarea" }
    ]
  },
  chatbot: {
    id: "chatbot", title: "7. Virtual Assistant Settings",
    fields: [
      { name: "showChatbot", label: "Enable Virtual Assistant Section", type: "checkbox" },
      { name: "assistantName", label: "Virtual Assistant Name", type: "text", placeholder: "Virtual Assistant" },
      { name: "assistantCta", label: "Final WhatsApp CTA Button Text", type: "text", placeholder: "Continue on WhatsApp" }
    ]
  },
  settings: {
    id: "settings", title: "8. Display Settings & Footer",
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
  navHtml += `<a href="#${section.id}">${section.title.split('. ')[1]}</a>`;
  
  formHtml += `<div class="section-panel" id="${section.id}">
    <h3>${section.title}</h3>`;
    
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

// Validations
function runValidations(cfg) {
    if(!cfg.whatsappNumber || cfg.whatsappNumber.trim() === '') {
        alert("Warning: WhatsApp Number is empty! Links will not work correctly until you provide a number.");
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
  
  const toast = document.getElementById('toast');
  toast.innerText = '✅ Changes Saved Successfully!';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
});

// Reset
document.getElementById('btn-reset').addEventListener('click', (e) => {
  if(confirm('Are you sure you want to reset all customizations and return to the default template themes?')) {
     localStorage.removeItem('lawyer_template_config');
     currentConfig = {};
     populateForm(currentConfig);
     const toast = document.getElementById('toast');
     toast.innerText = '🗑 Settings Reset to Defaults!';
     toast.classList.add('show');
     setTimeout(() => toast.classList.remove('show'), 3000);
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
      const toast = document.getElementById('toast');
      toast.innerText = '📥 Settings Imported Successfully!';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
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
        if (content.scrollTop >= secTop - 120) {
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

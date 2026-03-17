// WhatsApp Configuration
const WHATSAPP_NUMBER = '5511999999999'; // Example number, replace with real one
const DEFAULT_MESSAGE = 'Olá! Gostaria de falar com um advogado especialista em direito do trabalho. Vim pelo site.';

// Function to generate WhatsApp URL
function getWhatsAppUrl(message) {
  const text = encodeURIComponent(message || DEFAULT_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

// 1. Update all generic WhatsApp Links on page load
document.addEventListener('DOMContentLoaded', () => {
  // Select hero button, CTA button, and floating button
  const whatsappButtons = document.querySelectorAll('#hero-whatsapp-btn, .cta-wpp, .floating-wpp');
  
  whatsappButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If it's the floating button and it's trying to scroll to contact section
      // we can optionally change it to go directly to WA instead!
      // Here we will just make them open WA directly to maximize conversion.
      e.preventDefault();
      window.open(getWhatsAppUrl(), '_blank');
    });
  });

  // 2. Handle Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nome = document.getElementById('name').value;
      const telefone = document.getElementById('phone').value; // Collecting for metrics if we had a backend
      const relato = document.getElementById('message').value;

      let customMessage = `*Novo Contato via Site*\n\n*Nome:* ${nome}\n*Telefone:* ${telefone}`;
      if (relato.trim() !== '') {
        customMessage += `\n*Resumo:* ${relato}`;
      } else {
        customMessage += `\n*Assunto:* Preciso de ajuda com direitos trabalhistas.`;
      }

      // Open WhatsApp directly with the filled data
      window.open(getWhatsAppUrl(customMessage), '_blank');
      
      // Optional: Clear form after submission or show a "thanks" message replacing form
      contactForm.innerHTML = `
        <div style="text-align: center; padding: 30px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
          <h4 style="color: #166534; font-size: 1.2rem; margin-bottom: 10px;">Enviado com sucesso!</h4>
          <p style="color: #15803d; font-size: 1rem;">Você será redirecionado para o nosso WhatsApp para continuar o atendimento.</p>
        </div>
      `;
    });
  }

  // 3. Navbar scroll effect (add shadow when scrolling down)
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
});

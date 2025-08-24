(() => {
  const root = document.getElementById('chatbot');
  if (!root) return;
  const toggle = root.querySelector('.chatbot-toggle');
  const win = root.querySelector('.chatbot-window');
  const closeBtn = root.querySelector('.chatbot-close');
  const form = root.querySelector('form');
  const messages = root.querySelector('.chatbot-messages');

  function pushMessage(text, author) {
    const div = document.createElement('div');
    div.className = `mb-2 ${author === 'bot' ? 'text-secondary' : ''}`;
    div.textContent = `${author === 'bot' ? 'Sanoria: ' : 'You: '} ${text}`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  toggle.addEventListener('click', () => {
    win.classList.toggle('d-none');
  });
  closeBtn.addEventListener('click', () => win.classList.add('d-none'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    pushMessage(text, 'user');
    // Simple scripted responses for now
    let reply = 'Thanks for your message! Our team will get back shortly.';
    if (/order|track|status/i.test(text)) reply = 'You can view order history under Account > Orders.';
    if (/return|refund/i.test(text)) reply = 'We offer a 14-day easy return policy.';
    if (/discount|promo|code/i.test(text)) reply = 'Use code LUXE15 for 15% off today.';
    if (/skin|type/i.test(text)) reply = 'Try Shop by Skin Type to personalize products.';
    setTimeout(() => pushMessage(reply, 'bot'), 400);
  });
})();
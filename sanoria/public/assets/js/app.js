function addMessage(text, author = 'bot') {
  const el = document.createElement('div');
  el.className = author === 'bot' ? 'text-warning small mb-2' : 'text-light small text-end mb-2';
  el.textContent = text;
  document.getElementById('chatBody').appendChild(el);
  document.getElementById('chatBody').scrollTop = 1e6;
}
addMessage('Hi! I can help with orders, returns, payments.');

async function handleSend() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  input.value = '';
  if (/return/i.test(text)) {
    addMessage('We offer a 14-day easy return policy.');
  } else if (/payment|jazz|easypaisa|cod/i.test(text)) {
    addMessage('We accept JazzCash, EasyPaisa, bank cards, and Cash on Delivery.');
  } else if (/shipping|courier|tcs|leopard|pkdex/i.test(text)) {
    addMessage('We ship via Leopard, TCS, and PkDex across Pakistan.');
  } else {
    addMessage('Thanks! Our team will get back to you shortly.');
  }
}

document.getElementById('chatSend').addEventListener('click', handleSend);
document.getElementById('chatInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
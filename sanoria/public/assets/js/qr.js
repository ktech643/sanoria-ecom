const btn = document.getElementById('genQR');
btn.addEventListener('click', async () => {
  const code = document.getElementById('promoCode').value.trim();
  if (!code) return;
  const res = await fetch(`/api/promotions/qr/${encodeURIComponent(code)}`);
  const json = await res.json();
  if (json.qr) {
    document.getElementById('qrImg').innerHTML = `<img src="${json.qr}" class="img-fluid" alt="QR">`;
  } else {
    document.getElementById('qrImg').textContent = json.error || 'Not found';
  }
});
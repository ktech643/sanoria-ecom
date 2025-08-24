// Placeholder for QR scanning integration. For production, integrate a library like html5-qrcode.
window.addEventListener('DOMContentLoaded', () => {
  // Example: if a URL contains ?qr=DISCOUNT2025, surface a banner.
  const url = new URL(window.location.href);
  const qr = url.searchParams.get('qr');
  if (qr) {
    const div = document.createElement('div');
    div.className = 'alert alert-success m-3';
    div.textContent = `QR Applied: ${qr}. Enjoy your special offer!`;
    document.body.prepend(div);
  }
});
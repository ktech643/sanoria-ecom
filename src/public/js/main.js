document.addEventListener('DOMContentLoaded', () => {
  const notifyBtn = document.getElementById('notify-btn');
  if (notifyBtn && 'Notification' in window) {
    notifyBtn.addEventListener('click', async () => {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      if (Notification.permission === 'granted') {
        new Notification('Sanoria.pk', { body: 'Welcome! Explore today’s offers ✨' });
      }
    });
  }
});
// utils/notifications.ts
export const initNotifications = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      // Register service worker for push
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      })
      
      // Send subscription to server
      await fetch('/api/driver/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}

export const showNotification = (title, body) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/icons/icon-192x192.png' })
  }
}

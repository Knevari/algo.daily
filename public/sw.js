self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'AlgoDaily Streak Alert! 🦉';
    const options = {
        body: data.body || 'Don\'t let your streak die! Complete your daily problem now.',
        icon: '/favicon.ico', // Adjust path if needed
        badge: '/favicon.ico',
        tag: 'streak-reminder',
        renotify: true,
        data: {
            url: '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
ory

self.addEventListener('push', event => {
    const data = event.data.json(); // Parse incoming notification data
    console.log('Push received:', data);

    self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/logo.png',
    });
});

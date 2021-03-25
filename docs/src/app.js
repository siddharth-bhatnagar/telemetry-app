// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('../../serviceWorker.js')
            .then((registration) => console.log(`Registration Successful, scope: ${registration.scope}`))
            .catch((error) => console.log(`Service Worker Registration failed: ${error}`));
    });
}
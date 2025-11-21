"use client";

import { useEffect } from "react";

export default function PWAInstaller() {
    useEffect(() => {
        // Register service worker
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log("Service Worker registered successfully:", registration.scope);

                    // Check for updates periodically
                    setInterval(() => {
                        registration.update();
                    }, 60000); // Check every minute

                    // Handle updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New service worker available, notify user or reload
                                    console.log('New version available! Reload to update.');
                                }
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });

            // Handle service worker messages
            navigator.serviceWorker.addEventListener('message', (event) => {
                console.log('Message from service worker:', event.data);
            });
        } else {
            console.warn('Service Workers are not supported in this browser.');
        }
    }, []);

    return null;
}

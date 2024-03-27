let currentNotification = null;

// Function to show a notification and cancel the previous one if it exists
function showNotification(message: string, options?: NotificationOptions) {
  // If there is a current notification, cancel it before showing the new one
  if (currentNotification) {
    currentNotification.cancel();
  }

  // Show the new notification
  currentNotification = figma.notify(message, {
    ...options,
    onDequeue: (reason) => {
      // If the notification is dequeued for any reason, set the currentNotification to null
      currentNotification = null;
      // Run the onDequeue function if provided
      if (options && options.onDequeue) {
        options.onDequeue(reason);
      }
    },
  });
}

export default showNotification;

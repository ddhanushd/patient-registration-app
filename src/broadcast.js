// broadcast.js

const channel = new BroadcastChannel('patient_data_channel');

// Function to notify other tabs about a change (add, update, delete)
export const broadcastUpdate = (action, data) => {
  console.log('Broadcasting update:', action, data); // Debugging log
  channel.postMessage({ action, data });
};

// Listen for messages from other tabs
export const listenForUpdates = (callback) => {
  channel.addEventListener('message', (event) => {
    const { action, data } = event.data;
    console.log('Received message:', action, data); // Debugging log
    callback(action, data);
  });
};

// Cleanup
export const closeChannel = () => {
  channel.close();
};

<template>
  <HeaderForm />
  <div class="chat">
    <div class="chat-container">
      <div class="chat-header">
        <h2>Chat with {{ otherUsername }}</h2>
      </div>
      <div class="chat-messages" ref="chatMessages">
        <div class="message" v-for="message in messages" :key="message.id" :class="{ 'message-sent': message.sender.username === currentUsername, 'message-received': message.sender.username !== currentUsername }">
          <strong>{{ message.sender.username }}:</strong> {{ message.content }} <span class="timestamp">({{ formatTimestamp(message.timestamp) }})</span>
        </div>
      </div>
      <div class="chat-input">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message" class="form-control" />
        <button @click="sendMessage" class="btn btn-primary">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderForm from '@/components/HeaderForm.vue';

const API_URL = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000';

const route = useRoute();
const router = useRouter();
const otherUsername = computed(() => route.params.otherUsername);
const currentUsername = ref(localStorage.getItem('username') || '');
const messages = ref([]);
const newMessage = ref('');
const chatMessages = ref(null);
let chatSocket = null;

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const loadChatHistory = async () => {
  if (!currentUsername.value) {
    alert('Please log in.');
    router.push('/login');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/chat/${otherUsername.value}/?username=${currentUsername.value}`);
    if (response.status !== 200) {
      const error = await response.json();
      alert('Failed to load chat: ' + error.error);
      return;
    }
    const chat = await response.json();
    messages.value = chat.messages || [];
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('Error loading chat:', error);
    alert('Error loading chat');
  }
};

const connectWebSocket = () => {
  if (!currentUsername.value) {
    alert('Please log in.');
    router.push('/login');
    return;
  }

  if (chatSocket) {
    chatSocket.close();
  }

  chatSocket = new WebSocket(`${WS_URL}/ws/chat/${otherUsername.value}/?username=${currentUsername.value}`);

  chatSocket.onopen = () => {
    console.log('WebSocket connected');
  };

  chatSocket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    messages.value.push({
      id: Date.now(),
      sender: { username: data.sender },
      content: data.message,
      timestamp: data.timestamp
    });
    nextTick(() => scrollToBottom());
  };

  chatSocket.onclose = () => {
    console.error('WebSocket closed');
  };

  chatSocket.onerror = (e) => {
    console.error('WebSocket error:', e);
    alert('WebSocket connection failed');
  };
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !chatSocket || chatSocket.readyState !== WebSocket.OPEN) return;
  chatSocket.send(JSON.stringify({
    message: newMessage.value
  }));
  newMessage.value = '';
};

const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};

onMounted(() => {
  if (currentUsername.value) {
    loadChatHistory();
    connectWebSocket();
  } else {
    router.push('/login');
  }
});

onUnmounted(() => {
  if (chatSocket) {
    chatSocket.close();
  }
});
</script>

<style scoped>
header {
  background-color: #776d63;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}


.chat {
  display: flex;
  background-color: #5c524f;
  color: white;
  background-size: cover;
  height: 100vh;
  width: 100%;
}
.chat-container {
  width: 90%;
  max-width: 600px;
  margin: 20px auto;
  height: 80%;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}
.chat-header h2 {
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid white;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.message {
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
}
.message-sent {
  background-color: #776d63;
  align-self: flex-end;
}
.message-received {
  background-color: #3a3633;
  align-self: flex-start;
}
.timestamp {
  font-size: 0.8em;
  color: #ccc;
}
.chat-input {
  display: flex;
  gap: 10px;
  padding-top: 10px;
}
.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 15px;
  font-size: 16px;
}
.chat-input button {
  padding: 10px 20px;
}
@media (max-width: 800px) {
  .chat-container {
    width: calc(100% - 40px);
    height: calc(100vh - 80px);
    border-radius: 0;
  }
  .chat-messages {
    height: calc(100vh - 200px);
  }
}
</style>
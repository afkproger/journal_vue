<template>
  <HeaderForm/>
  <div class="chats">
    <div class="chats-container">
      <div class="chat-list">
        <div class="chat-item" v-for="username in friends" :key="username">
          <div class="chat-info">
            <h3>Никнейм: {{ username }}</h3>
            <button class="button" @click="openChat(username)" >Открыть чат</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import {onMounted, ref} from "vue";
import makeFetch from "@/functions/checkPermission";
import urls from "@/URL";
import HeaderForm from "@/components/HeaderForm.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const friends = ref([]);

const openChat = (username) => {
  if (!username) {
    alert('Please log in to open a chat.');
    router.push('/login');
    return;
  }
  router.push(`/chat/${username}`);
};
onMounted(async ()=> {
  const response = await makeFetch(urls.FRIENDSHIP,'GET');
  const data = await response.json();
  friends.value = data.friend_usernames || [];
  console.log(friends.value)
})
</script>


<style scoped>
header {
  background-color: #776d63;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.chat-info{
  display: inline-block;
  align-items: center;
  justify-content: center;
}
.chats{
  display: flex;
  background-color: #5c524f;
  color: white;
  background-size: cover;
  height: 100%;
  width: 100%;
}

.chats-container, .chat-container {
  width: 90%;
  max-width: 600px;
  margin: 20px auto;
  height: 70%;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #776d63;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chat-item:hover {
  background-color: #5c524f;
}

.chat-header h2 {
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid white;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 15px;
  font-size: 16px;
}

.button{
  width: 300px;
  padding: 10px;

}

@media (max-width: 800px) {
  .chats-container, .chat-container {
    width: calc(100% - 40px);
    height: calc(100vh - 80px);
    border-radius: 0;
  }

  .header-container {
    flex-direction: row
  }
  .button{
    height: 40px;
    width: 150px;
  }

  .chat-messages {
    height: calc(100vh - 200px);
  }
}
</style>
<template>
  <header>
    <div class="header-container">
      <p class="journal-text" @click="goToHome" > journal </p>
      <button class="button" @click="goToChats" >Чаты</button>
      <button class="button" @click="goToNotes" >Записи</button>
      <button class="button" @click="goToProfile">Личный кабинет</button>
    </div>
  </header>
</template>

<script setup>
import '@/assets/button.css'
import { useRouter } from "vue-router";

const router = useRouter();

const goToHome = () => {
  router.push("/");
}
const goToChats = () =>{
  router.push("/chats");
}

const goToNotes = () => {
  router.push("/note");
}

const goToProfile = () => {
  router.push("/profile");
}

</script>

<style scoped>
header{
  width: 100%;
}
.header-container {
  width: calc(100% - 20px);
  padding: 10px;
  height: 80px;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  flex-direction: row;
}

.journal-text {
  font-family: "Bauhaus 93", cursive;
  font-size: 30px;
  color: white;
  margin: 10px;
}
.journal-text:hover {
  cursor: pointer;
}
.button{
  height: 40px;
  width: 10%;
}

@media (max-width: 800px) {
  .header-container {
    flex-direction: column;

  }
  .button{
    height: 40px;
    width: 150px;
  }
}
</style>
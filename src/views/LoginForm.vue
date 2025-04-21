<template>
  <div class="login-form">
    <div class="left"></div>
    <div class="right">
      <div class="form-container">
        <h2>Вход</h2>
        <form @submit.prevent="submit(urls.LOGIN)">
          <input type="text" v-model="formData.username" placeholder="Лолин" required>
          <input type="password" v-model="formData.password" placeholder="Пароль" required>
          <button class="button" type="submit">Войти</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/form.css'
import '@/assets/button.css'
import urls from '@/URL'
import {reactive} from "vue";
import {useRouter} from "vue-router";
import submitForm from "@/functions/submitForm";


const router = useRouter();

const formData = reactive({
  username: '',
  password: ''
})

async function submit(url) {
  const {status, json} = await submitForm(formData , url);
  if (status === true){
    console.log(json);
    localStorage.setItem("access", json.access);
    localStorage.setItem("refresh", json.refresh);
    await router.push('/workspace')
  }else {
    alert('Ошибка: ' + (status));
  }
}
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: row;
  background-image: url('@/assets/main.jpg');
  background-size: cover;
  height: 100%;
  width: 100%;
}

.button{
  width: 100%;
  background-color: #776d63;
}
.button:hover{
  background-color: #5c524f;
}
</style>
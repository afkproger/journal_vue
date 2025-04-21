<template>
<div class="register-form">
  <div class="left"></div>
  <div class="right">
    <div class="form-container">
      <h2>Регистрация</h2>
      <form @submit.prevent="submit(urls.REGISTER)">
        <input type="text" v-model="formData.first_name" placeholder="Имя" required>
        <input type="text" v-model="formData.last_name" name="last_name" placeholder="Фамилия" required>
        <input type="text" v-model="formData.middle_name" name="middle_name" placeholder="Отчество" required>
        <input type="text" v-model="formData.username" name="username" placeholder="Логин" required>
        <input type="email" v-model="formData.email" name="email" placeholder="Email" required>
        <input type="password" v-model="formData.password" name="password" placeholder="Пароль" required id="pass">
        <input type="password" placeholder="Повторите пароль" required id="repass">
        <button type="submit" class="button">Зарегистрироваться</button>
      </form>
    </div>
  </div>
</div>
</template>

<script setup>
import '@/assets/form.css'
import '@/assets/button.css'
import {reactive} from "vue";
import submitForm from '@/functions/submitForm'
import {useRouter} from "vue-router";
import urls from '@/URL'

const router = useRouter();

const formData = reactive({
  first_name: '',
  last_name: '',
  middle_name: '',
  username: '',
  email: '',
  password: '',

})
const checkPassword = () => {
  let pass = document.getElementById("pass").value;
  let  repass = document.getElementById("repass").value;
  let status = true;
  if (pass !== repass) {
    document.getElementById("pass").style.border = "1px solid red";
    document.getElementById("repass").style.border = "1px solid red";
    status = false;
  }

  return status;
}

async function submit(url) {
  let confirm = checkPassword();
  if (confirm) {
    const {status, json} = await submitForm(formData , url);
    if (status === true){
      console.log(json);
      await router.push('/login')
    }else {
      alert('Ошибка: ' + (status));
    }
  }else{
    alert("Пароли не совпадают");
  }
}

</script>

<style scoped>
.register-form {
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
<script setup>
import { ref } from "vue";
import { useAccountStore } from "@/stores/account";
const userStore = useAccountStore();
const email = ref('')
const forGot = async() =>{
  console.log(email.value)
  // await userStore.forgotPassword(email.value)
} 
</script>
<template>
  <div class="h-screen flex items-cente">
    <div class="flex-1 max-w-2xl p-4 shadow-2xl m-auto rounded-lg">
      <div class="text-2xl text-center md:font-bold">ลืมรหัสผ่าน</div>
      <div class="text-1xl text-center md:font-bold mt-5">กรุณากรอกอีเมล์</div>
      <div class="w-2/3 m-auto">
        <label class="form-control">
          <div class="label">
            <span class="label-text">อีเมล์</span>
          </div>
          <input type="text" placeholder="Email" class="input input-bordered" v-model="email"/>
        </label>

        <button class="btn btn-primary w-full my-2" @click="forGot()">ยืนยัน</button>
      </div>
    </div>
  </div>
</template>

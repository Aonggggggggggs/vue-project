<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import axios from "axios";
import { useAccountStore } from "@/stores/account";
import { useEventStore } from "@/stores/event";
import { useRouter, RouterLink } from "vue-router";

const userStore = useAccountStore();
const eventStore = useEventStore();
const checkUserData = ref(true);
const email = ref("");
const check = ref(false);
const sendEmail = ref(false);
const userData = reactive({
  email: null,
  userId: null,
  password: "",
});
const isValidEmail = computed(() => {
  return check.value
    ? /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email.value
      )
    : null;
});

onMounted(() => {
  sendEmail.value = false;
  const userData = localStorage.getItem("user-data");
  const adminData = localStorage.getItem("admin-data");
  if (userData) {
    checkUserData.value = false;
  } else if (adminData) {
    checkUserData.value = false;
  } else {
    checkUserData.value = true;
  }
});

const forGot = async () => {
  check.value = true;
  if (isValidEmail.value == true) {
    const data = await axios.get(
      `http://localhost:1337/api/users?filters[email][$eq]=${email.value}`
    );
    const email_data = data?.data;
    if (email_data.length > 0) {
      userData.userId = email_data[0]?.id;
      const generatePassword = () => {
        const length = 10;
        const charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

        let password = "";
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset[randomIndex];
        }

        return password;
      };
      const password = generatePassword();
      userData.password = password;
      userData.email = email.value;
      await userStore.resetPassword(userData);
      await userStore.sendEmail(userData);
      sendEmail.value = true;
    } else {
      eventStore.popupMessage("info", "อีเมล์นี้ไม่มีในระบบ");
    }
  }
};
</script>
<template>
  <div v-if="checkUserData === false"></div>
  <div class="h-screen flex items-cente" v-else>
    <div
      class="flex-1 max-w-2xl p-4 shadow-2xl m-auto rounded-lg"
      v-if="sendEmail === false"
    >
      <div class="text-2xl text-center md:font-bold">ลืมรหัสผ่าน</div>
      <div class="text-1xl text-center md:font-bold mt-5">กรุณากรอกอีเมล์</div>
      <div class="w-2/3 m-auto">
        <label class="form-control">
          <div class="label">
            <span class="label-text">อีเมล์</span>
            <span v-if="isValidEmail == false" class="text-xs"
              >กรอกอีเมล์ให้ถูกต้อง</span
            >
          </div>
          <input
            type="text"
            placeholder="Email"
            class="input input-bordered"
            v-model="email"
          />
        </label>

        <button class="btn btn-primary w-full my-2" @click="forGot()">
          ยืนยัน
        </button>
      </div>
    </div>
    <div class="flex-1 max-w-2xl p-4 shadow-2xl m-auto rounded-lg" v-else>
      <div class="text-2xl text-center md:font-bold">ลืมรหัสผ่าน</div>
      <div class="text-1xl text-center md:font-bold mt-5">
        กรุณาเช็คจดหมายในอีเมล์ของคุณ
        ระบบได้ส่งรหัสผ่านใหม่ไปทางอีเมล์ของคุณแล้ว
      </div>
      <div class="w-2/3 m-auto mt-10">
        <RouterLink to="/login"
          ><button class="btn btn-primary w-full my-2">
            เข้าสู่ระบบ
          </button></RouterLink
        >
      </div>
    </div>
  </div>
</template>

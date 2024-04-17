<script setup>
import { ref, computed, reactive ,onMounted } from "vue";
import axios from "axios";
import { useAccountStore } from "@/stores/account";
import { useEventStore } from "@/stores/event";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useAccountStore();
const eventStore = useEventStore();
const checkUserData = ref(true);
const email = ref("");
const check = ref(false);
const dropdown = ref(false);
const userData = reactive({
  userId: null,
  password: "",
  c_password: "",
});
const isValidEmail = computed(() => {
  return check.value
    ? /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email.value
      )
    : null;
});
const isValidPassword = computed(() => {
  return check.value
    ? /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z]).{8,}$/.test(
        userData.password
      )
    : null;
});
const isPasswordConfirmed = computed(() => {
  return check.value ? userData.password == userData.c_password : null;
});

onMounted(() => {
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
    console.log(email.value);
    const data = await axios.get(
      `http://localhost:1337/api/users?filters[email][$eq]=${email.value}`
    );
    console.log("email-data", data?.data);
    const email_data = data?.data;
    if (email_data.length > 0) {
      dropdown.value = true;
      userData.userId = email_data[0]?.id;
    } else {
      eventStore.popupMessage("info", "อีเมล์นี้ไม่มีในระบบ");
    }
  }
};
const resetPassword = async () => {
  check.value = true;
  if (isValidPassword.value == true && isPasswordConfirmed.value == true) {
    await userStore.resetPassword(userData);
    router.push("/login");
  } else {
    eventStore.popupMessage("info", "ข้อมูลไม่ถูกต้อง");
  }
};
</script>
<template>
  <div v-if="checkUserData === false"></div>
  <div class="h-screen flex items-cente" v-else>
    <div
      class="flex-1 max-w-2xl p-4 shadow-2xl m-auto rounded-lg"
      v-if="dropdown == false"
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
    <div
      class="flex-1 max-w-2xl p-4 shadow-2xl m-auto rounded-lg"
      v-if="dropdown == true"
    >
      <div class="text-2xl text-center md:font-bold">ลืมรหัสผ่าน</div>
      <div class="text-1xl text-center md:font-bold mt-5">
        กรุณากรอกรหัสผ่าน
      </div>
      <div class="w-2/3 m-auto">
        <label class="form-control">
          <div class="label">
            <span class="label-text">รหัสผ่าน</span>
            <span v-if="isValidPassword == false" class="text-xs"
              >กรอกรหัสผ่านให้ถูกต้อง</span
            >
          </div>
          <input
            type="password"
            placeholder="A-Z,a-z,!@#$&,0-9, 6ตัวอักษรขึ้นไป"
            class="input input-bordered"
            v-model="userData.password"
          />
          <div class="label">
            <span class="label-text">ยืนยันรหัสผ่าน</span>
            <span v-if="isPasswordConfirmed == false" class="text-xs"
              >ยืนยันรหัสผ่านไม่ถูกต้อง</span
            >
          </div>
          <input
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            class="input input-bordered"
            v-model="userData.c_password"
          />
        </label>

        <button class="btn btn-primary w-full my-2" @click="resetPassword()">
          ยืนยัน
        </button>
      </div>
    </div>
  </div>
</template>

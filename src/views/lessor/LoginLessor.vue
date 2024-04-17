<script setup>
import { ref, onMounted } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAccountStore } from "@/stores/account";
import { useEventStore } from "@/stores/event";

const eventStore = useEventStore();
const accountStore = useAccountStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const checkUserData = ref(true);

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

const login = async () => {
  if (email.value && password.value) {
    try {
      await accountStore.singInWithEmailPassword(email.value, password.value);
      if (accountStore.isAdmin == true) {
        eventStore.popupMessage("success", "เข้าสู่ระบบเสร็จสิ้น");
        router.push("/lessor/field");
      } else {
        eventStore.popupMessage("info", "สถานะของคุณคือ Player");
        localStorage.removeItem("user-data");
      }
    } catch (error) {
      console.log("Login", error);
      eventStore.popupMessage("info", "กรุณาข้อมูลให้ถูกต้อง");
    }
  }
};
</script>

<template>
  <div v-if="checkUserData === false"></div>
  <div class="h-screen flex items-cente" v-else>
    <div class="flex-1 max-w-2xl p-4 shadow-2xl m-auto rounded-lg">
      <div class="text-2xl text-center md:font-bold">เข้าสู่ระบบ</div>
      <div class="w-2/3 m-auto">
        <label class="form-control">
          <div class="label">
            <span class="label-text">อีเมล์</span>
          </div>
          <input
            type="text"
            placeholder="อีเมล์ หรือ ชื่อผู้ใช้"
            class="input input-bordered"
            v-model="email"
          />
          <div class="label">
            <span class="label-text">รหัสผ่าน</span>
          </div>
          <input
            type="password"
            placeholder="รหัสผ่าน"
            class="input input-bordered"
            v-model="password"
          />
        </label>

        <button class="btn btn-neutral w-full my-2" @click="login()">
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAccountStore } from "@/stores/account";
import { RouterLink, useRouter } from "vue-router";
import { useEventStore } from "@/stores/event";

const eventStore = useEventStore();
const accountStore = useAccountStore();

const email = ref("");
const password = ref("");
const router = useRouter();

const login = async () => {
  if (email.value && password.value) {
    try {
      await accountStore.singInWithEmailPassword(email.value, password.value);
      if (accountStore.isAdmin == true) {
        eventStore.popupMessage("error", "สถานะของคุณคือ Admin");
        localStorage.removeItem("admin-data");
      } else {
        eventStore.popupMessage("success", "เข้าสู่ระบบเสร็จสิ้น");
        router.push("/");
      }
    } catch (error) {
      console.log("Login", error);
      eventStore.popupMessage("error", "กรุณาข้อมูลให้ถูกต้อง");
    }
  }
};
</script>
<template>
  <div class="h-screen flex items-cente">
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

        <button class="btn btn-primary w-full my-2" @click="login()">
          เข้าสู่ระบบ
        </button>
        <div class="label">
          <RouterLink to="/forget" class="label-text underline"
            >ลืมรหัสผ่าน</RouterLink
          >
          <RouterLink to="/register" class="font-normal md:font-bold"
            >สมัครสมาชิก</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

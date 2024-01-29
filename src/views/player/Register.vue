<script setup>
import { useAccountStore } from "@/stores/account";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useEventStore } from "@/stores/event";
const router = useRouter();
const eventStore = useEventStore();
const accountStore = useAccountStore();
const username = ref("");
const email = ref("");
const password = ref("");
const c_password = ref("");
const phone = ref("");

const register = async () => {
  console.log(username.value, email.value, password.value, phone.value);
  if (password.value == c_password.value) {
    try {
      await accountStore.singUpWithEmailPassword(
        email.value,
        password.value,
        username.value,
        phone.value
      );
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }
  eventStore.popupMessage("error", "รหัสไม่ตรงกัน");
};
</script>
<template>
  <div class="h-screen flex items-cente">
    <div class="flex-1 max-w-2xl p-4 shadow-2xl m-auto rounded-lg">
      <div class="text-2xl text-center md:font-bold">สมัครสมาชิก</div>
      <div class="w-2/3 m-auto">
        <label class="form-control">
          <div class="label">
            <span class="label-text">ชื่อผู้ใช้</span>
          </div>
          <input
            type="text"
            placeholder="username"
            class="input input-bordered"
            v-model="username"
          />
          <div class="label">
            <span class="label-text">อีเมล์</span>
          </div>
          <input
            type="text"
            placeholder="Email"
            class="input input-bordered"
            v-model="email"
          />
          <div class="label">
            <span class="label-text">เบอร์โทร</span>
          </div>
          <input
            type="text"
            placeholder="tel."
            class="input input-bordered"
            v-model="phone"
          />
          <div class="label mt-10">
            <span class="label-text">รหัสผ่าน</span>
          </div>
          <input
            type="password"
            placeholder="password"
            class="input input-bordered"
            v-model="password"
          />
          <div class="label">
            <span class="label-text">ยืนยันรหัสผ่าน</span>
          </div>
          <input
            type="password"
            placeholder="password"
            class="input input-bordered"
            v-model="c_password"
          />
        </label>
        <button class="btn btn-primary w-full my-10" @click="register()">
          สมัครสมาชิก
        </button>
      </div>
    </div>
  </div>
</template>

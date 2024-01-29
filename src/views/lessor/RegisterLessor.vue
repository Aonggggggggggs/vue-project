<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");

const register = async () => {
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
            <input type="text" placeholder="username" class="input input-bordered" />
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
            <input type="text" placeholder="tel." class="input input-bordered" />
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
            />
        </label>
        <button class="btn btn-neutral w-full my-10" @click="register()">
          สมัครสมาชิก
        </button>
      </div>
    </div>
  </div>
</template>

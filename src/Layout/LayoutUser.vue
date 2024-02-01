<script setup>
import { RouterLink } from "vue-router";
import { useAccountStore } from "@/stores/account";

const userStore = useAccountStore();

console.log("username", userStore?.user?.user);
</script>
<template>
  <div>
    <div class="container mx-auto">
      <div class="navbar bg-base-100 drop-shadow-xl">
        <div class="flex-1">
          <div class="w-12 rounded-full">
            <img alt="Lenball" src="@/assets/logo.png" />
          </div>
        </div>
        <div class="flex-none gap-10">
          <RouterLink to="/select_room">เลือกห้อง</RouterLink>
          <RouterLink to="/create_room">สร้างห้อง</RouterLink>
          <RouterLink to="/room">ห้อง</RouterLink>
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-wide bg-amber-300">
              <!-- {{ userStore?.user.user.username }} -->
            </div>
            <ul
              tabindex="0"
              class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <RouterLink to="/profile">โปรไฟล์</RouterLink>
              </li>
              <li><RouterLink to="/notification">แจ้งเตือน</RouterLink></li>
              <li><a>ออกจากระบบ</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <slot></slot>
    <div class="container mx-auto">
      <footer class="footer footer-center p-10 bg-primary text-primary-content">
        <aside>
          <p>Copyright © 2024 - Lenball</p>
        </aside>
      </footer>
    </div>
  </div>
</template>

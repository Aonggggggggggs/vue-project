<script setup>
import { RouterLink } from "vue-router";
import { onMounted } from "vue";
import { useAccountStore } from "@/stores/account";
import { useRouter } from "vue-router";
import { useRequeststore } from "@/stores/user/create_request";

const userRequest = useRequeststore();
const router = useRouter();
const userStore = useAccountStore();

onMounted(async () => {
  console.log("onMounted");
  await userStore.checkUser();
  console.log("user", userStore?.user?.user);
});
const logOut = async () => {
  const count = userRequest.requested.length;
  userRequest.requested.splice(0, count);
  console.log("ลบ", userRequest.requested);
  router.push("/login");
};
</script>
<template>
  <div>
    <div class="container mx-auto">
      <div class="navbar bg-base-100 drop-shadow-xl">
        <div class="flex-1">
          <RouterLink to="/"
            ><div class="w-12 rounded-full">
              <img alt="Lenball" src="@/assets/logo.png" /></div
          ></RouterLink>
        </div>
        <div class="flex-none gap-10">
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button">สร้างคำร้อง</div>
            <ul
              tabindex="0"
              class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <RouterLink to="/create_rent">เช่าแบบธรรมดา</RouterLink>
              </li>
              <li>
                <RouterLink to="/create_regular_rent">เช่าแบบประจำ</RouterLink>
              </li>
              <li>
                <RouterLink to="/create_day_rent">เช่าแบบเหมาวัน</RouterLink>
              </li>
            </ul>
          </div>
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button">คำร้องการเช่า</div>
            <ul
              tabindex="0"
              class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <RouterLink to="/request">คำร้องการเช่าแบบธรรมดา</RouterLink>
              </li>
              <li>
                <RouterLink to="">คำร้องการเช่าแบบประจำ</RouterLink>
              </li>
              <li>
                <RouterLink to="/request_dayrent"
                  >คำร้องการเช่าแบบเหมาวัน</RouterLink
                >
              </li>
            </ul>
          </div>

          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-wide bg-amber-300">
              {{ userStore?.user?.user?.username }}
            </div>
            <ul
              tabindex="0"
              class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <RouterLink to="/profile">โปรไฟล์</RouterLink>
              </li>
              <li><RouterLink to="/notification">แจ้งเตือน</RouterLink></li>
              <li><a @click="logOut()">ออกจากระบบ</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <slot></slot>
    <div class="container mx-auto">
      <!-- <footer class="footer footer-center p-10 bg-primary text-primary-content">
        <aside>
          <p>Copyright © 2024 - Lenball</p>
        </aside>
      </footer> -->
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { onMounted, computed, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import { useRouter } from "vue-router";
import { useRequeststore } from "@/stores/user/create_request";

const userRequest = useRequeststore();
const router = useRouter();
const userStore = useAccountStore();

const filteredRequestsPayed = computed(() => {
  return userRequest?.requested.filter((request) => {
    return request.status_request === "P" || request.status_request === "W";
  });
});
const filteredRequestsIn = computed(() => {
  return userRequest?.requested.filter((request) => {
    return request.status_request === "I";
  });
});

onMounted(async () => {
  console.log("onMounted");
  await userStore.checkUser();
  console.log("user nav", userStore?.user?.user.id);
  const userId = userStore?.user?.user.id;
  await userRequest.loadRequest(userId);
  const data = userRequest?.requested.filter((request) => {
    return request.status_request === "P" || request.status_request === "W";
  });
  console.log("data", data);
});
const setToPay = () => {
  const status = "I";
  localStorage.setItem("status", status);
};
const logOut = async () => {
  const count = userRequest.requested.length;
  userRequest.requested.splice(0, count);
  console.log("ลบ", userRequest.requested);
  await userStore.logOut();
  router.push("/login");
};
</script>
<template>
  <div>
    <div class="container mx-auto">
      <div class="navbar bg-base-100 drop-shadow-xl">
        <div class="flex-1 gap-4">
          <RouterLink to="/"
            ><div class="w-12 rounded-full">
              <img alt="Lenball" src="@/assets/logo.png" /></div
          ></RouterLink>

          <RouterLink to="/notification"
            ><button class="btn btn-ghost">
              เล่นเลย
              <div
                class="badge badge-primary"
                v-if="filteredRequestsPayed.length > 0"
              >
                +{{ filteredRequestsPayed.length }}
              </div>
            </button></RouterLink
          >

          <RouterLink to="/request_regular"
            ><button class="btn btn-ghost" @click="setToPay()">
              ชำระเงิน
              <div
                class="badge badge-info"
                v-if="filteredRequestsIn.length > 0"
              >
                +{{ filteredRequestsIn.length }}
              </div>
            </button></RouterLink
          >
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
                <RouterLink to="/request_regular"
                  >คำร้องการเช่าแบบประจำ</RouterLink
                >
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
              {{ userStore?.user?.user?.name }}
            </div>
            <ul
              tabindex="0"
              class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <RouterLink to="/profile">โปรไฟล์</RouterLink>
              </li>
              <li><a @click="logOut()">ออกจากระบบ</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { RouterLink, useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useAccountStore } from "@/stores/account";
import { useRouter } from "vue-router";

const router = useRouter();
const adminStore = useAccountStore();
const menus = [
  {
    name: "สร้างสนาม",
    route_name: "create_field",
  },
  {
    name: "สนาม",
    route_name: "field",
  },
  {
    name: "เช่าสนาม",
    route_name: "rent",
  },
  {
    name: "โปรไฟล์",
    route_name: "profile_lessor",
  },
  {
    name: "แจ้งเตือน",
    route_name: "notification_lessor",
  },
];
const route = useRoute();
const activeMenu = ref("");

onMounted(() => {
  activeMenu.value = route.name;
});
const logOut = async () => {
  await adminStore.logOut();
  router.push("/lessor/login");
};
</script>
<template>
  <div>
    <div class="drawer drawer-open">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <slot></slot>
      </div>
      <div class="drawer-side">
        <label
          for="my-drawer-2"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li class="text-3xl font-bold"><a>Lessor</a></li>
          <li v-for="menu in menus">
            <RouterLink
              :class="menu.route_name === activeMenu ? 'active' : ''"
              :to="{ name: menu.route_name }"
              >{{ menu.name }}</RouterLink
            >
          </li>
          <li class=""><a @click="logOut()">ออกจากระบบ</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import layoutUser from "@/Layout/LayoutUser.vue";
import { useRequeststore } from "@/stores/user/create_request";
import { useAccountStore } from "@/stores/account";
import Map from "@/components/icon/Map.vue";
import dayjs from "dayjs";

const userStore = useAccountStore();
const userRequest = useRequeststore();

const checkUserData = ref(true);

onMounted(async () => {
  const userData = localStorage.getItem("user-data");
  const adminData = localStorage.getItem("admin-data");
  if (userData) {
    checkUserData.value = true;
  } else if (adminData) {
    checkUserData.value = false;
  } else {
    checkUserData.value = false;
  }
  const userId = userStore?.user?.user?.id;
  await userRequest.loadRequest(userId);
  console.log("requested", userRequest?.requested);
});

const filteredRequests = computed(() => {
  return userRequest?.requested.filter((request) => {
    return request.status_request === "P" || request.status_request === "W";
  });
});

const formattedTime = (time) => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};
</script>
<template>
  <main>
    <div v-if="checkUserData === false"></div>
    <layoutUser v-else>
      <div>
        <div class="flex-1 text-2xl text-center md:font-bold mt-3">
          แจ้งเตือนการเช่า
        </div>
        <div class="grid container w-3/4 m-auto mt-10">
          <div class="flex flex-col">
            <div
              v-for="request in filteredRequests"
              class="w-full bg-base-100 shadow-xl m-5"
            >
              <div class="p-5 bg-primary rounded">
                {{ request.name }} คุณได้จองสนามฟุตบอล
                {{ request.field_detail.type }}
                <div
                  v-if="request.type_request === 'เช่าแบบเหมาวัน'"
                  class="flex gap-1"
                >
                  ในวันที่:
                  <div class="grid grid-cols-7 gap-2 w-2/3 text-center">
                    <div
                      v-for="days in request?.date_range"
                      class="bg-base-100 rounded"
                    >
                      {{ dayjs(`${days}`).format("DD/MM/YYYY") }}
                    </div>
                  </div>
                </div>
                <div v-else class="flex">
                  ในวันที่:
                  <div class="bg-base-100 rounded ml-1 mr-1 pl-1 pr-1">
                    {{ dayjs(`${request?.rent_date}`).format("DD/MM/YYYY") }}
                  </div>
                  ในเวลา:
                  <div class="bg-base-100 rounded ml-1 pl-1 pr-1">
                    {{ formattedTime(request?.start_rent_time) }} -
                    {{ formattedTime(request?.end_rent_time) }}
                  </div>
                </div>
                <p class="text-lg flex justify-between">
                  อย่าลืมละ !!!
                  <a
                    href="https://maps.app.goo.gl/QHuWPbmkDvSv9wQJ7"
                    target="_blank"
                    ><Map></Map
                  ></a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </layoutUser>
  </main>
</template>

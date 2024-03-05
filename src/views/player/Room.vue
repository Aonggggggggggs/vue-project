<script setup>
import layoutUser from "@/Layout/LayoutUser.vue";
import { onMounted, ref, computed } from "vue";
import { RouterLink } from "vue-router";
import Trash from "@/components/icon/Trash.vue";
import Table from "@/components/Table.vue";
import { useRequeststore } from "@/stores/user/create_request";
import { useAccountStore } from "@/stores/account";

const userStore = useAccountStore();
const userRequest = useRequeststore();
const selectedStatus = ref("All");

onMounted(async () => {
  const userId = userStore?.user?.user?.id;
  await userRequest.loadRequest(userId);
  console.log("requested", userRequest?.requested);
});
const formattedTime = (time) => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};
const deleteRequest = async (requestId) => {
  try {
    await userRequest.removeRequest(requestId);
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

const filteredRequests = computed(() => {
  const statusFilter = selectedStatus.value;
  return userRequest?.requested.filter((request) => {
    return statusFilter === "All" || request.status_request === statusFilter;
  });
});
</script>
<template>
  <main>
    <layoutUser>
      <div>
        <div class="flex-1 text-2xl text-center md:font-bold mt-3">
          รายการเช่า
        </div>
        <div class="pl-10 mt-10">
          <label for="statusFilter">เลือกตามสถานะ: </label>
          <select
            v-model="selectedStatus"
            id="statusFilter"
            class="select select-bordered max-w-xs"
          >
            <option value="All">All</option>
            <option value="Done">Done</option>
            <option value="In Progress">In Progress</option>
            <option value="Paying">Paying</option>
          </select>
        </div>
        <Table
          :headers="[
            'รูป',
            'ประเภท',
            'ราคา',
            'วันที่เช่า',
            'เวลาเช่า',
            'สถานะ',
            '',
          ]"
          class="mt-10 font-semibold"
        >
          <tr v-for="request in filteredRequests">
            <td>
              <div class="avatar">
                <div class="w-24 rounded">
                  <img
                    :src="
                      'http://localhost:1337' + request?.field_detail?.img?.url
                    "
                  />
                </div>
              </div>
            </td>
            <td>{{ request?.field_detail?.type }}</td>
            <td>{{ request?.field_detail?.price }} บ.</td>
            <td>{{ request?.rent_date }}</td>
            <td>
              {{ formattedTime(request?.start_rent_time) }} น. -
              {{ formattedTime(request?.end_rent_time) }}
              น.
            </td>
            <td
              :class="{
                'btn btn-success mt-9': request?.status_request === 'Done',
                'btn btn-secondary mt-9':
                  request?.status_request === 'In Progress',
                'btn btn-primary mt-9': request?.status_request === 'Paying',
              }"
            >
              {{ request?.status_request }}
            </td>
            <td>
              <div
                class="flex gap-2"
                v-if="request?.status_request === 'In Progress'"
              >
                <RouterLink
                  :to="{ name: 'room', params: { id: request.id } }"
                  class="btn btn-ghost"
                >
                  จ่ายเงิน
                </RouterLink>
                <div class="btn btn-ghost" @click="deleteRequest(request.id)">
                  <Trash></Trash>
                </div>
              </div>
            </td>
          </tr>
        </Table></div
    ></layoutUser>
  </main>
</template>

<script setup>
import layoutUser from "@/Layout/LayoutUser.vue";
import { onMounted, ref, computed } from "vue";
import Table from "@/components/Table.vue";
import { useRequeststore } from "@/stores/user/create_request";
import { useAccountStore } from "@/stores/account";
import "dayjs/locale/th";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Bangkok");

const userStore = useAccountStore();
const userRequest = useRequeststore();
const selectedStatus = ref("Payed");
const date = dayjs().format("YYYY-MM-DD");
const dateNow = dayjs().format("DD/MM/YYYY");

onMounted(async () => {
  const userId = userStore?.user?.user?.id;
  await userRequest.loadRequest(userId);
  console.log("requested", userRequest?.requested);
});
const changeRequest = async (requestId) => {
  try {
    await userRequest.cancelRequest(requestId);
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

const filteredRequests = computed(() => {
  const statusFilter = selectedStatus.value;
  return userRequest?.requested.filter((request) => {
    return (
      request.status_request === statusFilter &&
      request.type_request === "เช่าแบบเหมาวัน"
    );
  });
});
</script>
<template>
  <main>
    <layoutUser>
      <div>
        <div class="flex-1 text-2xl text-center md:font-bold mt-3">
          รายการเช่าแบบเหมาวัน
        </div>
        <div class="pl-10 mt-10">
          <label for="statusFilter">เลือกตามสถานะ : </label>
          <select
            v-model="selectedStatus"
            id="statusFilter"
            class="select select-bordered max-w-xs"
          >
            <option value="Payed">Payed</option>
            <option value="Done">Done</option>
            <option value="Cancel">Cancel</option>
            <option value="Canceling">Canceling</option>
          </select>
        </div>
        <div class="flex justify-end mr-24">
          <div class="badge badge-secondary badge-md">วันที่ {{ dateNow }}</div>
        </div>
        <Table
          :headers="[
            'รูป',
            'ประเภท',
            'ราคา',
            'วัน/เดือน/ปี ที่เช่า',
            'วันทั้งหมด',
            'สถานะ',
            '',
          ]"
          class="font-semibold"
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
            <td>{{ request?.price }} บ.</td>
            <td>
              <div v-for="days in request?.date_range">
                {{ dayjs(`${days}`).format("DD/MM/YYYY") }}
              </div>
            </td>
            <td>{{ request?.date_range.length }} วัน</td>
            <td
              :class="{
                'btn btn-success mt-9': request?.status_request === 'Done',
                'btn btn-error mt-9': request?.status_request === 'Cancel',
                'btn btn-primary mt-9': request?.status_request === 'Payed',
                'btn btn-warning mt-9': request?.status_request === 'Canceling',
              }"
            >
              {{ request?.status_request }}
            </td>
            <td>
              <div
                class="flex gap-2"
                v-if="request?.status_request === 'Payed'"
              >
                <div
                  v-if="
                    dayjs(request?.date_range[0]).diff(dayjs(date), 'day') >= 2
                  "
                  class="btn btn-ghost"
                  @click="changeRequest(request.id)"
                >
                  ยกเลิก
                </div>
              </div>
            </td>
          </tr>
        </Table>
      </div></layoutUser
    >
  </main>
</template>

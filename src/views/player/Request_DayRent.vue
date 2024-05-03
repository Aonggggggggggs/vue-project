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
const selectedStatus = ref("P");
const date = dayjs().format("YYYY-MM-DD");
const dateNow = dayjs().format("DD/MM/YYYY");

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
    <div v-if="checkUserData === false"></div>
    <layoutUser v-else>
      <div>
        <div class="flex-1 text-2xl text-center md:font-bold mt-3">
          รายการเช่าแบบเหมาวัน
        </div>
        <div class="label-text text-base pl-10 mt-10 flex gap-4">
          สถานะ :
          <div>
            <span class="text-base btn btn-primary">P ชำระเงินแล้ว</span>
          </div>
          <div>
            <span class="text-base btn btn-warning"
              >CI การยกเลิก(สามารถทำการยกเลิกได้ถึงก่อน 2 วันที่เล่น)</span
            >
          </div>
          <div>
            <span class="text-base btn btn-error">C การยกเลิกสำเร็จ</span>
          </div>
          <div>
            <span class="text-base btn btn-success"
              >D คำร้องขอเช่าสนามเสร็จสิ้นแล้ว</span
            >
          </div>
        </div>
        <div class="pl-10 mt-10">
          <label for="statusFilter">เลือกตามสถานะ : </label>
          <select
            v-model="selectedStatus"
            id="statusFilter"
            class="select select-bordered max-w-xs"
          >
            <option value="P">P</option>
            <option value="D">D</option>
            <option value="C">C</option>
            <option value="CI">CI</option>
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
            selectedStatus === 'P' ? 'ระยะเวลาวันยกเลิก' : '',
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
            <td>
              <div
                :class="{
                  'btn btn-success ': request?.status_request === 'D',
                  'btn btn-error ': request?.status_request === 'C',
                  'btn btn-primary ': request?.status_request === 'P',
                  'btn btn-warning': request?.status_request === 'CI',
                }"
              >
                {{ request?.status_request }}
              </div>
            </td>
            <td>
              <div class="flex gap-2" v-if="request?.status_request === 'P'">
                <div
                  v-if="
                    dayjs(request?.date_range[0]).diff(dayjs(date), 'day') >= 3
                  "
                  class="btn btn-ghost"
                  @click="changeRequest(request.id)"
                >
                  ยกเลิก
                </div>
              </div>
            </td>
            <td v-if="request?.status_request === 'P'">
              <div
                class="w-3/4"
                v-if="dayjs(request?.rent_date).diff(dayjs(date), 'day') >= 3"
              >
                <div
                  class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content w-1/2 text-center mb-2"
                >
                  <span class="font-mono text-5xl text-center">
                    {{ dayjs(request?.rent_date).diff(dayjs(date), "day") - 2 }}
                  </span>
                  วัน
                </div>
                (นับวันปัจจุบัน) <br />
                ระยะเวลายกเลิกถึงวันที่: <br />
                <div class="badge badge-warning gap-2">
                  {{
                    dayjs(request?.rent_date)
                      .subtract(3, "day")
                      .format("DD/MM/YYYY")
                  }}
                </div>
              </div>
            </td>
          </tr>
        </Table>
      </div></layoutUser
    >
  </main>
</template>

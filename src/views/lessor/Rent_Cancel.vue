<script setup>
import LayoutLessor from "@/Layout/LaoutLessor.vue";
import Table from "@/components/Table.vue";
import { useRequeststore } from "@/stores/user/create_request";
import { ref, onMounted, computed } from "vue";
import "dayjs/locale/th";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Bangkok");

const userRequest = useRequeststore();

const selectedStatus = ref("เช่าแบบธรรมดา");

onMounted(async () => {
  await userRequest.loadRequestCancel();
  console.log("request cancel", userRequest?.cancel);
});

const canceledRequest = async (requestId) => {
  try {
    await userRequest.canceledRequest(requestId);
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

const filteredRequests = computed(() => {
  const statusFilter = selectedStatus.value;
  return userRequest?.cancel?.filter((request) => {
    return request?.attributes?.type_request === statusFilter;
  });
});

const formattedTime = (time) => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};
</script>
<template>
  <LayoutLessor
    ><div>
      <div class="pl-10 mt-10">
        <label for="statusFilter">ประเภท : </label>
        <select
          v-model="selectedStatus"
          id="statusFilter"
          class="select select-bordered max-w-xs"
        >
          <option value="เช่าแบบธรรมดา">เช่าแบบธรรมดา</option>
          <option value="เช่าแบบประจำ">เช่าแบบประจำ</option>
          <option value="เช่าแบบเหมาวัน">เช่าแบบเหมาวัน</option>
        </select>
      </div>
      <Table
        :headers="[
          'ชื่อ',
          'เบอร์',
          'ประเภท',
          'ราคา',
          'วัน/เดือน/ปี ที่เช่า',
          selectedStatus === 'เช่าแบบเหมาวัน' ? '' : 'เวลาที่เช่า',
          'สถานะ',
          '',
        ]"
        class="font-semibold"
      >
        <tr v-for="request in filteredRequests">
          <td>{{ request?.attributes?.name }}</td>
          <td>{{ request?.attributes?.tel }}</td>
          <td>
            {{ request?.attributes?.field_detail?.data?.attributes?.type }}
          </td>
          <td>{{ request?.attributes?.price }} บ.</td>
          <td
            v-if="
              selectedStatus === 'เช่าแบบธรรมดา' ||
              selectedStatus === 'เช่าแบบประจำ'
            "
          >
            {{
              dayjs(`${request?.attributes?.rent_date}`).format("DD/MM/YYYY")
            }}
          </td>
          <td v-else>
            <div v-for="days in request?.attributes?.date_range">
              {{ dayjs(`${days}`).format("DD/MM/YYYY") }}
            </div>
          </td>
          <td
            v-if="
              selectedStatus === 'เช่าแบบธรรมดา' ||
              selectedStatus === 'เช่าแบบประจำ'
            "
          >
            {{ formattedTime(request?.attributes?.start_rent_time) }} น. -
            {{ formattedTime(request?.attributes?.end_rent_time) }}
            น.
          </td>
          <td>
            <div
              :class="{
                'btn btn-warning':
                  request?.attributes?.status_request === 'Canceling',
              }"
            >
              {{ request?.attributes?.status_request }}
            </div>
          </td>
          <td>
            <div class="btn btn-ghost" @click="canceledRequest(request.id)">
              คืนเงิน
            </div>
          </td>
        </tr></Table
      >
    </div></LayoutLessor
  >
</template>

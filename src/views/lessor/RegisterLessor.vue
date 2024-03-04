<template>
  <div>
    Testtttt
  </div>
</template>

<script setup>
import { ref } from "vue";
import dayjs from "dayjs";

const currentDate = dayjs();  // วันที่ปัจจุบัน
const selectedDate = dayjs('2024-03-07');  // วันที่เลือก

const differenceInDays = selectedDate.diff(currentDate, 'day');
console.log(differenceInDays)
</script>

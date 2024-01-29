<script setup>
import { defineProps } from "vue";
defineProps({
  headers: Array,
});
</script>
<template>
  <div class="overflow-x-auto pt-4">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th v-for="header in headers">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <slot></slot>
      </tbody>
    </table>
  </div>
</template>

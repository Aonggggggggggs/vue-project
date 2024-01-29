<script setup>
import { useRouter, useRoute, RouterLink } from "vue-router";
import layoutUser from "@/Layout/LayoutUser.vue";
</script>
<template>
  <main>
    <layoutUser>
      <div class="h-screen flex items-cente">
        <div class="flex-1 max-w-7xl p-4 shadow-2xl m-auto rounded-lg">
          <div class="flex-1 text-2xl text-center md:font-bold">สร้างห้อง</div>
          <div class="flex w-full mt-14" id="twoBox">
            <div class="w-1/2">
              <div class="label">
                <span class="label-text w-3/4">ชื่อห้อง</span>
              </div>
              <input
                type="text"
                placeholder="room name"
                class="input input-bordered w-3/4"
              />
              <div class="label">
                <span class="label-text w-3/4">คนที่มีอยู่</span>
              </div>
              <input type="number" class="input input-bordered w-3/4"/>
              <div class="label">
                <span class="label-text w-3/4">คนที่ต้องการ</span>
              </div>
              <input type="number" class="input input-bordered w-3/4" />
              <label class="form-control">
                <div class="label">
                  <span class="label-text">รายละเอียดเพิ่มเติม</span>
                </div>
                <textarea
                  class="textarea textarea-bordered h-20 w-3/4"
                  placeholder="Bio"
                ></textarea>
              </label>
            </div>
            <div class="w-1/2">
              <div class="label">
                <span class="label-text">สนาม</span>
              </div>
              <input type="text" class="input input-bordered w-3/4" />
              <div class="label">
                <span class="label-text">ประเภท</span>
              </div>
              <input
                type="text"
                placeholder="type"
                class="input input-bordered w-3/4"
              />
              <div class="label">
                <span class="label-text w-1/2">ราคา</span>
                <span class="label-text w-1/4">ชม.</span>
              </div>
              <input
                type="number"
                placeholder="pice"
                class="input input-bordered w-3/4"
              />
            </div>
          </div>
          <div class="flex mt-16 w-2/4 m-auto justify-between">
            <button class="btn btn-neutral w-32">ยืนยัน</button>
            <RouterLink :to="{ name: 'room' }" class="btn btn-ghost w-32"
              >กลับไปห้อง</RouterLink
            >
          </div>
        </div>
      </div></layoutUser
    >
  </main>
</template>
<style>
#twoBox {
  margin-left: 70px;
}
</style>

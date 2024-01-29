<script setup>
import layoutUser from "@/Layout/LayoutUser.vue";
</script>
<template>
  <main>
    <layoutUser>
      <div class="h-screen flex items-cente">
        <div class="flex-1 max-w-2xl p-4 shadow-2xl m-auto rounded-lg">
          <div class="text-2xl text-center md:font-bold">โปรไฟล์</div>
          <div class="w-2/3 m-auto">
            <label class="form-control">
              <div class="label">
                <span class="label-text">ชื่อผู้ใช้</span>
              </div>
              <input
                type="text"
                placeholder="Dome"
                class="input input-bordered"
              />
              <div class="label">
                <span class="label-text">เบอร์โทร</span>
              </div>
              <input
                type="text"
                placeholder="0987654321"
                class="input input-bordered"
              />
              <div class="label">
                <span class="label-text">อีเมล์</span>
              </div>
              <input
                type="text"
                placeholder="D@Email.com"
                class="input input-bordered"
              />
            </label>

            <button class="btn btn-primary w-full mt-10">บันทึก</button>
            <button
              class="btn btn-active w-full mt-2"
              onclick="my_modal_2.showModal()"
            >
              เปลี่ยนรหัสผ่าน
            </button>
            <dialog id="my_modal_2" class="modal">
              <div class="modal-box">
                <h3 class="font-bold text-lg">เปลี่ยนรหัสผ่าน</h3>
                <div class="label">
                  <span class="label-text">รหัสผ่านใหม่</span>
                </div>
                <input
                  type="password"
                  placeholder=""
                  class="input input-bordered w-full"
                />
                <div class="label">
                  <span class="label-text">ยืนยันรหัสผ่าน</span>
                </div>
                <input
                  type="password"
                  placeholder=""
                  class="input input-bordered w-full"
                />
                <div class="modal-action">
                  <form method="dialog">
                    <button class="btn btn-primary">ยืนยัน</button>
                  </form>
                  <form method="dialog">
                    <button class="btn">ยกเลิก</button>
                  </form>
                </div>
              </div>
            </dialog>
            <button
              class="btn btn-error w-full mt-2"
              onclick="my_modal_1.showModal()"
            >
              ลบบัญชี
            </button>
            <dialog id="my_modal_1" class="modal">
              <div class="modal-box">
                <h3 class="font-bold text-lg">ยืนยันการลบบัญชี</h3>
                <p class="py-4">
                  บัญชีนี้จะถูกลบแล้วไม่สามารถใช้งานได้อีกเลย คุณแน่ใจหรือไม่
                </p>
                <div class="modal-action">
                  <form method="dialog">
                    <button class="btn btn-primary">ยืนยัน</button>
                  </form>
                  <form method="dialog">
                    <button class="btn">ยกเลิก</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </layoutUser>
  </main>
</template>

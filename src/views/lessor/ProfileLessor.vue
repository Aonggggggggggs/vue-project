<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import LayoutLessor from "@/Layout/LaoutLessor.vue";
import { useAccountStore } from "@/stores/account";
import { useEventStore } from "@/stores/event";

const checkUserData = ref(true);
const adminStore = useAccountStore();
const eventStore = useEventStore();
const check = ref(false);

const userData = reactive({
  userId: null,
  name: "",
  tel: "",
  password: "",
  c_password: "",
});

const isValidName = computed(() => {
  return check.value ? /^(?=.*[ก-ฮ]).{5,}$/.test(userData.name) : null;
});

const isValidPassword = computed(() => {
  return check.value
    ? /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z]).{8,}$/.test(
        userData.password
      )
    : null;
});
const isPasswordConfirmed = computed(() => {
  return check.value ? userData.password == userData.c_password : null;
});

onMounted(async () => {
  const playerData = localStorage.getItem("user-data");
  const adminData = localStorage.getItem("admin-data");
  if (playerData) {
    checkUserData.value = false;
  } else if (adminData) {
    checkUserData.value = true;
  } else {
    checkUserData.value = false;
  }
  await adminStore.checkUser();
  console.log("admin-profile", adminStore?.user?.user);
  userData.userId = adminStore?.user?.user?.id;
  console.log("userData-form", userData);

  const userDataLocal = localStorage.getItem("admin-data");
  const editProfile = JSON.parse(userDataLocal);
  userData.name = editProfile?.user?.name;
});

const updateProfile = async () => {
  check.value = true;
  if (isValidName.value == true) {
    console.log("updateProfile");
    await adminStore.updateUser(userData);
    window.location.reload();
  } else {
    eventStore.popupMessage("info", "ข้อมูลไม่ถูกต้อง");
  }
};
const resetPassword = async () => {
  check.value = true;
  if (isValidPassword.value == true && isPasswordConfirmed.value == true) {
    await adminStore.resetPassword(userData);
    window.location.reload();
  } else {
    eventStore.popupMessage("info", "ข้อมูลไม่ถูกต้อง");
  }
};
</script>
<template>
  <main>
    <div v-if="checkUserData === false"></div>
    <LayoutLessor v-else>
      <div class="h-screen flex items-cente">
        <div class="flex-1 max-w-2xl p-4 shadow-2xl m-auto rounded-lg">
          <div class="text-3xl text-center md:font-bold">โปรไฟล์</div>
          <div class="w-2/3 m-auto">
            <label class="form-control">
              <div class="label">
                <span class="label-text">อีเมล์</span>
              </div>
              <input
                type="text"
                :placeholder="adminStore?.user?.user?.email"
                class="input input-bordered"
                disabled
              />
              <div class="label">
                <span class="label-text">ชื่อผู้ใช้</span>
              </div>
              <input
                type="text"
                :placeholder="adminStore?.user?.user?.username"
                class="input input-bordered"
                disabled
              />
              <div class="label">
                <span class="label-text">ชื่อจริง-นามสกุล</span>
                <span v-if="isValidName == false" class="text-xs"
                  >กรอกชื่อผู้ใช้ให้ถูกต้อง</span
                >
              </div>
              <input
                type="text"
                class="input input-bordered"
                v-model="userData.name"
              />
            </label>

            <button
              class="btn btn-neutral w-full mt-10"
              @click="updateProfile()"
            >
              บันทึก
            </button>
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
                  <span v-if="isValidPassword == false" class="text-xs"
                    >กรอกรหัสผ่านให้ถูกต้อง</span
                  >
                </div>
                <input
                  type="password"
                  placeholder="A-Z,a-z,!@#$&,0-9, 6ตัวอักษรขึ้นไป"
                  class="input input-bordered w-full"
                  v-model="userData.password"
                />
                <div class="label">
                  <span class="label-text">ยืนยันรหัสผ่าน</span>
                  <span v-if="isPasswordConfirmed == false" class="text-xs"
                    >ยืนยันรหัสผ่านไม่ถูกต้อง</span
                  >
                </div>
                <input
                  type="password"
                  placeholder="ยืนยันรหัสผ่าน"
                  class="input input-bordered w-full"
                  v-model="userData.c_password"
                />
                <div class="modal-action">
                  <button class="btn btn-neutral" @click="resetPassword()">
                    ยืนยัน
                  </button>
                  <form method="dialog">
                    <button class="btn">ยกเลิก</button>
                  </form>
                </div>
              </div>
            </dialog>
            <!-- <button
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
                    <button class="btn btn-neutral">ยืนยัน</button>
                  </form>
                  <form method="dialog">
                    <button class="btn">ยกเลิก</button>
                  </form>
                </div>
              </div>
            </dialog> -->
          </div>
        </div>
      </div>
    </LayoutLessor>
  </main>
</template>

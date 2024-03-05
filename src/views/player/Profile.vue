<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import layoutUser from "@/Layout/LayoutUser.vue";
import { useAccountStore } from "@/stores/account";
import { useEventStore } from "@/stores/event";

const userStore = useAccountStore();
const eventStore = useEventStore();
const router = useRouter();
const check = ref(false);

const userData = reactive({
  userId: null,
  username: "",
  tel: "",
  password: "",
  c_password: "",
});

const isValidUsername = computed(() => {
  return check.value
    ? /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{6,}$/.test(userData.username)
    : null;
});
const isValidPhone = computed(() => {
  return check.value ? /^(?=.*[0-9]).{10}$/.test(userData.tel) : null;
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
  console.log("user-profile", userStore?.user?.user);
  userData.userId = userStore?.user?.user?.id;
  console.log("userData-form", userData);

  const userDataLocal = localStorage.getItem("user-data");
  const editProfile = JSON.parse(userDataLocal);
  userData.username = editProfile?.user?.username;
  userData.tel = editProfile?.user?.tel;
});
const updateProfile = async () => {
  check.value = true;
  if (isValidUsername.value == true && isValidPhone.value == true) {
    console.log("updateProfile");
    await userStore.updateUser(userData);
    window.location.reload();
  } else {
    eventStore.popupMessage("error", "ข้อมูลไม่ถูกต้อง");
  }
};
const resetPassword = async () => {
  check.value = true;
  if (isValidPassword.value == true && isPasswordConfirmed.value == true) {
    await userStore.resetPassword(userData);
    window.location.reload();
  } else {
    eventStore.popupMessage("error", "ข้อมูลไม่ถูกต้อง");
  }
};
const deleteUser = async () => {
  await userStore.deleteUser(userData.userId);
  localStorage.removeItem("user-data");
  router.push("/login");
};
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
                <span class="label-text">อีเมล์</span>
              </div>
              <input
                type="text"
                :placeholder="userStore?.user?.user?.email"
                class="input input-bordered"
                disabled
              />
              <div class="label">
                <span class="label-text">ชื่อผู้ใช้</span>
                <span v-if="isValidUsername == false" class="text-xs"
                  >กรอกชื่อผู้ใช้ให้ถูกต้อง</span
                >
              </div>
              <input
                type="text"
                class="input input-bordered"
                v-model="userData.username"
              />
              <div class="label">
                <span class="label-text">เบอร์โทร</span>
                <span v-if="isValidPhone == false" class="text-xs"
                  >กรอกเบอร์โทรศัพท์ให้ถูกต้อง</span
                >
              </div>
              <input
                type="text"
                placeholder="0987654321"
                class="input input-bordered"
                v-model="userData.tel"
              />
            </label>

            <button
              class="btn btn-primary w-full mt-10"
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
                  <button class="btn btn-primary" @click="resetPassword()">
                    ยืนยัน
                  </button>

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
                    <button class="btn btn-primary" @click="deleteUser()">
                      ยืนยัน
                    </button>
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

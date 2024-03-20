import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/player/Home.vue";
import Profile from "../views/player/Profile.vue";
import Login from "../views/player/Login.vue";
import Register from "../views/player/Register.vue";
import Room from "../views/player/Room.vue";
import CreatRoom from "../views/player/CreateRoom.vue";
import SelectRoom from "../views/player/SelectRoom.vue";
import Noti from "../views/player/Noti.vue";
import Forget from "../views/player/Forget.vue";

import LoginLessor from "../views/lessor/LoginLessor.vue";
import RegisterLessor from "../views/lessor/RegisterLessor.vue";
import ProfileLessor from "../views/lessor/ProfileLessor.vue";
import CreateField from "../views/lessor/CreateField.vue";
import Field from "../views/lessor/Field.vue";
import Rent from "../views/lessor/Rent.vue";
import NotiLessor from "../views/lessor/NotiLessor.vue";
import Forget_Lessor from "../views/lessor/Forget_Lessor.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/room",
      name: "room",
      component: Room,
    },
    {
      path: "/create_room",
      name: "create_room",
      component: CreatRoom,
    },
    {
      path: "/create_room/:id",
      name: "edit_room",
      component: CreatRoom,
    },
    {
      path: "/select_room",
      name: "select_room",
      component: SelectRoom,
    },
    {
      path: "/notification",
      name: "notification",
      component: Noti,
    },
    {
      path: "/forget",
      name: "forget",
      component: Forget,
    },
    //lessor
    {
      path: "/lessor/login",
      name: "login_lessor",
      component: LoginLessor,
    },
    {
      path: "/lessor/register",
      name: "register_lessor",
      component: RegisterLessor,
    },
    {
      path: "/lessor/profile",
      name: "profile_lessor",
      component: ProfileLessor,
    },
    {
      path: "/lessor/create_field",
      name: "create_field",
      component: CreateField,
    },
    {
      path: "/lessor/edit_field/:id",
      name: "edit_field",
      component: CreateField,
    },
    {
      path: "/lessor/rent",
      name: "rent",
      component: Rent,
    },
    {
      path: "/lessor/field",
      name: "field",
      component: Field,
    },
    {
      path: "/lessor/notification_lessor",
      name: "notification_lessor",
      component: NotiLessor,
    },
    {
      path: "/lessor/forget_lessor",
      name: "forget_lessor",
      component: Forget_Lessor,
    },
  ],
});

export default router;

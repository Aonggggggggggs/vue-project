import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/player/Home.vue";
import Profile from "../views/player/Profile.vue";
import Login from "../views/player/Login.vue";
import Register from "../views/player/Register.vue";
import Request from "../views/player/Request.vue";
import Request_DayRent from "../views/player/Request_DayRent.vue";
import Request_Regular from "../views/player/Request_RegularRent.vue";
import CreatRent from "../views/player/Create_Rent.vue";
import CreatDayRent from "../views/player/Create_DayRent.vue";
import CreateRegularRent from "../views/player/Create_RegularRent.vue";
import Noti from "../views/player/Noti.vue";
import Forget from "../views/player/Forget.vue";

import LoginLessor from "../views/lessor/LoginLessor.vue";
import Rent_Cancel from "../views/lessor/Rent_Cancel.vue";
import ProfileLessor from "../views/lessor/ProfileLessor.vue";
import CreateField from "../views/lessor/CreateField.vue";
import Field from "../views/lessor/Field.vue";
import Rent from "../views/lessor/Rent.vue";


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
      path: "/request",
      name: "request",
      component: Request,
    },
    {
      path: "/request_dayrent",
      name: "request_dayrent",
      component: Request_DayRent,
    },
    {
      path: "/request_regular",
      name: "request_regular",
      component: Request_Regular,
    },
    {
      path: "/create_rent",
      name: "create_rent",
      component: CreatRent,
    },
    {
      path: "/create_day_rent",
      name: "create_day_rent",
      component: CreatDayRent,
    },
    {
      path: "/create_regular_rent",
      name: "create_regular_rent",
      component: CreateRegularRent,
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
      path: "/lessor/rent_cancel",
      name: "rent_cancel",
      component: Rent_Cancel,
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
  ],
});

export default router;

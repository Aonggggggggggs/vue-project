import axios from "axios";
import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", {
  state: () => ({
    user: {},
    isLoggedIn: false,
    isAdmin: false,
  }),
  actions: {
    checkUser() {
      const userData = localStorage.getItem("user-data");
      if (userData) {
        this.user = JSON.parse(userData);
        this.isLoggedIn = true;
      }
    },
    async singInWithEmailPassword(email, password) {
      const user = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: email,
        password: password,
      });
      console.log("profile", user?.data);
      console.log("token", user?.data?.jwt);
      const status_user = user?.data?.user?.status_user;
      if (status_user == "admin") {
        console.log("status_user", user?.data?.user?.status_user);
        this.isAdmin = true;
        localStorage.setItem("admin-data", JSON.stringify(user?.data));
      } else {
        console.log("status_user", user?.data?.user?.status_user);
        this.isAdmin = false;
        localStorage.setItem("user-data", JSON.stringify(user?.data));
      }
    },
    async singUpWithEmailPassword(email, password, username, phone) {
      try {
        const userRegister = await axios.post(
          "http://localhost:1337/api/auth/local/register",
          {
            username: username,
            email: email,
            password: password,
            tel: phone,
            status_user: "player",
          }
        );
        console.log("profile", userRegister?.data);
        console.log("token", userRegister?.data?.jwt);

        this.user = userRegister?.data;
      } catch (error) {
        console.log("Register", error);
      }
    },
    logOut() {
      const userData = localStorage.getItem("user-data");
      const adminData = localStorage.getItem("admin-data");
      if (userData || adminData) {
        localStorage.removeItem("user-data");
        localStorage.removeItem("admin-data");
        this.isLoggedIn = false;
      }
    },
    // async forgotPassword(email){
    //   try {
    //     const forgotPassword = await axios.post(
    //       "http://localhost:1337/api/auth/forgot-password",
    //       {
    //         email: email,
    //         // url:"http://localhost:1337/api/auth/reset-password",
    //       }
    //     );
    //     console.log("forgotPassword", forgotPassword?.data);
    //   } catch (error) {
    //     console.log("forgotPassword", error);
    //   }
    // }
  },
});

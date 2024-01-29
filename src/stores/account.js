import axios from "axios";
import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", {
  state: () => ({
    user: {},
    isLoggedIn: false,
  }),
  actions: {
    async singInWithEmailPassword(email, password) {
      try {
        const user = await axios.post("http://localhost:1337/api/auth/local", {
          identifier: email,
          password: password,
        });
        console.log("profile", user?.data);
        console.log("token", user?.data?.jwt);

        this.user = user?.data;
        this.isLoggedIn = true;
      } catch (error) {
        console.log("Login", error);
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
            TEL: phone,
          }
        );
        console.log("profile", userRegister?.data);
        console.log("token", userRegister?.data?.jwt);

        this.user = userRegister?.data;
      } catch (error) {
        console.log("Register", error);
      }
    },
  },
});

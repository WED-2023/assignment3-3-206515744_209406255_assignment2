import { reactive } from "vue";

const store = reactive({
  username: localStorage.getItem("username"),
  profilePic: localStorage.getItem("profilePic") || null,
  server_domain: "http://localhost:3000",

  login(username) {
    localStorage.setItem("username", username);
    this.username = username;
    console.log("login", this.username);
  },

  setProfilePic(pic) {
    this.profilePic = pic;
    if (pic) localStorage.setItem("profilePic", pic);
  },

  logout() {
    console.log("logout");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePic");
    this.username = undefined;
    this.profilePic = null;
  },
});

export default store;

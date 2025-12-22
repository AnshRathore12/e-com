import {create} from "zustand";
import axios from "../lib/axios";
import {toast } from "react-hot-toast";

export const useUserStore=create((set,get)=>({
  user:null,
  loading:false,
  checkingAuth:true,

  signup:async ({name,email,password,confirmPassword})=>{
    set({loading:true});
    if(password!==confirmPassword){
      toast.error("Passwords do not match");
      set({loading:false});
      return;
    }

    try {
      const res=await axios.post("/auth/signup",{name,email,password});
      set({user:res.data.user,loading:false});
      toast.success("Signup Successful");
    } catch (error) {

  set({ loading: false });

  const message =
    error.response?.data?.message ||
    error.message ||
    "An error occurred during signup";

  toast.error(message);
}
  },

  login:async(email,password)=>{
    set({loading:true});
    try {
      const res=await axios.post("/auth/login",{email,password});
      set({user:res.data,loading:false});
      toast.success("Login Successful");
    } catch (error) {
      set({ loading: false });

      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during login";

      toast.error(message);
    }
  },

  checkAuth:async()=>{
    set({checkingAuth:true});

    try {
      const response=await axios.get("/auth/profile");
      set({user:response.data,checkingAuth:false});

    } catch (error) {
      console.log("Auth check error:", error.response?.data?.message);
      set({user:null,checkingAuth:false});
    }
  },
  
  logout:async()=>{
    try {
      await axios.post("/auth/logout");
    set({user:null});
    toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out: "+ (error.response?.data?.message || error.message));
    }
    
  }


}))

// TODO:implement the axios interceptors for refreshing the access token
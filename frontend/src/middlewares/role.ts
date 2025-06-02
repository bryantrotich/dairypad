import { useAuthStore } from "@/stores";

export default (to: any, from: any, next: any) => {
    console.log(useAuthStore());
    const { auth: { token, user } } = useAuthStore();

    
    next();
}
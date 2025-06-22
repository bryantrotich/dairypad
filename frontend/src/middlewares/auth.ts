import { useAuthStore } from "@/stores";
import { isEmpty } from "lodash";

export const AuthMiddelware = (to: any, from: any, next: any) => {

    const { auth: authenticated } = useAuthStore();
    const { meta: { auth } }      = to;

    
    if( auth && !isEmpty(authenticated) ){
        return next();
    }

    if( auth && isEmpty(authenticated) ){
        // Redirect to login if the route requires authentication and user is not authenticated
        return next({ name: 'Login' });
    }

    if( !auth && !isEmpty(authenticated) ){
        // Redirect to home if the route does not require authentication but user is authenticated
        return next({ name: 'Overview' });
    }

    if( !auth && isEmpty(authenticated) ){
        // Allow access to public routes
        return next();
    }

}
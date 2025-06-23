import { useAuthStore } from "@/stores";
import { intersection, isEmpty } from "lodash";

export const AuthMiddelware = (to: any, from: any, next: any) => {

    const { auth: authenticated }        = useAuthStore();
    const { meta: { auth, permissions } } = to;

    if( !isEmpty(permissions) && isEmpty(intersection(authenticated.permissions,permissions)) ){
        return next({ name: 'Forbidden' });
    }
    
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
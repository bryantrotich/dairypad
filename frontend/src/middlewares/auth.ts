import { useAuthStore } from "@/stores";
import { isEmpty } from "lodash";

export default (to: any, from: any, next: any) => {

    const { auth: { token, user } } = useAuthStore();
    const { meta: { auth } }        = to;

    if( auth && !isEmpty(user) && !isEmpty(token) ){
        next();
    }

    if( auth && isEmpty(user) && isEmpty(token) && to.name !== 'login' ){
        // Redirect to login if the route requires authentication and user is not authenticated
        next({ name: 'Login' });
    }

    if( !auth && !isEmpty(user) && !isEmpty(token) ){
        // Redirect to home if the route does not require authentication but user is authenticated
        next({ name: 'Overview' });
    }

    if( !auth && isEmpty(user) && isEmpty(token) ){
        // Allow access to public routes
        next();
    }

}
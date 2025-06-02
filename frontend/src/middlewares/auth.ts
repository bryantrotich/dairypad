import { useAuthStore } from "@/stores";
import { debounce,isEmpty } from "lodash";

export default debounce(
    (to: any, from: any, next: any) => {

        const { auth: authenticated } = useAuthStore();
        const { meta: { auth } }      = to;

        console.log(authenticated)

        if( auth && !isEmpty(authenticated) ){
            next();
        }

        if( auth && isEmpty(authenticated) && to.name !== 'login' ){
            // Redirect to login if the route requires authentication and user is not authenticated
            next({ name: 'Login' });
        }

        if( !auth && !isEmpty(authenticated) ){
            // Redirect to home if the route does not require authentication but user is authenticated
            next({ name: 'Overview' });
        }

        if( !auth && isEmpty(authenticated) ){
            // Allow access to public routes
            next();
        }

    },200
)
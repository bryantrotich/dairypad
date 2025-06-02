import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { UserEntity } from 'src/database/entities';
import { omit } from 'lodash';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {

    listenTo() {
        return UserEntity;
    }

    /**
     * Called after entity is loaded.
     */
    afterLoad(user: UserEntity){
        user = omit(user,['password','token']);
    }

    /**
     * Called after entity update.
     */
    afterUpdate(event: UpdateEvent<any>) {
        event.entity = omit(event.entity,['password','token']);
    }
}
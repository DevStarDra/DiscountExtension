
import { FireBaseModel } from "./base";

class Store extends FireBaseModel
{
    constructor ()
    {
        super( "store" );
    }

}

export default new Store();
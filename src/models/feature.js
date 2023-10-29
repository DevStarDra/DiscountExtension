
import { FireBaseModel } from "./base";

class Feature extends FireBaseModel
{
    constructor ()
    {
        super( "featured" );
    }

}

export default new Feature();
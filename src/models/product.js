
import { FireBaseModel } from "./base";

class Product extends FireBaseModel
{
    constructor ()
    {
        super( "products" );
    }

    getByProductUrl = async ( product_url ) =>
    {
        const product = await this._getFilter( { _field: "product_urls", op: "array-contains", value: product_url } );
        return product;
    }
}

export default new Product();
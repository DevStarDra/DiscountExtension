var shadow_root;

function setSlickParameter ()
{
    try
    {
        chrome.runtime.sendMessage( { code: 2 }, ( result ) =>
        {
            shadow_root = document.getElementById( result ).shadowRoot;
            $( function ()
            {
                $( '.regular', shadow_root ).slick( {
                    dots: true,
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1
                } )
            } );

        } );
    } catch ( error )
    {

    }

}
setSlickParameter();

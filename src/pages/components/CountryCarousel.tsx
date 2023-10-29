import React, { useState } from "react";
import Slider from 'react-slick'
import { getURL } from "../../core/common";


const CountryCarousel = ({ datum, selectedItem, setSelectedItem }) => {
    const [clickable, setClickable] = useState(true)

    const settings = {
        infinite: false,
        dots: false,
        slidesToShow: 3.7,
        slidesToScroll: 1,
        arrows: false,
        afterChange: () => setClickable(true),
        beforeChange: () => setClickable(false),
        responsive: [{

            breakpoint: 780,
            settings: {
                slidesToShow: 3.7,
                infinite: false,
            }

        }, {

            breakpoint: 480,
            settings: {
                slidesToShow: 3.7,
                infinite: false,
            }

        }]
    };
    return <div style={{ marginTop: "2px" }}>
        <Slider className="pt-3" {...settings} style={{ height: "60px" }}>
            {datum.map((item, index) => {
                return <div key={index} className={item.value == selectedItem ? "coupon-country-selector-selected" : "coupon-country-selector"}
                    onClick={() => clickable && setSelectedItem(item.value)}
                > {item.label}
                </div>
            })}
        </Slider>
    </div>
}
export default CountryCarousel
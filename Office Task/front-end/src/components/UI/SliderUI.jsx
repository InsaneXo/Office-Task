import React from "react";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import Slider from "react-slick";

const SliderUI = ({ products }) => {
  const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          right: "-2px",
          zIndex: 1,
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <IoIosArrowDroprightCircle
          style={{ color: "black", fontSize: "40px" }}
        />
      </div>
    );
  };

  const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          left: "4px",
          zIndex: 1,
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <IoIosArrowDropleftCircle
          style={{ color: "black", fontSize: "40px" }}
        />
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  return (
    <div className="slider">
      <Slider {...settings}>
        {products?.map((item) => (
          <div key={item?._id} className={"images"}>
            <img src={item?.productImage} alt="image-alt" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderUI;

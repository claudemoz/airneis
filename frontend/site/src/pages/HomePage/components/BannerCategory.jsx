import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import styles from "./BannerCategory.module.css";

import image1 from "@/assets/images/banner/1.png";
import image2 from "@/assets/images/banner/2.png";
import image3 from "@/assets/images/banner/3.png";

export default function BannerCategory() {
  return (
    <Carousel
      className={`${styles.carousel}`}
      showArrows={false}
      autoPlay={true}
      interval={3600}
      infiniteLoop={true}
      showThumbs={false}
      showStatus={false}
    >
      <div>
        <img src={image1} />
      </div>
      <div>
        <img src={image2} />
      </div>
      <div>
        <img src={image3} />
      </div>
    </Carousel>
  );
}

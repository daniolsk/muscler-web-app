import Image from "next/image";
import React from "react";

import blob from "../public/images/blobs/blob.svg";
import blob2 from "../public/images/blobs/blob2.svg";
import blob3 from "../public/images/blobs/blob3.svg";
import blob4 from "../public/images/blobs/blob4.svg";

function BackgroundImages() {
  return (
    <>
      <Image
        className="absolute -top-[6%] -left-[50%] -z-40 w-full opacity-40 blur-2xl md:-top-[18%] lg:-top-[25%] 2xl:-top-[40%]"
        src={blob4}
      ></Image>
      <Image
        className="absolute -right-[50%] top-[17%] -z-40 w-full opacity-40 blur-2xl lg:top-[20%]"
        src={blob2}
      ></Image>
      <Image
        className="absolute -left-[50%] top-[45%] -z-40 w-full opacity-40 blur-2xl"
        src={blob}
      ></Image>
      <Image
        className="absolute -right-[50%] top-[75%] -z-40 w-full opacity-40 blur-2xl"
        src={blob3}
      ></Image>

      <Image
        className="absolute -top-[6%] -left-[50%] -z-50 w-full translate-x-3/4 translate-y-[350px] opacity-5  blur-2xl md:-top-[18%] lg:-top-[25%] 2xl:-top-[40%]"
        src={blob4}
      ></Image>
      <Image
        className="absolute -right-[50%] top-[17%] -z-50 w-full -translate-x-3/4 translate-y-[350px] opacity-5 blur-2xl lg:top-[20%]"
        src={blob2}
      ></Image>
      <Image
        className="absolute -left-[50%] top-[45%] -z-50 w-full translate-x-3/4 translate-y-[350px] opacity-5 blur-2xl"
        src={blob}
      ></Image>
      <Image
        className="absolute -right-[50%] top-[75%] -z-50 w-full -translate-x-3/4 translate-y-[350px] opacity-5 blur-2xl"
        src={blob3}
      ></Image>
    </>
  );
}

export default BackgroundImages;

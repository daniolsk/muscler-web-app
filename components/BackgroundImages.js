import Image from "next/image";
import React from "react";

import blob from "../public/images/blobs/blob.svg";
import blob2 from "../public/images/blobs/blob2.svg";
import blob3 from "../public/images/blobs/blob3.svg";
import blob4 from "../public/images/blobs/blob4.svg";

import blobb from "../public/images/blobs/blobb.svg";
import blob22 from "../public/images/blobs/blob22.svg";
import blob33 from "../public/images/blobs/blob33.svg";
import blob44 from "../public/images/blobs/blob44.svg";

function BackgroundImages() {
  return (
    <>
      <Image
        className="absolute -left-[50%] top-[45%] -z-40 w-full opacity-20 blur-2xl"
        src={blob}
        alt="background blob"
      ></Image>
      <Image
        className="absolute -right-[50%] top-[75%] -z-40 w-full opacity-20 blur-2xl"
        src={blob3}
        alt="background blob"
      ></Image>

      <Image
        className="absolute -left-[50%] top-[25%] -z-50 w-full translate-x-3/4 translate-y-[350px] opacity-10 blur-2xl"
        src={blobb}
        alt="background blob"
      ></Image>
      <Image
        className="absolute -right-[50%] top-[75%] -z-50 w-full -translate-x-3/4 translate-y-[350px] opacity-10 blur-2xl"
        src={blob33}
        alt="background blob"
      ></Image>
    </>
  );
}

export default BackgroundImages;

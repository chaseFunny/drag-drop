import { Data } from "@/app/type";
import Image from "next/image";
import { type FC, memo } from "react";

const ImageRender: FC<{ item: Data }> = ({ item }) => {
  // 去除 item.css 中的 定位属性
  const { left, top, ...css } = item?.css ?? {};
  return (
    <div className="ImageRender" style={css}>
      <Image
        alt={item.name}
        src={item.data?.value ?? ""}
        width={+(item.screenShot?.css.width + "").replace("px", "") ?? 80}
        height={+(item.screenShot?.css.height + "").replace("px", "") ?? 80}
      />
    </div>
  );
};

export default memo(ImageRender);

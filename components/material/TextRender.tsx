import { Data } from "@/app/type";
import { type FC, memo } from "react";

const TextRender: FC<{ item: Data }> = ({ item }) => {
  // 去除 item.css 中的 定位属性
  const { left, top, ...css } = item?.css ?? {};
  return (
    <div className="TextRender" style={css}>
      {item.data?.value ?? ""}
    </div>
  );
};

export default memo(TextRender);

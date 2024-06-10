"use client";
import { Data } from "@/app/type";
import { genUniqueId } from "@/lib/utils";
import { type FC, memo, useContext } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { TemplateContext } from "./ContextProvider/TemplateContext";
import { DragDropType } from "./DragWrapper";
import ImageRender from "./material/ImageRender";
import TextRender from "./material/TextRender";
import MoveableWrapper from "./MoveableWrapper";

const ComponentPanel: FC = () => {
  const templateContext = useContext(TemplateContext);
  const { template, setTemplate, setSelectElement } = templateContext ?? {};
  const [{ isOver, draggingColor, canDrop }, drop] = useDrop(() => ({
    accept: DragDropType,
    drop(_item: Data, monitor) {
      const delta = monitor.getClientOffset();

      // 获取 classname 为 EditorCanvas 的 div的 clientWidth 和 clientHeight
      const element = document.querySelector(".EditorCanvas") as HTMLDivElement;
      if (element && delta) {
        // 使用 getBoundingClientRect 方法获取元素的位置信息
        const rect = element.getBoundingClientRect();

        // 获取距离视口的左边距和上边距
        const left = delta?.x - rect.left - 40;
        const top = delta?.y - rect.top - 40;
        console.log(left, top, delta, rect, "top");
        const cloneItem = {
          ..._item,
          id: genUniqueId(),
          css: {
            ...(_item.css ?? {}),
            left: left,
            top: top,
          },
        };
        setTemplate?.({
          ...template,
          children: [...(template?.children ?? []), cloneItem],
        } as Data);
        setSelectElement?.(cloneItem.id);
      } else {
        console.log('未找到 class 为 "a" 的元素');
      }
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      draggingColor: monitor.getItemType() as string,
    }),
  }));

  return (
    <div className="ComponentPanel w-full min-h-[60vh] bg-gray-200">
      <div
        className="EditorCanvas bg-white mx-auto my-11"
        // @ts-ignore
        ref={drop}
        style={{ height: "1000px", width: "698px", position: "relative" }}
      >
        {template?.children?.map((component) => (
          <div
            data-id={component.id}
            onClick={() => setSelectElement?.(component.id)}
            key={component.id}
            style={{
              position: "absolute",
              display: "inline-block",
              left: component?.css?.left ?? 0,
              top: component?.css?.top ?? 0,
            }}
          >
            {component.data?.type === "text" && <TextRender item={component} />}
            {component.data?.type === "avatar" && (
              <ImageRender item={component} />
            )}
          </div>
        ))}
        <MoveableWrapper
          boundsDom={
            document.querySelector(
              ".EditorCanvas"
            ) as unknown as React.ReactElement
          }
        />
      </div>
    </div>
  );
};

export default memo(ComponentPanel);

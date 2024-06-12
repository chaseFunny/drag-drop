"use client";
import { deepClone } from "@/lib/utils";
import { type FC, useContext, useEffect, useRef } from "react";
import Moveable from "react-moveable";
import { TemplateContext } from "./ContextProvider/TemplateContext";

const MoveableWrapper: FC<{
  boundsDom: React.ReactElement;
}> = ({ boundsDom }) => {
  const templateContext = useContext(TemplateContext);
  const { selectElement, setTemplate, template }: any = templateContext ?? {};
  console.log(selectElement, boundsDom, "selectElement");

  const moveableRef = useRef<Moveable>(null);
  const moveAreaRef = useRef<any>(null);
  useEffect(() => {
    if (boundsDom) {
      moveAreaRef.current = boundsDom;
    }
  }, [boundsDom]);
  const updateItem = (id?: string, data?: Data) => {
    const cloneTemplate = deepClone(template);

    setTemplate?.({
      ...cloneTemplate,
      children: cloneTemplate?.children?.map((item: Data) => {
        if (item.id === id) {
          const i = {
            ...item,
            css: data?.css ?? item.css ?? {},
          };
          console.log(i, "iiii");
          // setSelectElement?.(i.id);
          return i;
        }
        return item;
      }),
    } as Data);
  };

  const selectElementData = template?.children?.filter(
    (ele: Data) => ele.id === selectElement
  )?.[0];

  return selectElementData?.id ? (
    <Moveable
      ref={moveableRef}
      // @ts-ignore
      target={document.querySelector(`[data-id="${selectElementData?.id}"]`)}
      draggable={true}
      resizable={true}
      snappable={true}
      className="moveable-item"
      bounds={{
        left: 0,
        top: 0,
        right: moveAreaRef.current?.clientWidth || 0,
        bottom: moveAreaRef.current?.clientHeight || 0,
      }}
      onDrag={({ target, left, top }) => {
        updateItem(selectElementData?.id, {
          css: {
            ...selectElementData.css,
            left: left,
            top: top,
          },
        });
      }}
      onResize={({ target, width, height, delta, direction }) => {
        // 直接修改目标元素的样式
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        updateItem(selectElementData?.id, {
          css: {
            ...selectElementData.css,
            width,
            height,
          },
        });
      }}
      onRender={({ target }) => {
        target.style.border = "1px solid blue";
      }}
      onRenderEnd={({ target }) => {
        target.style.border = ""; // 清除边框样式
      }}
      snapThreshold={5}
      elementGuidelines={template?.children?.map((ele: Data) => ({
        element: document.querySelector(`[data-id="${ele.id}"]`),
      }))}
      snapCenter={true}
      snapElement={true}
      snapVertical={true}
      snapHorizontal={true}
    />
  ) : null;
};

export default MoveableWrapper;

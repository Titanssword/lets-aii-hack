import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import G6 from "@antv/g6";

const G6component = () => {
  const ref = React.useRef(null);
  let graph = null;

  // const [result, setResult] = useState();

  async function onSubmit() {
    //   event.preventDefault();
    try {
      const selectedLabel = graph.findAllByState("node", "selected")[0].getModel().label;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: selectedLabel }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      // setResult(data.result);
      console.log(data.result.replace(/^\s+/, "").split(", "));
      // const result = data.result;
      const result = data.result.replace(/^\s+/, "").split(", ");
      handleExtend(result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  async function onInit() {
    //   event.preventDefault();
    try {
      const response = await fetch("https://copilot-for-mind.zeabur.app/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: "找工作有什么建议？" }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      // setResult(data.result);
      console.log(data)
      console.log(data.result);
      // const result = data.result;
      // const result = data.result.split(", ");
      // handleExtend(result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const { Util } = G6;

  G6.registerNode(
    "dice-mind-map-root",
    {
      jsx: (cfg) => {
        const width = Util.getTextSize(cfg.label, 16)[0] + 24;
        const stroke = cfg.style.stroke || "#096dd9";
        const fill = cfg.style.fill;

        return `
        <group>
          <rect draggable="true" style={{width: ${width}, height: 42, stroke: ${stroke}, radius: 4}} keyshape>
            <text style={{ fontSize: 16, marginLeft: 12, marginTop: 12 }}>${
              cfg.label
            }</text>
            <text style={{ marginLeft: ${
              width - 8
            }, marginTop: -20, stroke: '#66ccff', fill: '#000', cursor: 'pointer', opacity: ${
          cfg.hover ? 0.75 : 0
        } }} action="add">+</text>
        <text style={{ marginLeft: ${
          width - 4
        }, marginTop: -10, stroke: '#66ccff', fill: '#000', cursor: 'pointer', opacity: ${
          cfg.hover ? 0.75 : 0
        }, next: 'inline' }} action="delete">-</text>
          </rect>
        </group>
      `;
      },
      // getAnchorPoints() {
      //   return [
      //     [0, 0.5],
      //     [1, 0.5],
      //   ];
      // },
    },
    "single-node"
  );
  G6.registerNode(
    "dice-mind-map-sub",
    {
      jsx: (cfg) => {
        const width = Util.getTextSize(cfg.label, 14)[0] + 24;
        const color = cfg.color || cfg.style.stroke;

        return `
        <group>
          <rect draggable="true" style={{width: ${
            width + 24
          }, height: 22}} keyshape>
            <text draggable="true" style={{ fontSize: 14, marginLeft: 12, marginTop: 6 }}>${
              cfg.label
            }</text>


            <text style={{ marginLeft: ${
              width - 8
            }, marginTop: -10, stroke: ${color}, fill: '#000', cursor: 'pointer', opacity: ${
          cfg.hover ? 0.75 : 0
        }, next: 'inline' }} action="add">+</text>

          </rect>
          <rect style={{ fill: ${color}, width: ${
          width + 24
        }, height: 2, x: 0, y: 22 }} />
  
        </group>
      `;
      },
      getAnchorPoints() {
        return [
          [0, 0.965],
          [1, 0.965],
        ];
      },
    },
    "single-node"
  );
  G6.registerNode(
    "dice-mind-map-leaf",
    {
      jsx: (cfg) => {
        const width = Util.getTextSize(cfg.label, 12)[0] + 24;
        const color = cfg.color || cfg.style.stroke;

        return `
        <group>
          <rect draggable="true" style={{width: ${
            width + 20
          }, height: 26, fill: 'transparent' }}>
            <text style={{ fontSize: 12, marginLeft: 12, marginTop: 6 }}>${
              cfg.label
            }</text>
                <text style={{ marginLeft: ${
                  width - 8
                }, marginTop: -10, stroke: ${color}, fill: '#000', cursor: 'pointer', opacity: ${
          cfg.hover ? 0.75 : 0
        }, next: 'inline' }} action="add">+</text>
                <text style={{ marginLeft: ${
                  width - 4
                }, marginTop: -10, stroke: ${color}, fill: '#000', cursor: 'pointer', opacity: ${
          cfg.hover ? 0.75 : 0
        }, next: 'inline' }} action="delete">-</text>
          </rect>
          <rect style={{ fill: ${color}, width: ${
          width + 24
        }, height: 2, x: 0, y: 32 }} />
  
        </group>
      `;
      },
      getAnchorPoints() {
        return [
          [0, 0.965],
          [1, 0.965],
        ];
      },
    },
    "single-node"
  );

  G6.registerBehavior("dice-mindmap", {
    getEvents() {
      return {
        "node:click": "clickNode",
        "node:dblclick": "editNode",
        "node:mouseenter": "hoverNode",
        "node:mouseleave": "hoverNodeOut",
      };
    },
    clickNode(evt) {
      const model = evt.item.get("model");
      const name = evt.target.get("action");
      const graph = this.graph;
      graph.getNodes().forEach((node) => {
        graph.clearItemStates(node, ["selected"]);
      });
      graph.setItemState(model.id, "selected", true);
      const selected = graph.findAllByState("node", "selected");
      console.log(selected);
      switch (name) {
        case "add":
          console.log(evt.item);
          console.log(graph);
          const newId =
            model.id +
            "-" +
            (((model.children || []).reduce((a, b) => {
              const num = Number(b.id.split("-").pop());
              return a < num ? num : a;
            }, 0) || 0) +
              1);
          evt.currentTarget.updateItem(evt.item, {
            children: (model.children || []).concat([
              {
                id: newId,
                direction:
                  newId.charCodeAt(newId.length - 1) % 2 === 0
                    ? "right"
                    : "left",
                label: "New",
                type: "dice-mind-map-leaf",
                color:
                  model.color ||
                  colorArr[Math.floor(Math.random() * colorArr.length)],
              },
            ]),
          });
          evt.currentTarget.layout(false);
          break;
        case "delete":
          const parent = evt.item.get("parent");
          evt.currentTarget.updateItem(parent, {
            children: (parent.get("model").children || []).filter(
              (e) => e.id !== model.id
            ),
          });
          evt.currentTarget.layout(false);
          break;
        case "edit":
          break;
        default:
          return;
      }
    },
    editNode(evt) {
      const item = evt.item;
      const model = item.get('model');
      const {
        x,
        y
      } = item.calculateBBox();
      const graph = evt.currentTarget;
      const realPosition = evt.currentTarget.getClientByPoint(x, y);
      const el = document.createElement('div');
      const fontSizeMap = {
        'dice-mind-map-root': 16,
        'dice-mind-map-sub': 12,
        'dice-mind-map-leaf': 12,
      };
      el.style.fontSize = fontSizeMap[model.type] + 'px';
      el.style.position = 'fixed';
      el.style.top = realPosition.y + 'px';
      el.style.left = realPosition.x + 'px';
      el.style.paddingLeft = '12px';
      el.style.paddingTop = '12px';
      el.style.transformOrigin = 'top left';
      el.style.transform = `scale(${evt.currentTarget.getZoom()})`;
      const input = document.createElement('input');
      input.style.border = 'none';
      input.value = model.label;
      input.style.width = Util.getTextSize(model.label, fontSizeMap[model.type])[0] + 'px';
      input.className = 'dice-input';
      el.className = 'dice-input';
      el.appendChild(input);
      document.body.appendChild(el);
      const destroyEl = () => {
        document.body.removeChild(el);
      };
      const clickEvt = (event) => {
        if (!(event.target && event.target.classList.contains('dice-input'))) {

          window.removeEventListener('mousedown', clickEvt);
          window.removeEventListener('scroll', clickEvt);
          graph.updateItem(item, {
            label: input.value,
          });
          graph.layout(false);
          graph.off('wheelZoom', clickEvt);
          destroyEl();
        }
      };
      graph.on('wheelZoom', clickEvt);
      window.addEventListener('mousedown', clickEvt);
      window.addEventListener('scroll', clickEvt);
      input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
          clickEvt({
            target: {},
          });
        }
      });
    },
    hoverNode(evt) {
      evt.currentTarget.updateItem(evt.item, {
        hover: true,
      });
    },
    hoverNodeOut(evt) {
      evt.currentTarget.updateItem(evt.item, {
        hover: false,
      });
    },
  });

  G6.registerBehavior("scroll-canvas", {
    getEvents: function getEvents() {
      return {
        wheel: "onWheel",
      };
    },

    onWheel: function onWheel(ev) {
      const { graph } = this;
      if (!graph) {
        return;
      }
      if (ev.ctrlKey) {
        const canvas = graph.get("canvas");
        const point = canvas.getPointByClient(ev.clientX, ev.clientY);
        let ratio = graph.getZoom();
        if (ev.wheelDelta > 0) {
          ratio += ratio * 0.05;
        } else {
          ratio *= ratio * 0.05;
        }
        graph.zoomTo(ratio, {
          x: point.x,
          y: point.y,
        });
      } else {
        const x = ev.deltaX || ev.movementX;
        const y = ev.deltaY || ev.movementY || (-ev.wheelDelta * 125) / 3;
        graph.translate(-x, -y);
      }
      ev.preventDefault();
    },
  });

  const dataTransform = (data) => {
    const changeData = (d, level = 0, color) => {
      const data = {
        ...d,
      };
      switch (level) {
        case 0:
          data.type = "dice-mind-map-root";
          break;
        case 1:
          data.type = "dice-mind-map-sub";
          break;
        default:
          data.type = "dice-mind-map-leaf";
          break;
      }

      data.hover = false;

      if (color) {
        data.color = color;
      }

      if (level === 1 && !d.direction) {
        if (!d.direction) {
          data.direction =
            d.id.charCodeAt(d.id.length - 1) % 2 === 0 ? "right" : "left";
        }
      }

      if (d.children) {
        data.children = d.children.map((child) =>
          changeData(child, level + 1, data.color)
        );
      }
      return data;
    };
    return changeData(data);
  };

  const colorArr = [
    "#5B8FF9",
    "#5AD8A6",
    "#5D7092",
    "#F6BD16",
    "#6F5EF9",
    "#6DC8EC",
    "#D3EEF9",
    "#DECFEA",
    "#FFE0C7",
    "#1E9493",
    "#BBDEDE",
    "#FF99C3",
    "#FFE0ED",
    "#CDDDFD",
    "#CDF3E4",
    "#CED4DE",
    "#FCEBB9",
    "#D3CEFD",
    "#945FB9",
    "#FF9845",
  ];

  let treeData = {
    id: "root",
    label: "请输入你想要发散的主题",
    children: [
    //   {
    //     id: "SubTreeNode1",
    //     label: "subroot1",
    //     children: [
    //       {
    //         id: "SubTreeNode1.1",
    //         label: "subroot1.1",
    //       },
    //     ],
    //   },
    //   {
    //     id: "SubTreeNode2",
    //     label: "subroot2",
    //     children: [
    //       {
    //         id: "SubTreeNode2.1",
    //         label: "subroot2.1",
    //       },
    //       {
    //         id: "SubTreeNode2.2",
    //         label: "subroot2.2",
    //       },
    //     ],
    //   },
    ],
  };


  //   useEffect(() => {
  //     if (result) {
  //         console.log(graph);
  //     handleExtend();
  //     }
  //   }, [result]);

  // useEffect(() => {
  //   if (graph && result) {
  //     handleExtend();
  //   }
  //   console.log(graph);
  // }, [graph]);

  useEffect(() => {
    if (!graph) {
      const width = ref.current.scrollWidth;
      const height = ref.current.scrollHeight;
      graph = new G6.TreeGraph({
        container: ref.current,
        width: width,
        height: height,
        renderer: "svg",
        fitView: true,
        // fitCenter: true,
        fitViewPadding: [300,600,450,600],
        modes: {
          default: ["drag-canvas", "zoom-canvas", "dice-mindmap"],
        },
        defaultEdge: {
          shape: "cubic-horizontal",
          style: {
            stroke: "#A3B1BF",
          },
        },
        nodeStateStyles: {
          hover: {
            stroke: "#1890FF",
            lineWidth: 2,
            fill: "#000000A6",
          },
          selected: {
            stroke: "#00ffff",
            lineWidth: 2,
            fill: "#000000A6",
          },
        },

        defaultNode: {
          shape: "rect",
          labelCfg: {
            style: {
              fill: "#000000A6",
              fontSize: 10,
            },
          },
          style: {
            stroke: "#72CC4A",
            width: 150,
          },
        },
        layout: {
          type: "mindmap",
          direction: "LR",
          nodeSep: 50, // 节点之间间距
          rankSep: 200, // 每个层级之间的间距
          getHeight: () => {
            return 16;
          },
          getWidth: (node) => {
            return node.level === 0
              ? Util.getTextSize(node.label, 16)[0] + 12
              : Util.getTextSize(node.label, 12)[0];
          },
          getVGap: () => {
            return 10;
          },
          getHGap: () => {
            return 60;
          },
          getSide: (node) => {
            return node.data.direction;
          },
        },
        // layout: {
        //   type: "dendrogram", // 布局类型
        //   direction: "LR", // 自左至右布局，可选的有 H / V / LR / RL / TB / BT
        //   nodeSep: 50, // 节点之间间距
        //   rankSep: 200, // 每个层级之间的间距
        // },
      });
    }

    graph.data(dataTransform(treeData));
    graph.render();
    // graph.fitView();
  }, []);

  const handleChangeData = () => {
    const selected = graph.findAllByState("node", "selected")[0];
    graph.updateItem(selected, {
      label: "xxx",
      style: {
        fill: "red",
      },
    });
  };

  const handleExtend = (result) => {
    /// extend mind map
    const selected = graph.findAllByState("node", "selected")[0];
    // const node = graph.findById("SubTreeNode2");
    const model = selected.getModel();
    console.log(selected);
    // console.log(node);
    result.map((res, index) => {
      const newId =
        model.id +
        "-" +
        (((model.children || []).reduce((a, b) => {
          const num = Number(b.id.split("-").pop());
          return a < num ? num : a;
        }, 0) || 0) +
          index +
          1);
      graph.updateItem(selected, {
        children: (model.children || []).concat([
          {
            id: newId,
            direction:
              newId.charCodeAt(newId.length - 1) % 2 === 0 ? "right" : "left",
            label: res,
            type: "dice-mind-map-leaf",
            color:
              model.color ||
              colorArr[Math.floor(Math.random() * colorArr.length)],
          },
        ]),
      });
    });
    graph.layout(false);

    // graph.updateItem(node, {
    //   label: "xxx",
    //   style: {
    //     fill: "red",
    //   },
    // });
  };

  return (
    <div
      ref={ref}
      className="absolute w-full h-full border border-solid border-[#ccc]"
    >
      <button onClick={handleChangeData} className="bottom-0 absolute p-4">
        更新数据源
      </button>
      <button onClick={onSubmit} className="bottom-8 flex flex-row items-center gap-2 absolute p-4">
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9 0.499976C13.9 0.279062 13.7209 0.0999756 13.5 0.0999756C13.2791 0.0999756 13.1 0.279062 13.1 0.499976V1.09998H12.5C12.2791 1.09998 12.1 1.27906 12.1 1.49998C12.1 1.72089 12.2791 1.89998 12.5 1.89998H13.1V2.49998C13.1 2.72089 13.2791 2.89998 13.5 2.89998C13.7209 2.89998 13.9 2.72089 13.9 2.49998V1.89998H14.5C14.7209 1.89998 14.9 1.72089 14.9 1.49998C14.9 1.27906 14.7209 1.09998 14.5 1.09998H13.9V0.499976ZM11.8536 3.14642C12.0488 3.34168 12.0488 3.65826 11.8536 3.85353L10.8536 4.85353C10.6583 5.04879 10.3417 5.04879 10.1465 4.85353C9.9512 4.65827 9.9512 4.34169 10.1465 4.14642L11.1464 3.14643C11.3417 2.95116 11.6583 2.95116 11.8536 3.14642ZM9.85357 5.14642C10.0488 5.34168 10.0488 5.65827 9.85357 5.85353L2.85355 12.8535C2.65829 13.0488 2.34171 13.0488 2.14645 12.8535C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L9.14646 5.14642C9.34172 4.95116 9.65831 4.95116 9.85357 5.14642ZM13.5 5.09998C13.7209 5.09998 13.9 5.27906 13.9 5.49998V6.09998H14.5C14.7209 6.09998 14.9 6.27906 14.9 6.49998C14.9 6.72089 14.7209 6.89998 14.5 6.89998H13.9V7.49998C13.9 7.72089 13.7209 7.89998 13.5 7.89998C13.2791 7.89998 13.1 7.72089 13.1 7.49998V6.89998H12.5C12.2791 6.89998 12.1 6.72089 12.1 6.49998C12.1 6.27906 12.2791 6.09998 12.5 6.09998H13.1V5.49998C13.1 5.27906 13.2791 5.09998 13.5 5.09998ZM8.90002 0.499976C8.90002 0.279062 8.72093 0.0999756 8.50002 0.0999756C8.2791 0.0999756 8.10002 0.279062 8.10002 0.499976V1.09998H7.50002C7.2791 1.09998 7.10002 1.27906 7.10002 1.49998C7.10002 1.72089 7.2791 1.89998 7.50002 1.89998H8.10002V2.49998C8.10002 2.72089 8.2791 2.89998 8.50002 2.89998C8.72093 2.89998 8.90002 2.72089 8.90002 2.49998V1.89998H9.50002C9.72093 1.89998 9.90002 1.72089 9.90002 1.49998C9.90002 1.27906 9.72093 1.09998 9.50002 1.09998H8.90002V0.499976Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        Extend
      </button>
      <button onClick={onInit} className="bottom-16 absolute p-4">
        Init
      </button>
      {/* <div className="bottom-16 absolute p-4">{result}</div> */}
    </div>
  );
};

export default G6component;

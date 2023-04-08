import React from "react";
import cn from "classnames";
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
  } from "@heroicons/react/24/outline";

const Sidebar = (props) => {
  // 👇 use the correct icon depending on the state.
  const Icon = props.collapsed ? ChevronDoubleRightIcon : ChevronDoubleLeftIcon;
  return (
    <div
      className={cn({
        "bg-indigo-700 text-zinc-50 z-20": true,
      })}
    >
      <div
        className={cn({
          "flex flex-col justify-between": true,
        })}
      >
        {/* logo and collapse button */}
        <div
          className={cn({
            "flex items-center border-b border-b-indigo-800": true,
            "p-4 justify-between": !props.collapsed,
            "py-4 justify-center": props.collapsed,
          })}
        >
          {!props.collapsed && <span className="whitespace-nowrap">My Logo</span>}
          <button
            className={cn({
              "grid place-content-center": true, // position
              "hover:bg-indigo-800 ": true, // colors
              "w-10 h-10 rounded-full": true, // shape
            })}
            // 👇 set the collapsed state on click
            onClick={() => props.setCollapsed(!props.collapsed)}
          >
            <Icon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;

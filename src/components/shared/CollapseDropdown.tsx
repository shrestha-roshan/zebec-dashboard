import React, { FC, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";

type PositionStyle = "right" | "left";

interface CollapseDropdownProps {
  children: React.ReactNode;
  show: boolean;
  className?: string;
  position?: PositionStyle;
}

const getPositionStyle = (position: PositionStyle) => {
  switch (position) {
    case "left":
      return `left-0`;
    case "right":
      return `right-0`;
    default:
      return null;
  }
};

export const CollapseDropdown: FC<CollapseDropdownProps> = (props) => {
  const { children, show, className, position = "right" } = props;

  const positionStyle = getPositionStyle(position);
  const defaultClasses = `bg-background-light divide-y divide-outline-secondary top-10 ${positionStyle}`;

  return (
    <>
      <Transition
        as={Fragment}
        show={show}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-75"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-75"
      >
        <div
          className={twMerge(
            `absolute flex flex-col rounded-lg ${defaultClasses}`,
            className ?? "",
          )}
        >
          {children}
        </div>
      </Transition>
    </>
  );
};

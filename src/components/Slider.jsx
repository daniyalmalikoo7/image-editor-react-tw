import React from "react";

const Slider = ({
  name,
  min,
  max,
  value,
  active,
  handleClick,
  handleChange,
}) => {
  return (
    <div>
      <div
        onClick={handleClick}
        className={`${
          active ? "bg-gray-300" : ""
        } p-2 py-5 flex items-center hover:bg-gray-100 focus:bg-gray-200 border-b`}
      >
        <p className="flex items-center text-sm text-gray-700">
          {name}
          <span className="ml-1 mr-3 h-3 w-3 flex items-center justify-center bg-teal-400 text-white p-2  rounded-full text-xs">
            !
          </span>
          {value}
          {(name === "Hue" && "°") || (name === "Blur" && "px") || "%"}
        </p>
        <input
          className="w-[full] flex flex-grow appearance-none cursor-pointer ml-1 h-1 bg-teal-400 oultine-none rounded-md slider-thumb"
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
        />
        <hr />
      </div>
    </div>
  );
};

export default Slider;

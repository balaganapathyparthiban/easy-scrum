import React, { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { AiTwotoneDelete } from "react-icons/ai";
import PropTypes from "prop-types";

const MultipleInput = ({
  list,
  placeholder,
  onAdd = () => {},
  onDelete = () => {},
}) => {
  const [valueState, setValueState] = useState("");

  const changeHandler = () => {
    onAdd(valueState);
    setValueState("");
  };

  const deleteHandler = (index) => {
    onDelete(list.filter((_, i) => i != index));
  };

  return (
    <div className="w-full h-32 rounded border border-gray-300 shadow flex flex-col text-gray-800 relative">
      <input
        id="votingSystem"
        className="h-12 rounded-tl rounded-tr border-b outline-none px-2 text-sm"
        placeholder={placeholder}
        value={valueState}
        onChange={(event) => setValueState(event.target.value)}
      />
      <div
        className="absolute top-3 right-2 cursor-pointer"
        onClick={changeHandler}
      >
        <BsPlus fontSize={26} className="text-blue-400" />
      </div>
      <div className="w-full h-[calc(100%-3rem)] px-2 overflow-x-hidden overflow-y-auto">
        {list.map((el, index) => (
          <div
            key={[el.name, index].join("_")}
            className="flex flex-row justify-between items-center"
          >
            <p className="text-sm">{el.name}</p>
            <AiTwotoneDelete
              className="text-red-400 cursor-pointer"
              onClick={() => deleteHandler(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

MultipleInput.propTypes = {
  list: PropTypes.array,
  placeholder: PropTypes.string,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
};

export default MultipleInput;

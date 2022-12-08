import React from "react";
import { Link } from "react-router-dom";

export const UtilEventMenu = () => {
  return (
    <div className="UtilEventMenu">
      <Link to="/UtilEvent">
        <img className="UtilEventMenuImg" src="utility_menu.png"></img>
      </Link>
    </div>
  );
};

export default UtilEventMenu;

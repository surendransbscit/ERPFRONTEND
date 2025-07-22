import React from "react";
import SDSLogo from "../../images/sdslogo.jpg";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
      <img className="logo-light logo-img" src={SDSLogo} alt="logo" />
      <img className="logo-dark logo-img" src={SDSLogo} alt="logo" />
      <img className="logo-small logo-img logo-img-small" src={SDSLogo} alt="logo" />
    </Link>
  );
};

export default Logo;

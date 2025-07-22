import React from "react";
import { Button } from "reactstrap";

export const CancelButton = ({ disabled, onClick, ...props }) => {
  return (
    <>
      <Button className="m-1" disabled={disabled} color="danger" size="md" onClick={onClick}>
        {props.children}
      </Button>
    </>
  );
};

export const SaveButton = ({ disabled, color, onClick, ...props }) => {
  return (
    <>
      <Button className="m-1" tabIndex={props?.tabIndex} disabled={disabled} color={color ? color : "secondary"} size="md" onClick={onClick}>
        {props.children} 
      </Button>
    </>
  );
};

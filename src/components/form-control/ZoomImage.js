import React from 'react'
import styled from "styled-components";

export const ZoomImage = styled(({ alt, ...props }) => <img onClick={() => window.open(props.src)} alt={alt} {...props} />)`
  width: 50%;
  :hover {
    transition: 0.5s;
    cursor: pointer;
    transform: scale(1.05);
  }
`;
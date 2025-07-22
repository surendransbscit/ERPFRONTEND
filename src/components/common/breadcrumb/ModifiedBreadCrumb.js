import React from "react";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Block, BlockHead, BlockHeadContent, BlockTitle, BlockDes, BackTo } from "../../../components/block/Block";
import { PreviewCard, CodeBlock } from "../../../components/preview/Preview";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";

const ModifiedBreadcrumb = ({ datas }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Block size="lg">
      <Breadcrumb className="breadcrumb-arrow " style={{ marginTop: "10px" }}>
        <BreadcrumbItem>
          <Link to="/">Home</Link>
        </BreadcrumbItem>
        {pathnames?.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const displayName = value.charAt(0).toUpperCase() + value.slice(1);

          return isLast ? (
            <BreadcrumbItem style={{ cursor: "pointer", color: "blue" }} key={to} active>
              {displayName}
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem key={to}>
              <Link to={to}>{displayName}</Link>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </Block>
  );
};

export default ModifiedBreadcrumb;

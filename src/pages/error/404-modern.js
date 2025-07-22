import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { Block, BlockContent } from "../../components/Component";

const Error404Modern = () => {
  return (
    <>
      <Block className="nk-block-middle wide-md mx-auto">
        <BlockContent className="nk-error-ld text-center">
          <div className="wide-xs mx-auto mt-5">
            <h1 className="nk-error-head">404</h1>
            <h3 className="nk-error-title">Oops! Why you’re here?</h3>
            <p className="nk-error-text">
              We are very sorry for inconvenience. It looks like you’re try to access a page that either has been
              deleted or never existed.
            </p>
            <Link to={`${process.env.PUBLIC_URL}/`}>
              <Button color="primary" size="lg" className="mt-2">
                Back To Home
              </Button>
            </Link>
          </div>
        </BlockContent>
      </Block>
    </>
  );
};
export default Error404Modern;

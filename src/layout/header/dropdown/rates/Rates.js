import React, { useEffect, useState } from "react";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { LinkList } from "../../../../components/links/Links";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentMetalRate } from "../../../../redux/thunks/retailMaster";
import CurrencyDisplay from "../../../../components/common/moneyFormat/moneyFormat";
import moment from "moment";

const Rates = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
  const { metalRateInfo } = useSelector((state) => state.metalRateReducer);

  useEffect(() => {
    dispatch(getCurrentMetalRate());
  }, [dispatch]);
  return (
    <Dropdown
      isOpen={open}
      className="user-dropdown"
      toggle={toggle}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <div className="user-info d-none d-md-block">
            <div className="user-name dropdown-indicator">
              GOLD RATE 22K (1gm) -{" "}
              <span className="text-primary">
                <CurrencyDisplay value={metalRateInfo?.gold_22ct} />
              </span>
            </div>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner">
          <LinkList>
            <div className="flex gap-8  justify-between border-b border-gray-200">
              <p style={{ fontSize: "20px !important", fontWeight: "900" }}> Gold 24k</p>
              <p style={{ textAlign: "right", fontSize: "20px !important", fontWeight: "900" }}>
                {" "}
                <CurrencyDisplay value={metalRateInfo?.gold_24ct} />{" "}
              </p>
            </div>

            <div className="flex gap-8  justify-between border-b border-gray-200">
              <p style={{ fontSize: "20px !important", fontWeight: "900" }}> Gold 22k</p>
              <p style={{ textAlign: "right", fontSize: "20px !important", fontWeight: "900" }}>
                {" "}
                <CurrencyDisplay value={metalRateInfo?.gold_22ct} />{" "}
              </p>
            </div>

            <div className="flex gap-8   justify-between border-b border-gray-200">
              <p style={{ fontSize: "20px !important", fontWeight: "900" }}> Gold 18k </p>
              <p style={{ textAlign: "right", fontSize: "20px !important", fontWeight: "900" }}>
                {" "}
                <CurrencyDisplay value={metalRateInfo?.gold_18ct} />
              </p>
            </div>

            <div className="flex gap-8 justify-between ">
              <p style={{ fontSize: "20px !important", fontWeight: "900" }}> Silver 1g</p>
              <p style={{ textAlign: "right", fontSize: "20px !important", fontWeight: "900" }}>
                {" "}
                <CurrencyDisplay value={metalRateInfo?.silver_G} />{" "}
              </p>
            </div>

            <div className="flex  justify-center " style={{ borderTop: "1px solid #000" }}>
              <span style={{ fontSize: "12px !important", fontWeight: "900", marginTop: "5px" }}>
                Last updated on : {moment(metalRateInfo?.updatetime).format("DD/MM/YY h:mm A")}
              </span>
            </div>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default Rates;

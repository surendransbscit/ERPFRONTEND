import React, { useEffect, useState } from "react";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { LinkList } from "../../../../components/links/Links";
import { useSelector, useDispatch } from "react-redux";
import { getCategoryMetalRate } from "../../../../redux/thunks/retailMaster";
import CurrencyDisplay from "../../../../components/common/moneyFormat/moneyFormat";
import moment from "moment";

const CategoryRates = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen((prevState) => !prevState);
    const { catMetalRateInfo } = useSelector((state) => state.metalRateReducer);

    useEffect(() => {
        dispatch(getCategoryMetalRate());
    }, [dispatch]);

    // console.log(catMetalRateInfo);

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
                            TODAY'S RATES
                        </div>
                    </div>
                </div>
            </DropdownToggle>
            <DropdownMenu end className="dropdown-menu-md dropdown-menu-s1">
                <div className="dropdown-inner">
                    <LinkList>
                        {catMetalRateInfo?.map((item, idx) => {
                            return (
                                <div key={idx} className="flex gap-8  justify-between border-b border-gray-200">
                                    <p style={{ fontSize: "20px !important", fontWeight: "900" }}>
                                        {" "}
                                        {item?.category_name} ({item?.purity})
                                    </p>
                                    <p
                                        style={{
                                            textAlign: "right",
                                            fontSize: "20px !important",
                                            fontWeight: "900",
                                        }}
                                    >
                                        {" "}
                                        <CurrencyDisplay value={item?.rate} />{" "}
                                    </p>
                                </div>
                            );
                        })}
                    </LinkList>
                </div>
            </DropdownMenu>
        </Dropdown>
    );
};

export default CategoryRates;
import React, { useEffect, useState } from "react";
import { Icon, UserAvatar } from "../../../components/Component";
import { useDispatch, useSelector } from "react-redux";
import { Card, DropdownMenu, DropdownToggle, DropdownItem, UncontrolledDropdown } from "reactstrap";
import { getTopProduct } from "../../../redux/thunks/retailDashboard";
import { getAccessBranches } from "../../../redux/thunks/coreComponent";
import secureLocalStorage from "react-secure-storage";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";


const TopProduct = () => {
    // const dispatch = useDispatch();
    // const [branches, SetBranches] = useState([]);
    // const { accessBranches } = useSelector((state) => state.coreCompReducer);
    // const loginpref = secureLocalStorage.getItem("pref")?.pref;

    // useEffect(() => {
    //     dispatch(getAccessBranches(loginpref));
    // }, [dispatch, loginpref]);

    // useEffect(() => {
    //     const branchNames = accessBranches?.map((item) => item.id_branch);
    //     SetBranches(branchNames);
    // }, [accessBranches]);
    // const { topProductDashList } = useSelector((state) => state.retailDashboardReducer);

    // const [days, SetDays] = useState("4");
    // useEffect(() => {
    //     dispatch(getTopProduct({ view: days, branch: branches }));
    // }, [dispatch, days, branches, accessBranches]);


    const dispatch = useDispatch();
    const { accessBranches } = useSelector((state) => state.coreCompReducer);
    const { topProductDashList } = useSelector((state) => state.retailDashboardReducer);
    const loginpref = secureLocalStorage.getItem("pref")?.pref;

    const [days, SetDays] = useState("4");
    const [branches, SetBranches] = useState([]);

    useEffect(() => {
        if (loginpref) {
            dispatch(getAccessBranches(loginpref));
        }
    }, [dispatch, loginpref]);

    useEffect(() => {
        if (accessBranches?.length) {
            const branchIds = accessBranches.map((item) => item.id_branch);
            SetBranches(branchIds);
        }
    }, [accessBranches]);

    useEffect(() => {
        if (branches.length > 0) {
            dispatch(getTopProduct({ view: days, branch: branches }));
        }
    }, [dispatch, days, JSON.stringify(branches)]);

    return (
        <Card className="h-100">
            <div className="card-inner">
                <div className="card-title-group mb-2">
                    <div className="card-title">
                        <h6 className="title">Top products</h6>
                    </div>
                    <div className="card-tools">
                        <div className="card-tools">
                            <UncontrolledDropdown>
                                <DropdownToggle
                                    tag="a"
                                    href="#toggle"
                                    onClick={(ev) => ev.preventDefault()}
                                    className="dropdown-toggle btn btn-icon btn-trigger"
                                >
                                    <Icon name="more-h text-black" />
                                </DropdownToggle>
                                <DropdownMenu end className="dropdown-menu-sm">
                                    <ul className="link-list-opt no-bdr">
                                        <li className={days == "4" ? "active" : ""}>
                                            <DropdownItem
                                                tag="a"
                                                href="#dropdown"
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                    SetDays("4");
                                                }}
                                            >
                                                <span>Today</span>
                                            </DropdownItem>
                                        </li>
                                        <li className={days == "5" ? "active" : ""}>
                                            <DropdownItem
                                                tag="a"
                                                href="#dropdown"
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                    SetDays("5");
                                                }}
                                            >
                                                <span>Yesterday</span>
                                            </DropdownItem>
                                        </li>
                                        <li className={days == "2" ? "active" : ""}>
                                            <DropdownItem
                                                tag="a"
                                                href="#dropdown"
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                    SetDays("2");
                                                }}
                                            >
                                                <span>This Week</span>
                                            </DropdownItem>
                                        </li>
                                        <li className={days == "1" ? "active" : ""}>
                                            <DropdownItem
                                                tag="a"
                                                href="#dropdown"
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                    SetDays("1");
                                                }}
                                            >
                                                <span>This Month</span>
                                            </DropdownItem>
                                        </li>
                                        <li className={days == "3" ? "active" : ""}>
                                            <DropdownItem
                                                tag="a"
                                                href="#dropdown"
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                    SetDays("3");
                                                }}
                                            >
                                                <span>Last Month</span>
                                            </DropdownItem>
                                        </li>
                                    </ul>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </div>
                </div>
                <ul className="nk-top-products">
                    {topProductDashList.map((item, idx) => (
                        <li className="item" key={idx}>
                            <div className="thumb">
                                {item.image != null ? (
                                    <img
                                        src={item.image}
                                        alt="preview"
                                    />
                                ) : (
                                    <UserAvatar text={item.image_text} />
                                )}
                            </div>
                            <div className="info">
                                <div className="title">{item.product_name}</div>
                                <div className="price">{item.weight} GM</div>
                            </div>
                            <div className="total">
                                <div className="amount"></div><CurrencyDisplay value={Number(item.amount)} />
                                <div className="count">{item.pieces} Sold</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
};

export default TopProduct;


export const productData = [
    {
        id: 1,
        name: "Pink Fitness Tracker",
        // img: ProductA,
        sku: "UY3749",
        price: "99.49",
        sold: 49,
        category: [
            { label: "Fitbit", value: "Fitbit" },
            { label: "Tracker", value: "Tracker" },
        ],
    },
    {
        id: 2,
        name: "Purple Smartwatch",
        // img: ProductB,
        sku: "UY3750",
        price: "89.49",
        sold: 103,
        category: [
            { label: "Fitbit", value: "Fitbit" },
            { label: "Gadgets", value: "Gadgets" },
            { label: "Tracker", value: "Tracker" },
        ],
    },
    {
        id: 3,
        name: "Black Mi Band Smartwatch",
        // img: ProductC,
        sku: "UY3751",
        price: "299.49",
        sold: 68,
        category: [
            { label: "Smartwatch", value: "Smartwatch" },
            { label: "Tracker", value: "Tracker" },
        ],
    },
    {
        id: 4,
        name: "Black Headphones",
        // img: ProductD,
        sku: "UY3752",
        price: "99.49",
        sold: 77,
        category: [
            { label: "Headphones", value: "Headphones" },
            { label: "Gadgets", value: "Gadgets" },
        ],
    },
    {
        id: 5,
        name: "Iphone 7 Headphones",
        // img: ProductE,
        sku: "UY3753",
        price: "199.49",
        sold: 81,
        category: [
            { label: "Headphones", value: "Headphones" },
            { label: "Gadgets", value: "Gadgets" },
        ],
    },
];

export const productDataSet2 = [
    {
        id: 1,
        name: "Pink Fitness Tracker",
        // img: ProductA,
        sku: "UY3749",
        price: "99.49",
        sold: 10,
        category: [
            { label: "Fitbit", value: "Fitbit" },
            { label: "Tracker", value: "Tracker" },
        ],
    },
    {
        id: 2,
        name: "Purple Smartwatch",
        // img: ProductB,
        sku: "UY3750",
        price: "89.49",
        sold: 5,
        category: [
            { label: "Fitbit", value: "Fitbit" },
            { label: "Gadgets", value: "Gadgets" },
            { label: "Tracker", value: "Tracker" },
        ],
    },
    {
        id: 3,
        name: "Black Mi Band Smartwatch",
        // img: ProductC,
        sku: "UY3751",
        price: "299.49",
        sold: 25,
        category: [
            { label: "Smartwatch", value: "Smartwatch" },
            { label: "Tracker", value: "Tracker" },
        ],
    },
    {
        id: 4,
        name: "Black Headphones",
        // img: ProductD,
        sku: "UY3752",
        price: "99.49",
        sold: 11,
        category: [
            { label: "Headphones", value: "Headphones" },
            { label: "Gadgets", value: "Gadgets" },
        ],
    },
    {
        id: 5,
        name: "Iphone 7 Headphones",
        // img: ProductE,
        sku: "UY3753",
        price: "199.49",
        sold: 10,
        category: [
            { label: "Headphones", value: "Headphones" },
            { label: "Gadgets", value: "Gadgets" },
        ],
    },
];

export const productDataSet3 = [
    {
        id: 1,
        name: "Pink Fitness Tracker",
        // img: ProductA,
        sku: "UY3749",
        price: "99.49",
        sold: 100,
        category: [
            { label: "Fitbit", value: "Fitbit" },
            { label: "Tracker", value: "Tracker" },
        ],
    },
    {
        id: 2,
        name: "Purple Smartwatch",
        // img: ProductB,
        sku: "UY3750",
        price: "89.49",
        sold: 150,
        category: [
            { label: "Fitbit", value: "Fitbit" },
            { label: "Gadgets", value: "Gadgets" },
            { label: "Tracker", value: "Tracker" },
        ],
    },
    {
        id: 3,
        name: "Black Mi Band Smartwatch",
        // img: ProductC,
        sku: "UY3751",
        price: "299.49",
        sold: 80,
        category: [
            { label: "Smartwatch", value: "Smartwatch" },
            { label: "Tracker", value: "Tracker" },
        ],
    },
    {
        id: 4,
        name: "Black Headphones",
        // img: ProductD,
        sku: "UY3752",
        price: "99.49",
        sold: 102,
        category: [
            { label: "Headphones", value: "Headphones" },
            { label: "Gadgets", value: "Gadgets" },
        ],
    },
    {
        id: 5,
        name: "Iphone 7 Headphones",
        // img: ProductE,
        sku: "UY3753",
        price: "199.49",
        sold: 120,
        category: [
            { label: "Headphones", value: "Headphones" },
            { label: "Gadgets", value: "Gadgets" },
        ],
    },
];

export const productDataSet4 = [
    {
        id: 1,
        name: "Pink Fitness Tracker",
        // img: ProductA,
        sku: "UY3749",
        price: "99.49",
        sold: 49,
        category: [
            { label: "Fitbit", value: "Fitbit" },
            { label: "Tracker", value: "Tracker" },
        ],
    },
    {
        id: 2,
        name: "Purple Smartwatch",
        // img: ProductB,
        sku: "UY3750",
        price: "89.49",
        sold: 103,
        category: [
            { label: "Fitbit", value: "Fitbit" },
            { label: "Gadgets", value: "Gadgets" },
            { label: "Tracker", value: "Tracker" },
        ],
    },
    {
        id: 3,
        name: "Black Mi Band Smartwatch",
        // img: ProductC,
        sku: "UY3751",
        price: "299.49",
        sold: 68,
        category: [
            { label: "Smartwatch", value: "Smartwatch" },
            { label: "Tracker", value: "Tracker" },
        ],
    },
    {
        id: 4,
        name: "Black Headphones",
        // img: ProductD,
        sku: "UY3752",
        price: "99.49",
        sold: 77,
        category: [
            { label: "Headphones", value: "Headphones" },
            { label: "Gadgets", value: "Gadgets" },
        ],
    },
    {
        id: 5,
        name: "Iphone 7 Headphones",
        // img: ProductE,
        sku: "UY3753",
        price: "199.49",
        sold: 81,
        category: [
            { label: "Headphones", value: "Headphones" },
            { label: "Gadgets", value: "Gadgets" },
        ],
    },
];
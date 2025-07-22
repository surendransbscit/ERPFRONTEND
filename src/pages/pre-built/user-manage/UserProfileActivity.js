import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import { Button, Card } from "reactstrap";
import Head from "../../../layout/head/Head";
import {
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  LoginLogTable,
} from "../../../components/Component";

import UserProfileAside from "./UserProfileAside";
import { getLoginDetails } from "../../../redux/thunks/coreComponent";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const UserProfileActivityPage = () => {
  const dispatch = useDispatch();
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  // function to change the design view under 990 px
  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };

  const { loginDetailsList } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    dispatch(getLoginDetails());
  }, [dispatch]);

  useEffect(() => {
    viewChange();
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    document
      .getElementsByClassName("nk-header")[0]
      .addEventListener("click", function () {
        updateSm(false);
      });
    return () => {
      window.removeEventListener("resize", viewChange);
      window.removeEventListener("load", viewChange);
    };
  }, []);

  return (
    <React.Fragment>
      <Head title="User List - Profile"></Head>
      <Content>
        <Card>
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${
                sm ? "content-active" : ""
              }`}
            >
              <UserProfileAside updateSm={updateSm} sm={sm} />
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && (
                <div
                  className="toggle-overlay"
                  onClick={() => updateSm(!sm)}
                ></div>
              )}
              <BlockHead size="lg">
                <BlockBetween>
                  <BlockHeadContent>
                    <BlockTitle tag="h4">Login Activity</BlockTitle>
                    <BlockDes>
                      <p>
                        Here is your last 20 login activities log.{" "}
                        <span className="text-soft">
                          <Icon name="info" />
                        </span>
                      </p>
                    </BlockDes>
                  </BlockHeadContent>
                  <BlockHeadContent className="align-self-start d-lg-none">
                    <Button
                      className={`toggle btn btn-icon btn-trigger mt-n1 ${
                        sm ? "active" : ""
                      }`}
                      onClick={() => updateSm(!sm)}
                    >
                      <Icon name="menu-alt-r"></Icon>
                    </Button>
                  </BlockHeadContent>
                </BlockBetween>
              </BlockHead>

              <table className="table table-ulogs">
                <thead className="table-light">
                  <tr>
                    <th className="tb-col-os">
                      <span className="overline-title">
                        Browser <span className="d-sm-none">/ IP</span>
                      </span>
                    </th>
                    <th className="tb-col-ip">
                      <span className="overline-title">IP</span>
                    </th>
                    <th className="tb-col-time">
                      <span className="overline-title">Date</span>
                    </th>
                    <th className="tb-col-ip">
                      <span className="overline-title">OS</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loginDetailsList?.map((idx) => {
                    return (
                      <tr key={idx}>
                        <td className="tb-col-os">
                          {loginDetailsList[0].browser_fam}
                        </td>
                        <td className="tb-col-ip">
                          <span className="sub-text">
                            {loginDetailsList[0].ip_address}
                          </span>
                        </td>
                        <td className="tb-col-time">
                          <span className="sub-text">
                            <span className="d-none d-sm-inline-block">
                              {" "}
                              {moment(loginDetailsList[0]?.signin_time).format(
                                "DD/MM/yyyy"
                              )}
                            </span>
                          </span>
                        </td>
                        <td className="tb-col-ip">
                          <span className="sub-text">
                            {loginDetailsList[0].os_fam}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </Content>
    </React.Fragment>
  );
};

export default UserProfileActivityPage;

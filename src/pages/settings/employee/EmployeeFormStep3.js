import React from "react";
import { Row } from "../../../components/Component";
import { Col } from "reactstrap";
import styled from "styled-components";
import Loading from "../../../components/erp-loading/erp-loader";

const TableStyle = styled.div`
  .table {
    td {
      padding: 0.25rem;
    }
  }
`;

const EmployeeFormStep3 = ({ props }) => {
  const { accessData, SetAccessData } = props;

  const selectionAll = async (checked) => {
    SetAccessData((prevState) =>
      prevState?.map((obj) => {
        return {
          ...obj,
          view: checked,
          add: checked,
          edit: checked,
          delete: checked,
        };
      })
    );
  };
  //
  const selectionViewAll = async (checked) => {
    SetAccessData((prevState) =>
      prevState?.map((obj) => {
        return {
          ...obj,
          view: checked,
        };
      })
    );
  };
  //
  //
  const selectionAddAll = async (checked) => {
    SetAccessData((prevState) =>
      prevState?.map((obj) => {
        return {
          ...obj,
          add: checked,
        };
      })
    );
  };
  // //
  const selectionEditAll = async (checked) => {
    SetAccessData((prevState) =>
      prevState?.map((obj) => {
        return {
          ...obj,
          edit: checked,
        };
      })
    );
  };
  // //
  const selectionDeleteAll = async (checked) => {
    SetAccessData((prevState) =>
      prevState?.map((obj) => {
        return {
          ...obj,
          delete: checked,
        };
      })
    );
  };
  //

  //
  const selectionRowAll = async (obj, checked) => {
    SetAccessData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,
            view: checked,
            add: checked,
            edit: checked,
            delete: checked,
          };
        }
        return item;
      })
    );
  };

  //
  const selectionViewSingle = async (obj, checked) => {
    SetAccessData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,
            view: checked,
          };
        }
        return item;
      })
    );
  }; //
  //
  const selectionAddSingle = async (obj, checked) => {
    SetAccessData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,

            add: checked,
          };
        }
        return item;
      })
    );
  }; // //
  const selectionEditSingle = async (obj, checked) => {
    SetAccessData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,

            edit: checked,
          };
        }
        return item;
      })
    );
  }; // //
  const selectionDeleteSingle = async (obj, checked) => {
    SetAccessData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,

            delete: checked,
          };
        }
        return item;
      })
    );
  };

  return (
    <>
      {accessData ? (
        <Row className="gy-2 gx-5">
          <Col sm="12">
            <TableStyle>
              <table className={`table table-tranx is-compact `} style={{ minWidth: "95%" }}>
                <thead className="tb-odr-head">
                  <tr>
                    <th style={{ minWidth: "10vw" }}>
                      <label>Menu</label>
                    </th>
                    <th>
                      <div className="custom-control custom-control-sm custom-checkbox notext">
                        <input
                          type="checkbox"
                          className="custom-control-input form-control"
                          id="access_select_all"
                          onChange={(e) => selectionAll(e.target.checked)}
                        />
                        <label className="custom-control-label" htmlFor="access_select_all">
                          Select All
                        </label>
                      </div>
                    </th>
                    <th>
                      <div className="custom-control custom-control-sm custom-checkbox notext">
                        <input
                          type="checkbox"
                          className="custom-control-input form-control"
                          id="access_select_allview"
                          onChange={(e) => selectionViewAll(e.target.checked)}
                        />
                        <label className="custom-control-label" htmlFor="access_select_allview">
                          View
                        </label>
                      </div>
                    </th>
                    <th>
                      <div className="custom-control custom-control-sm custom-checkbox notext">
                        <input
                          type="checkbox"
                          className="custom-control-input form-control"
                          id="access_select_alladd"
                          onChange={(e) => selectionAddAll(e.target.checked)}
                        />
                        <label className="custom-control-label" htmlFor="access_select_alladd">
                          Add
                        </label>
                      </div>
                    </th>
                    <th>
                      <div className="custom-control custom-control-sm custom-checkbox notext">
                        <input
                          type="checkbox"
                          className="custom-control-input form-control"
                          id="access_select_alledit"
                          onChange={(e) => selectionEditAll(e.target.checked)}
                        />
                        <label className="custom-control-label" htmlFor="access_select_alledit">
                          Edit
                        </label>
                      </div>
                    </th>
                    <th>
                      <div className="custom-control custom-control-sm custom-checkbox notext">
                        <input
                          type="checkbox"
                          className="custom-control-input form-control"
                          id="access_select_alldel"
                          onChange={(e) => selectionDeleteAll(e.target.checked)}
                        />
                        <label className="custom-control-label" htmlFor="access_select_alldel">
                          Delete
                        </label>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accessData?.map((obj) => {
                    return (
                      <tr
                        key={obj?.id}
                        style={{
                          background: "#f5f5f5",
                        }}
                        // style={{
                        //   backgroundColor:
                        //     obj?.submenus > 0 || obj?.parent_id == null || obj?.parent_id == obj?.id
                        //       ? "#ebebeb"
                        //       : "none",
                        // }}
                      >
                        <td>{obj.text}</td>
                        <td>
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              id={`row_all-${obj?.id}`}
                              checked={obj.view && obj.add && obj.edit && obj.delete}
                              onChange={(e) => selectionRowAll(obj, e.target.checked)}
                            />
                            <label className="custom-control-label" htmlFor={`row_all-${obj?.id}`}></label>
                          </div>
                        </td>
                        <td>
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              id={`${obj?.id}-view`}
                              checked={obj.view}
                              onChange={(e) => selectionViewSingle(obj, e.target.checked)}
                            />
                            <label className="custom-control-label" htmlFor={`${obj?.id}-view`}></label>
                          </div>
                        </td>
                        <td>
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              id={`${obj?.id}-add`}
                              checked={obj.add}
                              onChange={(e) => selectionAddSingle(obj, e.target.checked)}
                            />
                            <label className="custom-control-label" htmlFor={`${obj?.id}-add`}></label>
                          </div>
                        </td>
                        <td>
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              id={`${obj?.id}-edit`}
                              checked={obj.edit}
                              onChange={(e) => selectionEditSingle(obj, e.target.checked)}
                            />
                            <label className="custom-control-label" htmlFor={`${obj?.id}-edit`}></label>
                          </div>
                        </td>
                        <td>
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              id={`${obj?.id}-del`}
                              checked={obj.delete}
                              onChange={(e) => selectionDeleteSingle(obj, e.target.checked)}
                            />
                            <label className="custom-control-label" htmlFor={`${obj?.id}-del`}></label>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableStyle>
          </Col>
        </Row>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default EmployeeFormStep3;

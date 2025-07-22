import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  CancelButton,
  Col,
  PreviewCard,
  Row,
  SaveButton,
  UserAvatar,
} from "../../../components/Component";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";
import { createOrder, getPurchaseCartItems, removePurchaseCartItem } from "../../../redux/thunks/Order";
import { getPagePermission } from "../../../redux/thunks/coreComponent";
import { SupplierDropdown } from "../../../components/filters/retailFilters";
import { useForm } from "react-hook-form";
import { useSupplierFilter } from "../../../components/filters/filterHooks";
import { isUndefined } from "../../../components/common/calculations/ErpCalculations";
import moment from "moment";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";

const PurchaseCartList = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    setValue,
    setError,
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pathName = location?.pathname;

  const { supplier } = useSupplierFilter();
  const { isLoading: issubmitting, purchaseCartList } = useSelector(
    (state) => state.orderReducer
  );

  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  const [purchaseCartData, setPurchaseCartData] = useState([]);
  const [purchaseCartCoumns, setPurchaseCartColumns] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectSupplier, setSelectSupplier] = useState();
  const [selectedSupplierLabel, setSelectedSupplierLabel] = useState();

  const selectAllCol = (value) => {
    purchaseCartData?.forEach((item, rowIndex) => {
      handelChange(rowIndex, "is_checked", value);
    });
  };

  const handelChange = (index, field, value) => {
    setPurchaseCartData((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;
      return updatedValues;
    });
  };

  const calculateTotal = (field) => {
    return purchaseCartData.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = purchaseCartCoumns.find((item) => item.accessor === field);
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  useEffect(() => {
    dispatch(getPurchaseCartItems());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  console.log(purchaseCartList);

  useEffect(() => {
    setPurchaseCartColumns(purchaseCartList?.data?.columns);
    setPurchaseCartData(purchaseCartList?.data?.rows);
  }, [purchaseCartList]);

  const checkoutCart = async () => {
    const cartItems = purchaseCartData.filter(
      (item) => item?.is_checked === true
    );

    const orderDet = cartItems?.map((item) => {
      const container = {};
      container.purity = item.purity;
      container.product = item.product;
      container.size = item.size;
      container.design = item.design;
      container.sub_design = item.sub_design;
      container.id_section = null;
      container.calculation_type = null;
      container.uom = item.uom;
      container.tax = null;
      container.taxable_amnt = 0;
      container.tax_amnt = 0;
      container.tax_type = null;
      container.item_cost = 0;
      container.wastage_percent = null;
      container.wastage_wt = 0;
      // container.mc_type = item?.mcType;
      container.mc_value = 0;
      // container.flat_mc_value = null;
      container.pieces = isUndefined(item.pieces);
      container.cgst_amnt = isUndefined(item.cgst_amnt);
      container.sgst_amnt = isUndefined(item.sgst_amnt);
      container.igst_amnt = isUndefined(item.igst_amnt);
      container.gross_wt = isUndefined(item.gross_wt);
      container.less_wt = isUndefined(item.less_wt);
      container.net_wt = isUndefined(item.gross_wt);
      container.diamond_wt = isUndefined(item.diamond_wt);
      container.stone_wt = isUndefined(item.stone_wt);
      container.sell_rate = isUndefined(item.sellRate);
      container.pure_wt = isUndefined(item.pureWeight);
      container.other_metal_wt = isUndefined(item.otherMetalWeight);
      container.rate_per_gram = item?.rate_per_gram;
      container.ref_emp_id = null;
      container.stone_details = [];
      container.other_metal_details = [];
      container.charges_details = [];
      container.attribute_details = [];
      container.order_images = [];
      container.order_videos = [];
      container.order_voices = [];
      container.remarks = item?.remarks;
      container.erp_tag = item?.erp_tag;
      container.detail_id = null;
      container.karigar_due_date = moment(new Date()).format("YYYY-MM-DD");
      return container;
    });
    const orderDetIds = cartItems?.map((item) => {
      const container = {};
      container.id = item.id;
      return container;
    });
    let postData = {
      order_type: 2,
      customer: null,
      supplier: selectSupplier,
      order_details: orderDet,
    };
    let cartPostData = {
      remv_cart_ids : orderDetIds,
    };
    // console.log(postData);

    try {
      await dispatch(createOrder(postData)).unwrap();
      await dispatch(removePurchaseCartItem(cartPostData)).unwrap();
      toastsuccess("Cart items checkedout successfully");
      navigate(`${process.env.PUBLIC_URL}/order/purchaseorder/list`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <Head title="Purchase Cart" />
      <Content>
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <CancelButton
                disabled={issubmitting}
                color="danger"
                size="md"
                onClick={() => navigate(`${process.env.PUBLIC_URL}/`)}
              >
                Cancel
              </CancelButton>
              <SaveButton
                disabled={
                  issubmitting || !pagePermission?.add || !pagePermission?.view
                }
                size="md"
                color="primary"
                onClick={handleSubmit(checkoutCart)}
              >
                {issubmitting ? "Saving" : "Save"}
              </SaveButton>
            </Col>
          </Row>

          <div className="custom-grid">
            <Row className="g-4 form-control-sm align-center">
              <Col lg="2">
                <label className="form-label" htmlFor="supplier">
                  Supplier
                </label>
                <div className="form-group">
                  <SupplierDropdown
                    register={register}
                    isRequired={true}
                    id={"supplier"}
                    selectedSupplier={selectSupplier}
                    supplier={supplier}
                    setValue={setValue}
                    selectedSupplierLabel={setSelectedSupplierLabel}
                    onSupplierChange={(value) => {
                      setSelectSupplier(value);
                    }}
                    clearErrors={clearErrors}
                    placeholder={"Select Supplier"}
                    message={errors.supplier && "Supplier Is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row className="mt-2" md={12}>
              <div
                className="table-responsive"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <table className="table table-bordered">
                  <thead>
                    <tr
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        S.NO{" "}
                        <input
                          type="checkbox"
                          onChange={(event) => {
                            selectAllCol(event.target.checked);
                            setSelectAll(event.target.checked);
                          }}
                          checked={selectAll}
                        />{" "}
                      </th>
                      {purchaseCartCoumns?.map((column, index) => (
                        <th
                          key={index}
                          style={{
                            textAlign: column?.text_align,
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          {column.Header}
                        </th>
                      ))}
                      {/* <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Tag Code
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseCartData?.length > 0 &&
                      purchaseCartData?.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>
                            {rowIndex + 1}{" "}
                            <input
                              type="checkbox"
                              onChange={(event) => {
                                handelChange(
                                  rowIndex,
                                  "is_checked",
                                  event.target.checked
                                );
                              }}
                              checked={item.is_checked}
                            />{" "}
                          </td>
                          {purchaseCartCoumns?.map((column, colIndex) => (
                            <td
                              key={colIndex}
                              style={{ textAlign: column?.text_align }}
                            >
                              {column.type === "image" ? (
                                item[column.accessor] ? (
                                  <img
                                    src={item[column.accessor]}
                                    alt={column.accessor}
                                    style={{
                                      maxWidth: "100px",
                                      maxHeight: "100px",
                                    }}
                                  />
                                ) : (
                                  <UserAvatar text={item["image_text"]} />
                                )
                              ) : column.is_currency ? (
                                <CurrencyDisplay
                                  value={item[column.accessor]}
                                />
                              ) : column.decimal_places ? (
                                parseFloat(item[column.accessor]).toFixed(
                                  column.decimal_places
                                )
                              ) : (
                                item[column.accessor]
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>

                  <tfoot
                    style={{
                      position: "sticky",
                      bottom: 0,
                      zIndex: 10,
                      backgroundColor: "#fff",
                    }}
                  >
                    <tr style={{ fontWeight: "bold" }}>
                      <td
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Total
                      </td>
                      {purchaseCartCoumns?.map((column, index) => (
                        <td
                          key={index}
                          style={{
                            textAlign: column?.text_align,
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          {column.is_total_req ? (
                            column.is_currency ? (
                              <CurrencyDisplay
                                value={calculateTotal(column.accessor)}
                              />
                            ) : (
                              calculateTotal(column.accessor)
                            )
                          ) : (
                            ""
                          )}
                        </td>
                      ))}
                      {/* <td
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      ></td> */}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default PurchaseCartList;

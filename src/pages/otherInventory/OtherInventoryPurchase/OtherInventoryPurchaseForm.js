import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import axios from "axios";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import {
  BlockTitle,
  CancelButton,
  Icon,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import {
  Col,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  useBranches,
  useOtherInventoryItem,
  useOtherInventorySize,
  useSupplierFilter,
} from "../../../components/filters/filterHooks";
import {
  BranchDropdown,
  OtherInventoryItemDropdown,
  OtherInventorySizeDropdown,
  SupplierDropdown,
} from "../../../components/filters/retailFilters";
import { Button } from "reactstrap";
import { v4 as uuid } from "uuid";
import { useHotkeys } from "react-hotkeys-hook";
import { createOtherInventoryPurchase } from "../../../redux/thunks/otherInventory";
import secureLocalStorage from "react-secure-storage";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";

const OtherInventoryPurchaseForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.OtherInventoryPurchaseReducer
  );

  const { otherInventoryItems } = useOtherInventoryItem();
  const { otherInventorySizes } = useOtherInventorySize();

  const { branches } = useBranches();
  const { supplier } = useSupplierFilter();

  const [selectSupplier, setSelectSupplier] = useState();
  const [idBranch, setIdBranch] = useState("");
  const [purchaseSettings, setPurchaseSettings] = useState([]);


  useEffect(() => {
    if (purchaseSettings?.length == 0) {
      addPurchaseSettings();
    }
  }, [purchaseSettings]);

  const addPurchaseSettings = () => {
    setPurchaseSettings([
      ...purchaseSettings,
      {
        item: "",
        size: "",
        pcs: "",
        rate: "",
        amount: "",
        id_purchase_settings: uuid(),
      },
    ]);
  };

  const editPurchaseSettings = ({ name, val, ids, ...params }) => {
    setPurchaseSettings((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id_purchase_settings == ids) {
          setValue(`${name + obj.id_purchase_settings}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const purchaseColumn = [
    { header: "Item", accessor: "item", textAlign: "center" },
    { header: "Size", accessor: "size", textAlign: "center" },
    { header: "Pieces", accessor: "pcs", textAlign: "right", isTotalReq: true },
    {
      header: "Rate",
      accessor: "rate",
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
    },
    {
      header: "Amount",
      accessor: "amount",
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
    },
  ];

  const calculateTotal = (field) => {
    return purchaseSettings?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = purchaseColumn?.find((item) => item.accessor === field);
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const deletePurchaseSettings = (ids) => {
    setPurchaseSettings((prevState) =>
      prevState?.filter((obj) => obj.id_purchase_settings != ids)
    );
  };

  const downloadPDF = async (printPageURL, id) => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/${printPageURL}/${id}/`,
      {
        headers: {
          Authorization: `Token ${secureLocalStorage.getItem("pref")?.token}`,
        },
      }
    );

    try {
      const response = await axios.get(data?.data?.pdf_url, {
        responseType: "blob",
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(pdfBlob);

      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.target = "_blank";
      tempLink.setAttribute("print", `invoice.pdf`);

      document.body.appendChild(tempLink);
      tempLink.click();

      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const postData = async () => {
    const pruchase_settings = purchaseSettings?.map((obj) => {
      const container = {};
      container.item = obj.item;
      container.size = obj.size;
      container.pieces = obj?.pcs;
      container.rate_per_item = obj?.rate;
      container.total_amount = obj?.amount;
      return container;
    });
    const adddata = {
      purchase_entry_details: pruchase_settings,
      supplier: selectSupplier,
      branch: idBranch,
    };

    try {
      const response = await dispatch(
        createOtherInventoryPurchase(adddata)
      ).unwrap();
      toastsuccess(" Other Inventory Purchase Added successfully");
      navigate(`${process.env.PUBLIC_URL}/other_inventory/purchase/list`);
      downloadPDF(response?.data?.pdf_path, response?.data?.id);
    } catch (error) {
      console.error(error);
    }
  };
  useHotkeys(
      "ctrl+s",
      (event) => {
        event.preventDefault();
        document.activeElement?.blur();
        setTimeout(() => {
          if (id !== undefined) {
            handleSubmit(putData)();
          } else {
            handleSubmit(postData)();
          }
        }, 0); // <-- Slight delay after blur
      },
      {
        enableOnFormTags: true,
        preventDefault: true,
      }
    );

  return (
    <React.Fragment>
      <Head title="Other Inventory - Purchase" />
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
              <SaveButton
                disabled={issubmitting}
                size="md"
                color="primary"
                onClick={handleSubmit((data) => postData(data, "save"))}
              >
                {issubmitting ? "Saving" : "Save[Ctrl+s]"}
              </SaveButton>

              <CancelButton
                disabled={issubmitting}
                color="danger"
                size="md"
                onClick={() =>
                  navigate(
                    `${process.env.PUBLIC_URL}/other_inventory/purchase/list`
                  )
                }
              >
                Cancel
              </CancelButton>
            </Col>
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="branch">
                    Branch
                    <IsRequired />
                  </label>
                  <BranchDropdown
                    register={register}
                    id={"idBranch"}
                    branches={branches}
                    selectedBranch={idBranch}
                    onBranchChange={(value) => {
                      setIdBranch(value);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.idBranch && "Branch is Required"}
                  ></BranchDropdown>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Supplier
                    <IsRequired />
                  </label>
                  <SupplierDropdown
                    register={register}
                    id={"supplier"}
                    selectedSupplier={selectSupplier}
                    showOnlyIsComplementarySupplier={true}
                    supplier={supplier}
                    setValue={setValue}
                    onSupplierChange={(value) => {
                      setSelectSupplier(value);
                    }}
                    clearErrors={clearErrors}
                    placeholder={"Select Supplier"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      {/* <th>Item</th>
                      <th>Size</th>
                      <th>Pcs</th>
                      <th>Rate</th>
                      <th>Amount</th>
                      <th>Action</th> */}
                      {purchaseColumn?.map((column, index) => (
                        <th
                          key={index}
                          style={{ textAlign: column?.textAlign }}
                        >
                          {column.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseSettings?.map((obj, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="form-group">
                              <OtherInventoryItemDropdown
                                register={register}
                                id={`item${obj.id_purchase_settings}`}
                                name="item"
                                otherInventoryItems={otherInventoryItems}
                                selectedOtherInventoryItem={obj?.item}
                                onOtherInventoryItemChange={(value) =>
                                  editPurchaseSettings({
                                    ids: obj?.id_purchase_settings,
                                    name: "item",
                                    val: value,
                                  })
                                }
                                isRequired={true}
                                clearErrors={clearErrors}
                                setValue={setValue}
                                message={
                                  errors?.[
                                  `item` +
                                  `${String(obj.id_purchase_settings)}`
                                  ] && "Item is Required"
                                }
                              />
                            </div>
                          </td>

                          <td>
                            <div className="form-group">
                              <OtherInventorySizeDropdown
                                register={register}
                                id={`size${obj.id_purchase_settings}`}
                                name="size"
                                otherInventorySizes={otherInventorySizes}
                                selectedOtherInventorySize={obj?.size}
                                onOtherInventorySizeChange={(value) =>
                                  editPurchaseSettings({
                                    ids: obj?.id_purchase_settings,
                                    name: "size",
                                    val: value,
                                  })
                                }
                                isRequired={false}
                                clearErrors={clearErrors}
                                setValue={setValue}

                              />
                            </div>
                          </td>

                          <td>
                            <input
                              {...register(`pcs${obj.id_purchase_settings}`, {
                                required: "Required",
                              })}
                              type="number"
                              name="pcs"
                              step={1}
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              placeholder="Enter Pcs"
                              min={0}
                              onKeyDown={(evt) =>
                                ["e", "E", "+", "-"].includes(evt.key) &&
                                evt.preventDefault()
                              }
                              value={obj?.pcs}
                              onChange={(e) => {
                                const pcsValue =
                                  parseFloat(e.target.value) || 0;
                                const rateValue = parseFloat(obj?.rate) || 0;
                                const amountValue = pcsValue * rateValue;

                                editPurchaseSettings({
                                  ids: obj?.id_purchase_settings,
                                  name: e.target.name,
                                  val: e.target.value,
                                });

                                editPurchaseSettings({
                                  ids: obj?.id_purchase_settings,
                                  name: "amount",
                                  val: amountValue.toFixed(2),
                                });
                              }}
                            />
                            {errors?.[
                              `pcs` + `${String(obj.id_purchase_settings)}`
                            ] && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {
                                    errors?.[
                                      `pcs` +
                                      `${String(obj.id_purchase_settings)}`
                                    ].message
                                  }
                                </span>
                              )}
                          </td>
                          <td>
                            <input
                              {...register(`rate${obj.id_purchase_settings}`, {
                                required: "Required",
                              })}
                              type="number"
                              step={1}
                              min={0}
                              name="rate"
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              placeholder="Enter Rate"
                              onKeyDown={(evt) =>
                                ["e", "E", "+", "-"].includes(evt.key) &&
                                evt.preventDefault()
                              }
                              value={obj?.rate}
                              onChange={(e) => {
                                const rateValue =
                                  parseFloat(e.target.value) || 0;
                                const pcsValue = parseFloat(obj?.pcs) || 0;
                                const amountValue = pcsValue * rateValue;

                                editPurchaseSettings({
                                  ids: obj?.id_purchase_settings,
                                  name: e.target.name,
                                  val: e.target.value,
                                });

                                editPurchaseSettings({
                                  ids: obj?.id_purchase_settings,
                                  name: "amount",
                                  val: amountValue.toFixed(2),
                                });
                              }}
                            />
                            {errors?.[
                              `rate` + `${String(obj.id_purchase_settings)}`
                            ] && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {
                                    errors?.[
                                      `rate` +
                                      `${String(obj.id_purchase_settings)}`
                                    ].message
                                  }
                                </span>
                              )}
                          </td>
                          <td>
                            <input
                              {...register(
                                `amount${obj.id_purchase_settings}`,
                                {
                                  required: "Required",
                                }
                              )}
                              type="number"
                              step={1}
                              min={0}
                              name="amount"
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              placeholder="Enter Amount"
                              value={obj?.amount}
                              onChange={(e) =>
                                editPurchaseSettings({
                                  ids: obj?.id_purchase_settings,
                                  name: e.target.name,
                                  val: e.target.value,
                                })
                              }
                              readOnly
                            />
                            {errors?.[
                              `amount` + `${String(obj.id_purchase_settings)}`
                            ] && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {
                                    errors?.[
                                      `amount` +
                                      `${String(obj.id_purchase_settings)}`
                                    ].message
                                  }
                                </span>
                              )}
                          </td>

                          <td>
                            {index == purchaseSettings?.length - 1 && (
                              <Button
                                color="primary"
                                size="sm"
                                className="btn-icon btn-white btn-dim"
                                onClick={() => addPurchaseSettings()}
                              >
                                <Icon name="plus" />
                              </Button>
                            )}
                            <Button
                              color="primary"
                              size="sm"
                              className="btn-icon btn-white btn-dim"
                              onClick={() =>
                                deletePurchaseSettings(
                                  obj?.id_purchase_settings
                                )
                              }
                            >
                              <Icon name="trash-fill" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ fontWeight: "bold" }}>
                      <td>Total</td>
                      {purchaseColumn?.map((column, index) => (
                        <td
                          key={index}
                          style={{ textAlign: column?.textAlign }}
                        >
                          {column.isTotalReq ? (
                            column.isCurrency ? (
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
export default OtherInventoryPurchaseForm;

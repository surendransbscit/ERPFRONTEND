import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  NumberInputField,
  Row,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  useBranches,
  useLocalVendorSupplierFilter,
} from "../../../components/filters/filterHooks";
import {
  BranchDropdown,
  SupplierDropdown,
} from "../../../components/filters/retailFilters";
import { useHotkeys } from "react-hotkeys-hook";
import ReactQuill from "react-quill";
import { createLiablityEntry } from "../../../redux/thunks/billing";
import secureLocalStorage from "react-secure-storage";

const LiablityEntryForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.bannerReducer
  );
  const { branches } = useBranches();
  const { supplier } = useLocalVendorSupplierFilter();

  const [selectSupplier, setSelectSupplier] = useState();

  const [branch, setBranch] = useState();
  const [RefBillNo, setRefBillNo] = useState();
  const [description, setDescription] = useState();
  const [amount, setAmount] = useState();

  const postData = async () => {
    const adddata = {
      branch,
      supplier: selectSupplier,
      ref_bill_no: RefBillNo ? RefBillNo : null,
      amount: amount,
      remarks: description,
    };
    try {
      let response = "";
      response = await dispatch(createLiablityEntry(adddata)).unwrap();

      toastsuccess("Liablity Added successfully");
      navigate(`${process.env.PUBLIC_URL}/billing/liablity_entry/list`);

      let data = {
        settings: {},
        itemDetails: response?.data?.print_data,
      };
      secureLocalStorage.setItem("pageState", JSON.stringify(data));
      window.open(
        `${process.env.PUBLIC_URL}/billing/liablity_entry/print`,
        "_blank"
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/billing/liablity_entry/list`);
    }
  }, [add, id, navigate]);

  const handleChange = (value) => {
    setDescription(value);
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        // if (id !== undefined) {
        //   handleSubmit(putData)();
        // } else {
        handleSubmit(postData)();
        // }
      }, 0);
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  return (
    <React.Fragment>
      <Head title={title ? title : "Liablity Entry"} />
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
            {add !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postData(data, "saveAndClose")
                  )}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/billing/liablity_entry/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Branch
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <BranchDropdown
                    register={register}
                    id={"branch"}
                    branches={branches}
                    selectedBranch={branch}
                    onBranchChange={(value) => {
                      setBranch(value);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors?.branch && "Branch is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <label className="form-label" htmlFor="">
                  Supplier
                  <IsRequired />
                </label>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <SupplierDropdown
                    register={register}
                    id={"supplier"}
                    isRequired={true}
                    selectedSupplier={selectSupplier}
                    supplier={supplier}
                    setValue={setValue}
                    onSupplierChange={(value) => {
                      setSelectSupplier(value);
                    }}
                    clearErrors={clearErrors}
                    placeholder={"Select Supplier"}
                    message={errors?.supplier && "Supplier is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4 ">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="amount">
                    Ref Bill No
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={false}
                    id={"RefBillNo"}
                    placeholder="RefBillNo"
                    value={RefBillNo}
                    SetValue={(value) => {
                      setRefBillNo(value);
                      clearErrors("RefBillNo");
                    }}
                    message={errors.RefBillNo && "RefBillNo is required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4 ">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="amount">
                    Amount
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"amount"}
                    placeholder="amount"
                    value={amount}
                    SetValue={(value) => {
                      setAmount(value);
                      clearErrors("amount");
                    }}
                    message={errors.amount && "Amount is required"}
                  />
                </div>
              </Col>
            </Row>

            <Row className="g-3 align-center ">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="bannerName">
                    Remarks
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <ReactQuill value={description} onChange={handleChange} />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default LiablityEntryForm;

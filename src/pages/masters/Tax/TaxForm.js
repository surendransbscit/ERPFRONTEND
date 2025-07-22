import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createTax,
  getTaxById,
  updateTaxById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Icon,
  NumberInputField,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const TaxForm = () => {
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
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.taxmasterReducer
  );
  const { taxInfo } = useSelector((state) => state.taxmasterReducer);

  const [tax_code, setTaxCode] = useState();
  const [tax_name, setTaxName] = useState();
  const [tax_percentage, setTaxPercentage] = useState(false);
  const [active, setActive] = useState(true);
  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      tax_code,
      tax_name,
      tax_percentage,
      is_active: active,
    };
    try {
      await dispatch(createTax(adddata)).unwrap();
      toastsuccess(tax_code + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/tax/list`);
    } catch (error) {
      console.error(error);
    }
    // await dispatch(createArea(adddata));
    // if (isError === false) {
    //   toastsuccess(area_name + " Added successfully");
    //   navigate(`${process.env.PUBLIC_URL}/master/area/list`);
    // }
  };

  let data = location?.pathname.split("/");
  data[0] = "Home";
  const pathnames = location.pathname.split("/").filter((x) => x);
  const breadoptions = data?.map((obj, i) => {
    const container = {};
    container.name = obj;
    if (data[i] == "Home") {
      container.link = `/`;
    } else {
      container.link = pathnames.slice(0, i).join("/");
    }

    return container;
  });

  const postAndCreateNew = async () => {
    const adddata = {
      tax_code,
      tax_name,
      tax_percentage,
      is_active: active,
    };

    await dispatch(createTax(adddata));
    if (isError === false) {
      toastsuccess("Tax Added successfully");
      setTaxCode("");
      setTaxName("");
      setTaxPercentage(false);
      setActive(true);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getTaxById(id));
  }, [dispatch, id]);

  useEffect(() => {
    taxInfo != undefined &&
      (setTaxCode(taxInfo?.tax_code),
        setTaxName(taxInfo?.tax_name),
        setTaxPercentage(taxInfo?.tax_percentage),
        setActive(taxInfo?.is_active),
        reset());
  }, [taxInfo, reset]);

  const putData = async () => {
    const adddata = {
      tax_code,
      tax_name,
      tax_percentage,
      is_active: active,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };

    await dispatch(updateTaxById(reduxData));
    if (isError === false) {
      toastsuccess("Tax Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/tax/list`);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/tax/list`);
    }
  }, [add, id, navigate]);


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
      <Head title={title ? title : "Tax"} />
      <Content>
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb></ModifiedBreadcrumb>
            </Col>
            <Col md={2}></Col>
            {add !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postAndCreateNew(data, "saveAndNew")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton>

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
                    navigate(`${process.env.PUBLIC_URL}/master/tax/list`)
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(putData)}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/master/tax/list`)
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
                  <label className="form-label" htmlFor="site-name">
                    Tax Code <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"tax_code"}
                    placeholder="Tax Code"
                    value={tax_code}
                    SetValue={(value) => {
                      setTaxCode(transformWord(value));
                      clearErrors("tax_code");
                    }}
                    message={errors.tax_code && " Tax Code is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="tax_name">
                    Tax Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    placeholder="Tax Name"
                    id={"tax_name"}
                    value={tax_name}
                    isRequired={true}
                    register={register}
                    reqValueError={"This field is required"}
                    SetValue={(value) => {
                      setTaxName(transformWord(value));
                      clearErrors("tax_name");
                    }}
                  // message={errors.pincode && "pincode is Required"}
                  />
                  {errors.tax_name && (
                    <span className="text-danger">
                      {errors.tax_name.message}
                    </span>
                  )}
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="tax_percentage">
                    Tax Percentage
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <NumberInputField
                    placeholder="Tax Percentage"
                    id={"tax_percentage"}
                    value={tax_percentage}
                    isRequired={true}
                    register={register}
                    reqValueError={"This field is required"}
                    SetValue={(value) => {
                      setTaxPercentage(value);
                      clearErrors("tax_percentage");
                    }}
                  // message={errors.pincode && "pincode is Required"}
                  />
                  {errors.tax_name && (
                    <span className="text-danger">
                      {errors.tax_percentage.message}
                    </span>
                  )}
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="active">
                    Active
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <SwitchInputField
                  register={register}
                  id={"active"}
                  checked={active}
                  SetValue={setActive}
                  name={"active"}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default TaxForm;

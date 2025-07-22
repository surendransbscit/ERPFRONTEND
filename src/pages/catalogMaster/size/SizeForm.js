import React, { useEffect, useState, useContext } from "react";
import Head from "../../../layout/head/Head";
import { toastfunc, toastsuccess } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import {
  BlockTitle,
  CancelButton,
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
import {
  createSize,
  getSizeById,
  updateSizeById,
} from "../../../redux/thunks/catalogMaster";
import IsRequired from "../../../components/erp-required/erp-required";
import { useProducts } from "../../../components/filters/filterHooks";
import { ProductDropdown } from "../../../components/filters/retailFilters";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const SizeForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.sizeReducer
  );
  const { sizeInfo } = useSelector((state) => state.sizeReducer);
  const [name, setName] = useState();
  const [values, setValues] = useState();
  const [id_product, setProduct] = useState();

  const [active, setActive] = useState(true);
  const { products } = useProducts();
  const { transformWord } = useContext(WordTransformerContext);
  console.log(sizeInfo);
  useEffect(() => {
    if (id !== undefined) {
      dispatch(getSizeById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (sizeInfo != null) {
      setName(sizeInfo?.name);
      setValues(sizeInfo?.value);
      setProduct(sizeInfo?.id_product);
      setActive(sizeInfo?.active);
      reset();
    }
  }, [sizeInfo, reset]);

  const form_submit = async (data, actionType) => {
    if (id === undefined) {
      create_size(data, actionType);
    } else {
      update_size(data, actionType);
    }
  };

  // const create_size = async (data, actionType) => {
  //   await dispatch(createSize(data)).unwrap();
  //   if (!isError) {
  //     toastsuccess(name + " Added successfully");
  //     if (actionType === "saveAndNew") {
  //       reset_form();
  //     } else if (actionType === "saveAndClose") {
  //       navigate(`${process.env.PUBLIC_URL}/catalogmaster/size/list`);
  //     }
  //   } else {
  //     reset_form();
  //   }
  // };

  const create_size = async (data, actionType) => {
    try {
      await dispatch(createSize(data)).unwrap();
      toastsuccess(name + " Added successfully");

      if (actionType === "saveAndNew") {
        reset_form();
      } else if (actionType === "saveAndClose") {
        navigate(`${process.env.PUBLIC_URL}/catalogmaster/size/list`);
      }
    } catch (error) {
      const msg =
        error?.data?.non_field_errors?.[0] ||
        error?.message ||
        "Something went wrong!";
      toastfunc(msg);
    }
  };

  // const update_size = async (data, actionType) => {
  //   const update_data = { id: id, putData: data };
  //   await dispatch(updateSizeById(update_data)).unwrap();
  //   if (!isError) {
  //     toastsuccess(name + " Updated successfully");
  //     navigate(`${process.env.PUBLIC_URL}/catalogmaster/size/list`);
  //   } else {
  //     reset_form();
  //   }
  // };

  const update_size = async (data, actionType) => {
    try {
      const update_data = { id: id, putData: data };
      await dispatch(updateSizeById(update_data)).unwrap();
      toastsuccess(name + " Updated successfully");
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/size/list`);
    } catch (error) {
      const msg =
        error?.data?.non_field_errors?.[0] ||
        error?.message ||
        "Something went wrong!";
      toastfunc(msg);
    }
  };

  const reset_form = async () => {
    reset();
    setName("");
    setValues("");
    setActive(true);
    setProduct("");
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        if (id !== undefined) {
          handleSubmit((data) => form_submit(data, "saveAndClose"))();
        } else {
          handleSubmit((data) => form_submit(data, "saveAndClose"))();
        }
      }, 0); // <-- Slight delay after blur
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/size/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title="Size" />
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
                    form_submit(data, "saveAndNew")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton>

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    form_submit(data, "saveAndClose")
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
                      `${process.env.PUBLIC_URL}/catalogmaster/size/list`
                    )
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
                  onClick={handleSubmit((data) =>
                    form_submit(data, "saveAndClose")
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
                      `${process.env.PUBLIC_URL}/catalogmaster/size/list`
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
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="size_name">
                    Name
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"name"}
                    placeholder="Size Name"
                    value={name}
                    SetValue={(value) => {
                      setName(transformWord(value));
                      clearErrors("name");
                    }}
                    message={errors.name && "Size Name is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col md="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Product
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <ProductDropdown
                  register={register}
                  id={"id_product"}
                  products={products}
                  selectedProduct={id_product}
                  onProductChange={setProduct}
                  isRequired={true}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.id_product && "Product is Required"}
                ></ProductDropdown>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="value">
                    Value
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"value"}
                    placeholder="Size Value"
                    value={values}
                    SetValue={(value) => {
                      setValues(value);
                      clearErrors("value");
                    }}
                    message={errors.values && "Size Value is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="status">
                    Status
                    <isRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
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

export default SizeForm;

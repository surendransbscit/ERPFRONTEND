import React from "react";
import { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { Col, Row, TextInputField } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import {
  createOtherInventoryCategory,
  getOtherInventoryCategoryById,
  updateOtherInventoryCategoryById,
} from "../../../redux/thunks/otherInventory";

const OtherInventoryCategoryForm = () => {
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
    (state) => state.otherInventoryCategoryReducer
  );
  const { otherInventoryCategoryInfo } = useSelector(
    (state) => state.otherInventoryCategoryReducer
  );
  const [category, setCategory] = useState();
  const [categoryType, setCategoryType] = useState(1);
  const [shortcode, setShortCodes] = useState();

  const categoryTypeOptions = [
    {
      label: "Chit Gift",
      value: 1,
    },
    {
      label: "Packing items",
      value: 2,
    },
    {
      label: "Retail Sales gift",
      value: 3,
    },
    {
      label: "others",
      value: 4,
    },
  ];

  const postData = async () => {
    const adddata = {
      name: category,
      cat_type: categoryType,
      short_code: shortcode,
    };
    console.log(adddata);

    try {
      await dispatch(createOtherInventoryCategory(adddata)).unwrap();
      toastsuccess(category + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/other_inventory/category/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      name: category,
      cat_type: categoryType,
      short_code: shortcode,
    };
    try {
      await dispatch(createOtherInventoryCategory(adddata)).unwrap();
      toastsuccess("Category Added successfully");
      setCategory("");
      setShortCodes("");
      setCategoryType(1);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getOtherInventoryCategoryById(id));
  }, [dispatch, id]);

  useEffect(() => {
    // otherInventoryCategoryInfo !== undefined && (
    //   setCategory(otherInventoryCategoryInfo?.name),
    //   setCategoryType(otherInventoryCategoryInfo?.cat_type),
    //   setShortCodes(otherInventoryCategoryInfo?.short_code),
    //   reset()
    // )

    if (otherInventoryCategoryInfo !== null && id !== undefined) {
      setCategory(otherInventoryCategoryInfo?.name);
      setCategoryType(otherInventoryCategoryInfo?.cat_type);
      setShortCodes(otherInventoryCategoryInfo?.short_code);
      reset();
    }
  }, [otherInventoryCategoryInfo, reset, id]);

  const putData = async () => {
    const adddata = {
      name: category,
      cat_type: categoryType,
      short_code: shortcode,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };

    try {
      await dispatch(updateOtherInventoryCategoryById(reduxData));
      toastsuccess("Category Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/other_inventory/category/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/other_inventory/category/list`);
    }
  }, [add, id, navigate]);

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    if (id !== undefined) {
      handleSubmit(putData)();
    } else {
      handleSubmit(postData)();
    }
  });

  return (
    <React.Fragment>
      <Head title="Category" />
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
            <Col md={1}></Col>
            {add !== undefined && (
              <Col md={6} className="text-right flex">
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
                  onClick={handleSubmit((data) => postData(data, "saveAndClose"))}
                >
                  {issubmitting ? "Saving" : "Save & Close [Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/other_inventory/category/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={6} className="text-right flex">
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
                    navigate(
                      `${process.env.PUBLIC_URL}/other_inventory/category/list`
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
                  <label className="form-label" htmlFor="size_name">
                    Category Name
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"category"}
                    placeholder="Category Name"
                    value={category}
                    SetValue={(value) => {
                      setCategory(value);
                      clearErrors("category");
                    }}
                    message={errors.category && "Category Name is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col md="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="floor">
                    Category Type
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <div className="form-control-wrap">
                    <div className="form-control-select">
                      <select
                        className="form-control form-select"
                        id="categoryType"
                        {...register("categoryType", {
                          required: true,
                        })}
                        value={categoryType}
                        onChange={(e) => {
                          setCategoryType(parseInt(e.target.value));
                        }}
                        placeholder="Category Type"
                      >
                        <option label="Select Category Type" value=""></option>
                        {categoryTypeOptions?.map((item, index) => (
                          <option key={index} value={item?.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      {errors?.categoryType && (
                        <span className="invalid">This field is required</span>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="value">
                    Short code
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"shortcode"}
                    placeholder="Short Code"
                    value={shortcode}
                    SetValue={(value) => {
                      setShortCodes(value);
                      clearErrors("shortcode");
                    }}
                    message={errors.shortcode && "Short code is Required"}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default OtherInventoryCategoryForm;

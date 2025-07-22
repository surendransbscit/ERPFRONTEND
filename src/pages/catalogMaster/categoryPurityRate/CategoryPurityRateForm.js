import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import { CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastfunc, toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, Row } from "../../../components/Component";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";

import { CategoryDropdown, PurityDropdown } from "../../../components/filters/retailFilters";
import { useCategories, usePurities } from "../../../components/filters/filterHooks";
import { createCategoryPurityRate, getCategoryPurityRate } from "../../../redux/thunks/catalogMaster";
import { useHotkeys } from "react-hotkeys-hook";
import { getPagePermission } from "../../../redux/thunks/coreComponent";

const CategoryPurityRateForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
    watch,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { categories } = useCategories();
  const { purities } = usePurities();

  const pathName = location?.pathname;
     const { pagePermission } = useSelector((state) => state.coreCompReducer);
  
     useEffect(() => {
        dispatch(getPagePermission({ path: pathName }));
      }, [pathName, dispatch]);
  
    useEffect(() => {
          if (pagePermission?.add === false || pagePermission === undefined || pagePermission === null) {
            navigate(`${process.env.PUBLIC_URL}/`);
          }
        }, [pagePermission, navigate]);


  const [categoryPurityRate, setCategoryPurityRate] = useState([]);

  const { isLoading: issubmitting, categoryPurityRateList } = useSelector((state) => state.categoryPurityRateReducer);

  const editCategoryPurityRate = ({ name, val, ids, ...params }) => {
    setCategoryPurityRate((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id == ids) {
          setValue(`${name + obj.id}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const postData = async () => {
    // const catPureRate = categoryPurityRate?.filter(
    //   (item) => item?.rate_per_gram != null && item?.rate_per_gram != undefined && item?.rate_per_gram != 0
    // );
    const catPureRate = categoryPurityRate
      ?.filter(
        (item) =>
          item?.rate_per_gram != null &&
          item?.rate_per_gram !== undefined &&
          item?.rate_per_gram !== 0
      )
      .map((item) => ({
        ...item,
        show_in_listing: item.show_in_listing || false, 
      }));

    const addData = {
      cat_pur_rate: catPureRate,
    };
    console.log(addData);
    try {
      await dispatch(createCategoryPurityRate(addData)).unwrap();
      toastsuccess("Category Purity Rate Created successfully");
      // dispatch(getCategoryPurityRate());
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/category_purity_rate/list`);
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    dispatch(getCategoryPurityRate());
  }, [dispatch]);

  useEffect(() => {
    if (categoryPurityRateList?.length > 0) {
      setCategoryPurityRate(categoryPurityRateList);
    }
  }, [categoryPurityRateList]);

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    if (id !== undefined) {
      handleSubmit(putData)();
    } else {
      handleSubmit(postData)();
    }
  },{
    enableOnFormTags: true, // Enable hotkeys inside input fields
    preventDefault: true, // Prevent default browser Save
  });

  return (
    <React.Fragment>
      <Head title={title ? title : "Supplier Product"} />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>

            <Col md={5} className="text-right flex">
              <SaveButton disabled={issubmitting} size="md" color="primary" onClick={handleSubmit(postData)}>
                {issubmitting ? "Saving" : "Save "}
              </SaveButton>

              <CancelButton
                disabled={issubmitting}
                color="danger"
                size="md"
                onClick={() => navigate(`${process.env.PUBLIC_URL}/catalogmaster/category/list`)}
              >
                Cancel
              </CancelButton>
            </Col>
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>S. No.</th>
                      <th>Category</th>
                      <th>Purity</th>
                      <th>Rate</th>
                      <th>Show in Listing</th>
                    </tr>
                  </thead>

                  <tbody>
                    {categoryPurityRate?.map((obj, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="form-group" style={{ width: "300px" }}>
                              <CategoryDropdown
                                readOnly={true}
                                register={register}
                                id={`category${obj.id}`}
                                categories={categories}
                                selectedCategory={obj?.category}
                                onCategoryChange={(value) => {
                                  editCategoryPurityRate({
                                    ids: obj?.id,
                                    name: "category",
                                    val: value,
                                  });
                                }}
                                isRequired={true}
                                clearErrors={clearErrors}
                                setValue={setValue}
                                message={errors?.[`category` + `${String(obj.id)}`] && "Category is Required"}
                              // tabIndex={3}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="form-group" style={{ width: "150px" }}>
                              <PurityDropdown
                                readOnly={true}
                                register={register}
                                id={`purity${obj.id}`}
                                purities={purities}
                                categories={categories}
                                selectedCategory={obj?.category}
                                onPurityChange={(value) => {
                                  editCategoryPurityRate({
                                    ids: obj?.id,
                                    name: "purity",
                                    val: value,
                                  });
                                }}
                                selectedPurity={obj?.purity}
                                isRequired={true}
                                clearErrors={clearErrors}
                                setValue={setValue}
                                message={errors?.[`purity` + `${String(obj.id)}`] && "Purity is Required"}
                              // tabIndex={4}
                              />
                            </div>
                          </td>
                          <td>
                            <input
                              {...register(`rate_per_gram${obj.id}`, {
                                required: "Required",
                              })}
                              id={`rate_per_gram${obj.id}`}
                              type="number"
                              name="rate_per_gram"
                              step={1}
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              placeholder="Rate Per Gram"
                              min={0}
                              onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                              value={obj?.rate_per_gram}
                              onChange={(e) => {
                                editCategoryPurityRate({
                                  ids: obj?.id,
                                  name: "rate_per_gram",
                                  val: e.target.value,
                                });
                                setValue("rate_per_gram" + obj?.id, e.target.value);
                              }}
                              style={{ width: "120px" }}
                            />
                            {errors?.[`rate_per_gram` + `${String(obj?.id)}`] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {errors?.[`rate_per_gram` + `${String(obj?.id)}`].message}
                              </span>
                            )}
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              onChange={(event) => {
                                editCategoryPurityRate({
                                  ids: obj?.id,
                                  name: "show_in_listing",
                                  val: event.target.checked,
                                });
                              }}
                              checked={obj?.show_in_listing || false}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default CategoryPurityRateForm;

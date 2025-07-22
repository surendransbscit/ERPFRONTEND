import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHotkeys } from "react-hotkeys-hook";
import ReactQuill from "react-quill";
import { Button, Input } from "reactstrap";
import { createDailyStatus } from "../../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../../components/sds-toast-style/toast-style";
import Head from "../../../../layout/head/Head";
import Content from "../../../../layout/content/Content";
import {
  CancelButton,
  Col,
  PreviewCard,
  Row,
  SaveButton,
  SwitchInputField,
  TextInputField,
} from "../../../../components/Component";
import ModifiedBreadcrumb from "../../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { ZoomImage } from "../../../../components/form-control/ZoomImage";
import {
  createAdminProductMaster,
  getAdminProductMasterById,
  updateAdminProductMasterById,
} from "../../../../redux/thunks/adminMaster";
import AdminModuleMasterDropdownMulti from "../../../../components/common/dropdown/AdminModuleMasterDropdownMulti";
import { useModuleMaster } from "../../../../components/filters/filterHooks";
const AdminProductMaster = () => {
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
    setError
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting } = useSelector(
    (state) => state.adminProductMasterReducer
  );
  const { adminProductMasterInfo } = useSelector(
    (state) => state.adminProductMasterReducer
  );
  const { moduleOptionList } = useModuleMaster();
  const [module, setModule] = useState();
  const [product, setProduct] = useState();
  const [shortcode, setShortcode] = useState();
  const [approxcost, setApproxCost] = useState();


  const postData = async () => {
    const formattedModule = module?.map((item) => item.value);
    const adddata = {
      product_name: product,
      short_code: shortcode,
      Approx_cost: approxcost,
      module: formattedModule,
    };
    console.log(adddata.module, "module");

    try {
      await dispatch(createAdminProductMaster(adddata)).unwrap();
      toastsuccess("Product added successfully");
      navigate(`${process.env.PUBLIC_URL}/admin/master/product_master/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const formattedModule = module?.map((item) => item.value);
    const adddata = {
      product_name: product,
      short_code: shortcode,
      Approx_cost: approxcost,
      module:formattedModule,
    };
    try {
      await dispatch(createAdminProductMaster(adddata)).unwrap();
      toastsuccess("Admin Product Master Added successfully");
      setProduct("");
      setShortcode("");
      setApproxCost("");
      setModule("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getAdminProductMasterById(id));
  }, [dispatch, id]);

  useEffect(() => {
    // adminProductMasterInfo !== undefined && (
    //   setProduct(adminProductMasterInfo?.product_name),
    //   setShortCode(adminProductMasterInfo?.short_code),
    //   setApproxCost(adminProductMasterInfo?.approx_cost),
    //   reset()
    // )

    if (adminProductMasterInfo !== null && id !== undefined) {
      setProduct(adminProductMasterInfo?.product_name);
      setShortcode(adminProductMasterInfo?.short_code);
      setApproxCost(adminProductMasterInfo?.Approx_cost);
      const selectedModules = adminProductMasterInfo?.module?.map((id) => {
        const found = moduleOptionList?.find((opt) => opt.id_module === id);
        return {
          label: found?.module_name || `Module ${id}`,
          value: id,
        };
      });
      setModule(selectedModules);

      reset();
    }
  }, [adminProductMasterInfo, reset, id]);

  const putData = async () => {
    const formattedModule = module?.map((item) => item.value);
    const adddata = {
      product_name: product,
      short_code: shortcode,
      approx_cost: approxcost,
      module:formattedModule,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };

    try {
      await dispatch(updateAdminProductMasterById(reduxData));
      toastsuccess("Admin Product Master Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/admin/master/product_master/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/admin/master/product_master/list`);
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
      <Head title={title ? title : "Admin Product Master"} />
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
                  onClick={handleSubmit((data) => postData(data, "saveAndClose"))}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/admin/master/product_master/list`
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
                      `${process.env.PUBLIC_URL}/admin/master/product_master/list`
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
                  <label className="form-label" htmlFor="product_name">
                    Product Name
                    <isRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"product"}
                    placeholder="Product Name"
                    value={product}
                    SetValue={(value) => {
                      setProduct(value);
                      clearErrors("product");
                    }}
                    message={errors.product && "Product Name is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="short_code">
                    Short Code
                    <isRequired />
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
                      setShortcode(value);
                      clearErrors("shortcode");
                    }}
                    message={errors.shortcode && "Short Code is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="approx_cost">
                    Approximate Cost
                    <isRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"approx_cost"}
                    placeholder="Approx Cost"
                    value={approxcost}
                    SetValue={(value) => {
                      setApproxCost(value);
                      clearErrors("approxcost");
                    }}
                    message={
                      errors.approxcost && "Approximate Cost is Required"
                    }
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col md="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="size">
                    Module
                    <isRequired />
                  </label>
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <AdminModuleMasterDropdownMulti
                    id={"module"}
                    optionLabel={"Choose Module..."}
                    register={register}
                    setError={setError}
                    clearErrors={clearErrors}
                    value={module}
                    SetValue={setModule}
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

export default AdminProductMaster;
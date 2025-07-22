import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import PreviewTable from "../../../components/sds-table/PreviewTable";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import {
  Col,
  Row,
  Icon,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "reactstrap";
import {
  getAllSubDesignMapping,
  createSubDesignMapping,
  deleteSubDesignMappingById,
} from "../../../redux/thunks/catalogMaster";
import IsRequired from "../../../components/erp-required/erp-required";
import { ProductDropdown, DesignDropdown, SubDesignDropdown } from "../../../components/filters/retailFilters";
import { useProducts, useDesigns, useAllDesigns, useAllSubDesigns } from "../../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";

const SubDesignMappingForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    reset,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading: issubmitting,
    subDesignMappingList,
  } = useSelector((state) => state.subDesignMappingReducer);

  const { products } = useProducts();

  const { design } = useAllDesigns();

  const { designs } = useDesigns();

  const { subDesign } = useAllSubDesigns();

  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedDesign, setSelectedDesign] = useState();
  const [selectedSubDesign, setSelectedSubDesign] = useState();

  const [filterProduct, setFilterProduct] = useState();
  const [filterDesign, setFilterDesign] = useState();
  const [filterSubDesign, setFilterSubDesign] = useState();


  useEffect(() => {
    dispatch(getAllSubDesignMapping());
  }, []);

  const form_submit = async (data, actionType) => {
    create_sub_design_mapping(data, actionType);
  };


  const create_sub_design_mapping = async (data, actionType) => {
    try {
      await dispatch(createSubDesignMapping(data)).unwrap();
      toastsuccess("Mapping Details Added successfully");
      if (actionType === "saveAndNew") {
        reset_form();
        dispatch(getAllSubDesignMapping());
      } else if (actionType === "saveAndClose") {
        navigate(`${process.env.PUBLIC_URL}/catalogmaster/design_mapping/list`);
      }
    } catch (error) {

      let message = error?.response?.data?.message;

      if (typeof message === 'string' && message.includes('section_name')) {
        setError('section_name', { type: 'manual', 'message': 'Section name already exists' });
      }

    }
  };


  const getMappingDetails = () => {

    var filters = "50";
    if (filterProduct) {
      filters += '&id_product=' + filterProduct;
    }
    if (filterDesign) {
      filters += '&id_design=' + filterDesign;
    }
    if (filterSubDesign) {
      filters += '&id_sub_design=' + filterSubDesign;
    }
    dispatch(getAllSubDesignMapping(filters));

  }

  const reset_form = async () => {
    reset("");
    setSelectedProduct();
    setSelectedDesign();
    setSelectedSubDesign();
  };

  const deleteMappping = async (index) => {
    var deleteId = subDesignMappingList[index].id_product_mapping
    try {
      await dispatch(deleteSubDesignMappingById(deleteId)).unwrap();
      dispatch(getAllSubDesignMapping());
      toastsuccess("Sub Design Mapping  Deleted successfully");
    } catch (error) {
      console.log(error);

    }
  }

  const columns = [
    { 'header': 'Product', 'accessor': 'product_name', 'textAlign': 'left' },
    { 'header': 'Design', 'accessor': 'design_name', 'textAlign': 'left' },
    { 'header': 'Sub Design', 'accessor': 'sub_design_name', 'textAlign': 'left' },
  ];
  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    if (id !== undefined) {
      handleSubmit(create_sub_design_mapping)();
    }
  },{
    enableOnFormTags: true, // Enable hotkeys inside input fields
    preventDefault: true, // Prevent default browser Save
  });

  return (
    <React.Fragment>
      <Head title="Design Mapping" />
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
            <Col md={5} className="text-right flex">

              <SaveButton
                disabled={issubmitting}
                size="md"
                color="primary"
                onClick={handleSubmit((data) =>
                  form_submit(data, "saveAndNew")
                )}
              >
                {issubmitting ? "Saving" : "Save"}
              </SaveButton>

              <Button color="secondary" size="md" onClick={() => getMappingDetails()}>
                Search
              </Button>

            </Col>
          </Row>


          <div className="custom-grid">
            <Row className="g-3 align-center">

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Product
                    <IsRequired />
                  </label>
                  <ProductDropdown
                    register={register}
                    id={"id_product"}
                    products={products}
                    selectedProduct={selectedProduct}
                    onProductChange={(value) => {
                      setSelectedProduct(value);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectedProduct && "Product is Required"}
                  />
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedDesign">
                    Design
                    <IsRequired />
                  </label>
                  <DesignDropdown
                    register={register}
                    id={"id_design"}
                    designs={designs}
                    selectedProduct={selectedProduct}
                    selectedDesign={selectedDesign}
                    onDesignChange={(value) => {
                      setSelectedDesign(value);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectedDesign && "Design is Required"}
                  />
                </div>
              </Col>

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedDesign">
                    Sub Design
                    <IsRequired />
                  </label>
                  <SubDesignDropdown
                    isMulti={true}
                    register={register}
                    id={"id_sub_design"}
                    subDesigns={subDesign}
                    selectedSubDesign={selectedSubDesign}
                    onSubDesignChange={(value) => {
                      setSelectedSubDesign(value);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectedSubDesign && "Sub Design is Required"}
                  />
                </div>
              </Col>



              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Filter Product
                    <IsRequired />
                  </label>
                  <ProductDropdown
                    register={register}
                    id={"filterProduct"}
                    products={products}
                    selectedProduct={filterProduct}
                    setValue={setValue}
                    onProductChange={(value) => {
                      setFilterProduct(value);
                    }}
                    placeholder={"Filter Product"}
                  />
                </div>


              </Col>

              <Col lg="2">

                <div className="form-group">
                  <label className="form-label" htmlFor="selectedDesign">
                    Filter Design
                    <IsRequired />
                  </label>
                  <DesignDropdown
                    register={register}
                    id={"filterDesign"}
                    selectedProduct={filterProduct}
                    designs={designs}
                    selectedDesign={filterDesign}
                    setValue={setValue}
                    onDesignChange={(value) => {
                      setFilterDesign(value);
                    }}
                    placeholder={"Filter Design"}
                  />
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedDesign">
                    Filter Sub Design
                    <IsRequired />
                  </label>
                  <SubDesignDropdown
                    register={register}
                    id={"filterSubDesign"}
                    subDesigns={subDesign}
                    selectedSubDesign={filterSubDesign}
                    onSubDesignChange={(value) => {
                      setFilterSubDesign(value);
                    }}
                    isRequired={false}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectedSubDesign && "Sub Design is Required"}
                    placeholder={"Filter Sub Design"}
                  />
                </div>
              </Col>


            </Row>




            <Row className="mt-2" md={12}>
              <PreviewTable columns={columns} data={subDesignMappingList} numericFields={''} onDelete={deleteMappping} isTotalReq={false} />
            </Row>


          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default SubDesignMappingForm;

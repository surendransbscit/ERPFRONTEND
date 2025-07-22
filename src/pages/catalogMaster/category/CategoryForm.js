import React, { useContext, useEffect, useState } from "react";
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
import {
  createCategory,
  getCategoryById,
  updateCategoryById,
} from "../../../redux/thunks/catalogMaster";
import { ZoomImage } from "../../../components/form-control/ZoomImage";
import { Button, Input } from "reactstrap";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { MetalDropdown } from "../../../components/filters/retailFilters";
import { useMetals, usePurities } from "../../../components/filters/filterHooks";
import PurityDropdownMulti from "../../../components/common/dropdown/PurityDropdownMulti";
import { useHotkeys } from "react-hotkeys-hook";
import ShortCutKeys from "../../../components/shortCutKeys/ShortCutKeys";
import { useShortCodeContext } from "../../../contexts/ShortCodeContexts";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const CategoryForm = () => {
  const location = useLocation();
  const { isShortCodeDisabled } = useShortCodeContext();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const { purities } = usePurities();

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
    (state) => state.categoryReducer
  );
  const { categoryInfo } = useSelector((state) => state.categoryReducer);

  const [catName, setCatName] = useState();
  const [catType, setCatType] = useState(1);
  const [catCode, setCatCode] = useState();
  const [sort, setSort] = useState();
  const [description, setDescription] = useState();
  const [status, setStatus] = useState(true);
  const [isMultimetal, setIsMultimetal] = useState(false);
  const [image, setImage] = useState();
  const [metal, setMetal] = useState("");
  const [purity, setPurity] = useState([]);
  const [showInMetalRate, setShowInMetalRate] = useState("0");


  const { metals } = useMetals();
  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      cat_name: catName,
      cat_type: catType,
      cat_code: catCode,
      description,
      status,
      sort,
      image: image ? image : null,
      is_multimetal: isMultimetal,
      id_metal: metal,
      purity: purity,
      show_in_metal_rate: showInMetalRate
    };
    try {
      await dispatch(createCategory(adddata)).unwrap();
      toastsuccess(catName + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/category/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      cat_name: catName,
      cat_type: catType,
      cat_code: catCode,
      description,
      status,
      sort,
      image: image ? image : null,
      is_multimetal: isMultimetal,
      id_metal: metal,
      purity: purity,
      show_in_metal_rate: showInMetalRate
    };
    try {
      await dispatch(createCategory(adddata)).unwrap();
      toastsuccess("Category Added successfully");
      setCatName("");
      setCatType(1);
      setCatCode();
      setDescription();
      setSort();
      setIsMultimetal(false);
      setStatus(true);
      setMetal("");
      setPurity([]);
      setImage("");
      setShowInMetalRate("0");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getCategoryById(id));
  }, [dispatch, id]);

  const convert64 = async (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e);
    reader.onload = () => {
      setImage(reader?.result);
    };
  };

  const isBase64 = (str) => {
    try {
      return str.startsWith("data:image");
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    if(categoryInfo != null && categoryInfo != undefined){
      setCatName(categoryInfo?.cat_name)
        setCatType(categoryInfo?.cat_type)
        setCatCode(categoryInfo?.cat_code)
        setStatus(categoryInfo?.status)
        setIsMultimetal(categoryInfo?.is_multimetal)
        setDescription(categoryInfo?.description)
        setSort(categoryInfo?.sort)
        setMetal(categoryInfo?.id_metal)
        setPurity(categoryInfo?.id_purity)
        setImage(categoryInfo?.image)
        setShowInMetalRate(categoryInfo?.show_in_metal_rate)
        reset()
    }
  }, [categoryInfo, reset]);

  const putData = async () => {
    const adddata = {
      cat_name: catName,
      cat_type: catType,
      cat_code: catCode,
      description,
      status,
      sort,
      image: image ? image : null,
      is_multimetal: isMultimetal,
      id_metal: metal,
      purity: purity,
      show_in_metal_rate: showInMetalRate

    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateCategoryById(reduxData)).unwrap();
      toastsuccess("Category Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/category/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/category/list`);
    }
  }, [add, id, navigate]);

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

  // Reload Shortcut (Ctrl+R)
  useHotkeys("ctrl+r", (event) => {
    event.preventDefault();
    window.location.reload();
  });


  return (
    <React.Fragment>
      <Head title={title ? title : "Category"} />
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
              {add !== undefined && (
                <>
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
                      navigate(
                        `${process.env.PUBLIC_URL}/catalogmaster/category/list`
                      )
                    }
                  >
                    Cancel
                  </CancelButton>
                </>
              )}
              {id !== undefined && (
                <>
                  {" "}
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
                        `${process.env.PUBLIC_URL}/catalogmaster/category/list`
                      )
                    }
                  >
                    Cancel
                  </CancelButton>
                </>
              )}
            </Col>
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Metal
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <MetalDropdown
                    register={register}
                    id={"metal"}
                    metals={metals}
                    selectedMetal={metal}
                    onMetalChange={setMetal}
                    isRequired={false}
                    clearErrors={clearErrors}
                    setValue={setValue}
                  ></MetalDropdown>
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="catName">
                    Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"catName"}
                    placeholder="Category Name"
                    value={catName}
                    SetValue={(value) => {
                      setCatName(transformWord(value));
                      clearErrors("catName");
                    }}
                    message={errors.catName && " Category name is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="catCode">
                    Code <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    isDisabled={isShortCodeDisabled}
                    register={register}
                    isRequired={!isShortCodeDisabled}
                    id={"catCode"}
                    placeholder="Category Code"
                    value={catCode}
                    SetValue={(value) => {
                      setCatCode(value);
                      clearErrors("catCode");
                    }}
                    message={errors.catCode && " Category code is Required"}
                  />
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="catType">
                    Type
                  </label>
                </div>
              </Col>
              <Col lg="5">
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="Ornament"
                          type="radio"
                          name={"catType"}
                          value={"1"}
                          className="custom-control-input"
                          checked={catType == "1"}
                          onChange={(e) => {
                            setCatType(e.target.value);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="Ornament"
                        >
                          Ornament
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="Bullion"
                          type="radio"
                          value={"2"}
                          name={"catType"}
                          className="custom-control-input "
                          checked={catType == "2"}
                          onChange={(e) => {
                            setCatType(e.target.value);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="Bullion"
                        >
                          Bullion
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="Stone"
                          type="radio"
                          value={"3"}
                          name={"catType"}
                          className="custom-control-input "
                          checked={catType == "3"}
                          onChange={(e) => {
                            setCatType(e.target.value);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="Stone">
                          Stone
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="Alloy"
                          type="radio"
                          value={"4"}
                          name={"catType"}
                          className="custom-control-input "
                          checked={catType == "4"}
                          onChange={(e) => {
                            setCatType(e.target.value);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="Alloy">
                          Alloy
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="oldMetalType"
                          type="radio"
                          value={"4"}
                          name={"catType"}
                          className="custom-control-input "
                          checked={catType == "5"}
                          onChange={(e) => {
                            setCatType("5");
                          }}
                        />
                        <label className="custom-control-label" htmlFor="oldMetalType">
                          Old Metal
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="sort">
                    Sort
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <NumberInputField
                    placeholder="Sort"
                    id={"sort"}
                    value={sort}
                    isRequired={true}
                    register={register}
                    max={100000000}
                    reqValueError={"This field is required"}
                    maxError={"Max Length is 100000000"}
                    setValue={setValue}
                    SetValue={(value) => {
                      setSort(value);
                      clearErrors("sort");
                    }}
                  // message={errors.sort && "sort no is Required"}
                  />
                  {errors.sort && (
                    <span className="text-danger">{errors.sort.message}</span>
                  )}
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Purity
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  {/* <PurityDropdownMulti
                    id={"purity"}
                    optionLabel={"Choose Purity..."}
                    register={register}
                    value={purity}
                    SetValue={setPurity}
                  />
                  {errors.purity && (
                    <span className="invalid">This field is required</span>
                  )} */}
                  <PurityDropdownMulti
                    // width={purity?.length > 0 ? "200px" : "150px"}
                    id={`purity`}
                    register={register}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    selectedPurity={purity}
                    purities={purities}
                    onPurityChange={(val) => {
                      console.log(val);
                      setPurity(val)
                    }}
                    isRequired={true}
                    message={errors?.[`purity`] && "Purity is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="isMultimetal">
                    Multimetal
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="custom-control custom-control-sm custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="isMultimetal"
                    name={isMultimetal}
                    checked={isMultimetal}
                    onChange={(e) => setIsMultimetal(e.target.checked)}
                  />

                  <label
                    className="custom-control-label"
                    htmlFor="isMultimetal"
                  >
                    {isMultimetal == true ? "Yes" : "No"}
                  </label>
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="status">
                    status
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <SwitchInputField
                  register={register}
                  id={"status"}
                  checked={status}
                  SetValue={setStatus}
                  name={"status"}
                />
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="image">
                    Image
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-control-wrap">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">Upload</span>
                    </div>
                    <div className="form-file">
                      <Input
                        type="file"
                        accept="image/*"
                        id="image"
                        onChange={(e) => convert64(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="description">
                    Description
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <textarea
                    rows={1}
                    className="form-control form-control-sm"
                    name="description"
                    placeholder="Category description"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col md="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="showInMetalRate">
                    Show Metal Rate
                  </label>
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="showInMetalRate_yes"
                          type="radio"
                          name={"showInMetalRate_yes"}
                          value={"1"}
                          className="custom-control-input"
                          checked={showInMetalRate == "1"}
                          onChange={(e) => {
                            setShowInMetalRate(e.target.value);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="showInMetalRate_yes">
                          Yes
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="showInMetalRate_no"
                          type="radio"
                          value={"0"}
                          name={"showInMetalRate_no"}
                          className="custom-control-input"
                          checked={showInMetalRate == "0"}
                          onChange={(e) => {
                            setShowInMetalRate(e.target.value);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="showInMetalRate_no">
                          No
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="4"></Col>
              {image == undefined ||
                (image !== null && (
                  <>
                    <Col lg="5">
                      <ZoomImage
                        alt="not found"
                        height={"300px"}
                        width={"600px"}
                        src={isBase64(image) ? image : image + "?" + String()}
                      />
                      <br />
                      <Button
                        className="mt-1 bg-red-500 text-white"
                        size="xs"
                        onClick={() => setImage(undefined)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </>
                ))}
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default CategoryForm;

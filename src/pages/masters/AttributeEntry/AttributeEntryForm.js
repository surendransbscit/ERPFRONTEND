import React, { useEffect, useState, useContext } from "react";
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
import {
  createAttributeEntry,
  getAttributeEntryById,
  updateAttributeEntryById,
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

const AttributeEntryForm = () => {
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
    (state) => state.attributeEntryReducer
  );
  const { attributeEntryInfo } = useSelector((state) => state.attributeEntryReducer);

  const [attributeName, setAttributeName] = useState();
  const [value, SetValues] = useState();
  const [active, setActive] = useState(true);
  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      attribute_name: attributeName,
      value: value ? value : null,
      is_active: active,
    };
    try {
      await dispatch(createAttributeEntry(adddata)).unwrap();
      toastsuccess(attributeName + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/attributeentry/list`);
    } catch (error) {
      console.error(error);
    }

  };

  const postAndCreateNew = async () => {
    const adddata = {
      attribute_name: attributeName,
      value: value ? value : null,
      is_active: active,
    };

    await dispatch(createAttributeEntry(adddata));
    if (isError === false) {
      toastsuccess("Attribute Entry Added successfully");
      setAttributeName("");
      SetValues("");
      setActive(true);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getAttributeEntryById(id));
  }, [dispatch, id]);

  useEffect(() => {
    attributeEntryInfo != undefined &&
      (setAttributeName(attributeEntryInfo?.attribute_name),
        SetValues(attributeEntryInfo?.value),
        setActive(attributeEntryInfo?.is_active),
        reset());
  }, [attributeEntryInfo, reset]);

  const putData = async () => {
    const adddata = {
      attribute_name: attributeName,
      value: value ? value : null,
      is_active: active,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };

    await dispatch(updateAttributeEntryById(reduxData));
    if (isError === false) {
      toastsuccess("Attribute Entry Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/attributeentry/list`);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/attributeentry/list`);
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

  return (
    <React.Fragment>
      <Head title={title ? title : "Attribute Entry"} />
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
                    navigate(`${process.env.PUBLIC_URL}/master/attributeentry/list`)
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
                    navigate(`${process.env.PUBLIC_URL}/master/attributeentry/list`)
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
                  <label className="form-label" htmlFor="attributeName">
                    Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"attributeName"}
                    placeholder="Attribute Name"
                    value={attributeName}
                    SetValue={(value) => {
                      setAttributeName(transformWord(value));
                      clearErrors("attributeName");
                    }}
                    message={errors.attributeName && " Attribute name is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="value">
                    Value
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <NumberInputField
                    placeholder="Value"
                    id={"value"}
                    value={value}
                    isRequired={false}
                    register={register}
                    SetValue={(value) => {
                      SetValues(value);
                      clearErrors("value");
                    }}
                    message={errors.value && "Value is Required"}
                  />

                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
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

export default AttributeEntryForm;

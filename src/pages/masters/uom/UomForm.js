import React, { useEffect, useState, useContext } from "react";
import Head from "../../../layout/head/Head";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
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
  createRetUom,
  getRetUomById,
  updateRetUomById,
} from "../../../redux/thunks/retailMaster";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const UomForm = () => {
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
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading: issubmitting,
    isError,
    uomInfo,
  } = useSelector((state) => state.uomReducer);
  const [uom_name, setUomName] = useState();
  const [uom_short_code, setUomCode] = useState();
  const [uom_status, setUomStatus] = useState(true);
  const { transformWord } = useContext(WordTransformerContext);

  useEffect(() => {
    id !== undefined && dispatch(getRetUomById(id));
  }, [dispatch, id]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    uomInfo != undefined &&
      (setUomName(uomInfo?.uom_name),
        setUomCode(uomInfo?.uom_short_code),
        setUomStatus(uomInfo?.uom_status),
        reset({
          uom_name: uomInfo?.uom_name,
          uom_short_code: uomInfo?.uom_short_code,
          uom_status: uomInfo?.uom_status,
        })
      );
  }, [uomInfo, reset]);
  // useEffect(() => {
  //   // eslint-disable-next-line no-unused-expressions
  //   uomInfo != null
  //     {setUomName(uomInfo?.uom_name);
  //       setUomCode(uomInfo?.uom_short_code);
  //       setUomStatus(uomInfo?.uom_status);
  //       reset()
  //     };
  // }, [uomInfo, reset]);


  const postData = async (actionType) => {
    const adddata = {
      uom_name,
      uom_short_code,
      uom_status
    };
    try {
      await dispatch(createRetUom(adddata)).unwrap();
      toastsuccess(uom_name + " Added successfully");
      if (actionType === "saveAndNew") {
        reset_form();
      } else {
        navigate(`${process.env.PUBLIC_URL}/master/uom/list`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const postAndCreateNew = async () => {
  //   const adddata = {
  //     uom_name,
  //     uom_short_code,
  //     uom_status
  //   };
  //   try {
  //     await dispatch(createRetUom(adddata)).unwrap();
  //     toastsuccess("UOM Added successfully");
  //     setUomName("");
  //     setUomCode("");
  //     setUomStatus(true);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };


  

  const putData = async (actionType) => {
    const adddata = {
      uom_name,
      uom_short_code,
      uom_status
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateRetUomById(reduxData)).unwrap();
      toastsuccess("uom Edited successfully");
      if (actionType === "saveAndNew") {
        reset_form();
      } else {
        navigate(`${process.env.PUBLIC_URL}/master/uom/list`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const reset_form = () => {
    reset({
      uom_name: "",
      uom_short_code: "",
      uom_status: true,
    });
    setUomName("");
    setUomCode("");
    setUomStatus(true);
  };


  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/uom/list`);
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
      <Head title="RetUom" />
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
                onClick={handleSubmit((data) => postData("saveAndNew"))}
              >
                {issubmitting ? "Saving" : "Save & New"}
              </SaveButton>
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) => postData("saveAndClose"))}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>
                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/master/uom/list`
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
                  onClick={handleSubmit((data) => putData("saveAndClose"))}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>
                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/master/uom/list`
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
                  <label className="form-label" htmlFor="uom_name">
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
                    id={"uom_name"}
                    placeholder="Uom Name"
                    value={uom_name}
                    SetValue={(value) => {
                      setUomName(transformWord(value));
                      clearErrors("uom_name");
                    }}
                    message={errors.uom_name && "UOM Name is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="uom_short_code">
                    Code
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"uom_short_code"}
                    placeholder="Uom Code"
                    value={uom_short_code}
                    SetValue={(value) => {
                      setUomCode(value);
                      clearErrors("");
                    }}
                    message={errors.uom_short_code && "Uom Code is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="uom_status">
                    Status
                    <isRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <SwitchInputField
                  register={register}
                  id={"uom_status"}
                  checked={uom_status}
                  SetValue={setUomStatus}
                  name={"uom_status"}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default UomForm;

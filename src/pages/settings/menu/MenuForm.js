import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import { BlockTitle, CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, Row, SwitchInputField, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import { createMenu, fetchMenu, getMenuById, updateMenuById } from "../../../redux/thunks/settings";
import Select from "react-select";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
// import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const MenuForm = () => {
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
  console.log(id);
  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector((state) => state.menuReducer);
  const { menuInfo } = useSelector((state) => state.menuReducer);
  const { menuOptionList } = useSelector((state) => state.menuReducer);

  const [text, setText] = useState();
  const [link, setLink] = useState();
  const [icon, setIcon] = useState();
  const [titlee, setTitlee] = useState();
  const [parent, setParent] = useState(null);
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [save_value_by, setSaveValueBy] = useState(1);
  // const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      text,
      link: link.trim(),
      icon,
      parent: parent == 0 ? null : parent,
      active,
      order,
      title: titlee,
      save_value_by,
    };
    try {
      await dispatch(createMenu(adddata)).unwrap();
      toastsuccess(text + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/settings/menu/list`);
    } catch (error) {
      console.error(error);
    }
  };


  const postAndCreateNew = async () => {
    const adddata = {
      text,
      link: link.trim(),
      icon,
      parent: parent == 0 ? null : parent,
      active,
      order,
      title: titlee,
      save_value_by,
    };
    try {
      await dispatch(createMenu(adddata)).unwrap();
      toastsuccess("Menu Added successfully");
      setText("");
      setLink("");
      setIcon("");
      setParent(null);
      setActive(1);
      setOrder("");
      setTitlee("");
      setSaveValueBy("");
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    id !== undefined && dispatch(getMenuById(id));
  }, [dispatch, id]);

  useEffect(() => {
    menuInfo != undefined &&
      (setText(menuInfo?.text),
        setLink(menuInfo?.link),
        setIcon(menuInfo?.icon),
        setTitlee(menuInfo?.title),
        setParent(menuInfo?.parent),
        setActive(menuInfo?.active),
        setOrder(menuInfo?.order),
        setSaveValueBy(menuInfo?.save_value_by),
        reset());
  }, [menuInfo, reset]);

  const putData = async () => {
    const adddata = {
      text,
      link: link.trim(),
      icon,
      parent: parent == 0 ? null : parent,
      active,
      order,
      title: titlee,
      save_value_by,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateMenuById(reduxData)).unwrap();
      toastsuccess("Menu Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/settings/menu/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/settings/menu/list`);
    }
  }, [add, id, navigate]);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

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
      <Head title={title ? title : "Menu"} />
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
                  onClick={handleSubmit((data) => postAndCreateNew(data, "saveAndNew"))}
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
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/settings/menu/list`)}
                >
                  Cancel
                </CancelButton>

              </Col>
            )}
            {id !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton disabled={issubmitting} size="md" color="primary" onClick={handleSubmit(putData)}>
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/settings/menu/list`)}
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
                  <label className="form-label" htmlFor="Name">
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
                    id={"text"}
                    placeholder="Name"
                    value={text}
                    SetValue={(value) => {
                      setText(value);
                      clearErrors("text");
                    }}
                    message={errors.text && "name is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Parent
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div style={{ position: "relative", zIndex: "999" }}>
                  <Select
                    value={menuOptionList?.find((option) => option.value === parent)}
                    onChange={(e) => setParent(e.value)}
                    options={menuOptionList}
                    placeholder="Select Parent"
                    id={"parent"}
                  />
                  <input type="hidden" value={parent || ""} />
                  {errors.parent && <span className="invalid">This field is required</span>}
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="link">
                    Link
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <div className="form-control-wrap">
                    <input
                      {...register("link", {
                        required: "Link is required",
                      })}
                      className="form-control form-control-sm"
                      type="text"
                      placeholder="Link"
                      value={link}
                      onPaste={(e) => setLink(e.target.value.split(" ").join(""))}
                      onChange={(e) => setLink(e.target.value.split(" ").join(""))}
                    />
                    {errors?.link && (
                      <span className="invalid">
                        <Icon className={"sm"} name="alert-circle" />
                        {errors.link.message}
                      </span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="order">
                    Order
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <div className="form-control-wrap">
                    <input
                      {...register("order", {
                        required: "Order number is required",
                      })}
                      className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                      type="number"
                      placeholder="Order"
                      step={1}
                      min={0}
                      onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                    />
                    {errors?.order && (
                      <span className="invalid">
                        <Icon className={"sm"} name="alert-circle" />
                        {errors.order.message}
                      </span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Icon
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={false}
                    id={"icon"}
                    placeholder="Name"
                    value={icon}
                    SetValue={(value) => {
                      setIcon(value);
                      clearErrors("icon");
                    }}
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

export default MenuForm;

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
  createBanner,
  getBannerById,
  updateBannerById,
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
import { useBranches } from "../../../components/filters/filterHooks";
import { BranchDropdown } from "../../../components/filters/retailFilters";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import ReactQuill from "react-quill";
import ProfileImageUpload from "../../../components/input/profile-image/ProfileImageUpload";
import { Button, Input } from "reactstrap";
import { ZoomImage } from "../../../components/form-control/ZoomImage";

const BannerForm = () => {
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
    setValue,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.bannerReducer
  );
  const { bannerInfo } = useSelector((state) => state.bannerReducer);

  const [bannerName, setbannerName] = useState();
  const [bannerimg, setBannerimg] = useState(null);
  const [description, setDescription] = useState();
  const [isActive, setActive] = useState(true);
  const [link, setLink] = useState();

  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      banner_name: bannerName,
      banner_img: bannerimg,
      banner_description: description,
      banner_status: isActive,
      link: link,
    };
    try {
      await dispatch(createBanner(adddata)).unwrap();
      toastsuccess(bannerName + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/banner/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      banner_name: bannerName,
      banner_img: bannerimg,
      banner_description: description,
      banner_status: isActive,
      link: link,
    };
    try {
      await dispatch(createBanner(adddata)).unwrap();
      toastsuccess(bannerName + " Added successfully");
      setbannerName("");
      setBannerimg(null);
      setActive(true);
      setDescription();
      setLink("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getBannerById(id));
  }, [dispatch, id]);
  console.log(bannerInfo);

  useEffect(() => {
    if (bannerInfo != null) {
      setbannerName(bannerInfo?.banner_name);
      setBannerimg(bannerInfo?.banner_img);
      setDescription(bannerInfo?.banner_description);
      setActive(bannerInfo?.banner_status);
      setLink(bannerInfo?.link);

      reset();
    }
  }, [bannerInfo, reset]);

  const putData = async () => {
    const adddata = {
      banner_name: bannerName,
      banner_img: bannerimg,
      banner_description: description,
      banner_status: isActive,
      link: link,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    console.log(reduxData);

    try {
      await dispatch(updateBannerById(reduxData)).unwrap();
      toastsuccess("Banner Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/banner/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (value) => {
    setDescription(value);
  };

  const convert64 = async (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e);
    reader.onload = () => {
      setBannerimg(reader?.result);
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
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/banner/list`);
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
      }, 0);
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  return (
    <React.Fragment>
      <Head title={title ? title : "Banner"} />
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
                    navigate(`${process.env.PUBLIC_URL}/master/banner/list`)
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
                    navigate(`${process.env.PUBLIC_URL}/master/banner/list`)
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
                  <label className="form-label" htmlFor="bannerName">
                    Banner Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"bannerName"}
                    placeholder="Banner Name"
                    value={bannerName}
                    SetValue={(value) => {
                      setbannerName(transformWord(value));
                      clearErrors("bannerName");
                    }}
                    message={errors.bannerName && " Banner name is required"}
                  />
                </div>
              </Col>
            </Row>

            <Row className="form-group row g-4">
              <Col md="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="bannerName">
                    Image <IsRequired />
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
                        id="bannerimg"
                        onChange={(e) => convert64(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="g-3 align-center mt-2">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="bannerName">
                    Description
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <ReactQuill value={description} onChange={handleChange} />
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4 mt-1">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="link">
                    Link
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"link"}
                    placeholder="Link"
                    value={link}
                    SetValue={(value) => {
                      setLink(value);
                      clearErrors("link");
                    }}
                    message={errors.link && "Link is required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="isActive">
                    Active
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <SwitchInputField
                  register={register}
                  id={"isActive"}
                  checked={isActive}
                  SetValue={setActive}
                  name={"isActive"}
                />
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2"></Col>
              {bannerimg == undefined ||
                (bannerimg !== null && (
                  <>
                    <Col lg="5">
                      <ZoomImage
                        alt="not found"
                        height={"300px"}
                        width={"600px"}
                        src={
                          isBase64(bannerimg)
                            ? bannerimg
                            : bannerimg + "?" + String()
                        }
                      />
                      <br />
                      <Button
                        className="mt-1 bg-red-500 text-white"
                        size="xs"
                        onClick={() => setBannerimg(undefined)}
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

export default BannerForm;

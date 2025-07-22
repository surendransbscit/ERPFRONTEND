import React, { useEffect, useState } from "react";
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
import { createDailyStatus } from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Row, SwitchInputField } from "../../../components/Component";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import ReactQuill from "react-quill";
import { Button, Input } from "reactstrap";
import { ZoomImage } from "../../../components/form-control/ZoomImage";

const DailyStatusForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting } = useSelector(
    (state) => state.dailyStatusReducer
  );

  const [type, setType] = useState(1);
  const [description, setDescription] = useState();

  const [image, setImage] = useState(null);
  const [videos, SetVideos] = useState(null);
  const [voices, SetVoices] = useState(null);
  const [status, SetStatus] = useState(true);
  const [DateTimeValue, setDateTimeValue] = useState("2025-05-21T14:30");

  const postData = async () => {
    const adddata = {
      type,
      status,
      valid_upto: DateTimeValue,
      image_file: image,
      text: description,
      video_file: videos,
      audio_file: voices,
    };
    try {
      await dispatch(createDailyStatus(adddata)).unwrap();
      toastsuccess("Daily Status Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/daily_status/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      type,
      status,
      valid_upto: DateTimeValue,
      image_file: image,
      text: description,
      video_file: videos,
      audio_file: voices,
    };
    try {
      await dispatch(createDailyStatus(adddata)).unwrap();
      toastsuccess("Daily Status Added successfully");
      setImage(null);
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

  // const handleVideoUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   const readers = files.map((file) => {
  //     return new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.onload = () => resolve(reader.result);
  //       reader.readAsDataURL(file);
  //     });
  //   });

  //   Promise.all(readers).then((results) => {
  //     SetVideos(results);
  //   });
  // };

  // const handleAudioUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   const readers = files.map((file) => {
  //     return new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.onload = () => resolve(reader.result);
  //       reader.readAsDataURL(file);
  //     });
  //   });

  //   Promise.all(readers).then((results) => {
  //     SetVoices(results);
  //   });
  // };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      SetVideos(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      SetVoices(reader.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (add === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/daily_status/list`);
    }
  }, [add, navigate]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        handleSubmit(postData)();
      }, 0);
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  return (
    <React.Fragment>
      <Head title={title ? title : "Daily Status"} />
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
                    navigate(
                      `${process.env.PUBLIC_URL}/master/daily_status/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <div className="custom-grid">
            <Row className="form-group row g-4">
              <Col md="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="type">
                    Type
                  </label>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="type_image"
                          type="radio"
                          name={"type"}
                          value={1}
                          className="custom-control-input"
                          checked={type == 1 ? true : false}
                          onChange={(e) => {
                            setType(1);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="type_image"
                        >
                          Image
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="type_audio"
                          type="radio"
                          value={2}
                          name={"type"}
                          className="custom-control-input "
                          checked={type == 2 ? true : false}
                          onChange={(e) => {
                            setType(2);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="type_audio"
                        >
                          Audio
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="type_video"
                          type="radio"
                          value={3}
                          name={"type"}
                          className="custom-control-input "
                          checked={type == 3 ? true : false}
                          onChange={(e) => {
                            setType(3);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="type_video"
                        >
                          Video
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="type_text"
                          type="radio"
                          value={4}
                          name={"type"}
                          className="custom-control-input "
                          checked={type == 4 ? true : false}
                          onChange={(e) => {
                            setType(4);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="type_text"
                        >
                          Text
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>

            {type == 1 && (
              <Row className="form-group row g-4">
                <Col md="2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="bannerName">
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
              </Row>
            )}

            {type == 2 && (
              <Row className="form-group row g-4">
                <Col md="2">
                  <label className="form-label">Audio</label>
                </Col>
                <Col lg="3">
                  <Input
                    type="file"
                    accept="audio/*"
                    multiple
                    onChange={handleAudioUpload}
                  />
                </Col>
              </Row>
            )}

            {type == 3 && (
              <Row className="form-group row g-4">
                <Col md="2">
                  <label className="form-label">Video</label>
                </Col>
                <Col lg="3">
                  <Input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                  />
                </Col>
              </Row>
            )}

            {type == 4 && (
              <Row className="g-3 align-center mt-2">
                <Col lg="2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="text">
                      Text
                    </label>
                  </div>
                </Col>
                <Col lg="3">
                  <ReactQuill value={description} onChange={handleChange} />
                </Col>
              </Row>
            )}

            <Row md={12} className="form-group row g-4">
              <Col lg="2"></Col>
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

            {type == 2 && voices != null && voices && (
              <Row className="form-group row g-4">
                <Col md="2"></Col>
                <Col lg="5">
                  {/* {voices?.map((audio, idx) => ( */}
                  <div className="mb-2">
                    <audio controls>
                      <source src={voices} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                    <br />
                    <Button
                      color="danger"
                      size="sm"
                      className="ml-2"
                      onClick={() => SetVoices(null)}
                    >
                      Remove
                    </Button>
                  </div>
                  {/* ))} */}
                </Col>
              </Row>
            )}

            {type == 3 && videos != null && videos && (
              <Row className="form-group row g-4">
                <Col md="2"></Col>
                <Col lg="5">
                  {/* {videos?.map((vid, idx) => ( */}
                  <div>
                    <video width="320" height="240" controls>
                      <source src={videos} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <br />

                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => {
                        SetVideos(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  {/* ))} */}
                </Col>
              </Row>
            )}

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="status">
                    Duration
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <Input
                  type="datetime-local"
                  id="datetime"
                  name="datetime"
                  value={DateTimeValue}
                  onChange={(e) => setDateTimeValue(e.target.value)}
                />
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="status">
                    Active
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <SwitchInputField
                  register={register}
                  id={"status"}
                  checked={status}
                  SetValue={SetStatus}
                  name={"status"}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default DailyStatusForm;

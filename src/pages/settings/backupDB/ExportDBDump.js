import React from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  Col,
  PreviewCard,
  Row,
  SaveButton,
} from "../../../components/Component";
import { useDispatch, useSelector } from "react-redux";
import { backupCurrentDB } from "../../../redux/thunks/coreComponent";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";

const ExportDBDump = () => {
  const dispatch = useDispatch();
  const { isLoading: issubmitting } = useSelector(
    (state) => state.coreCompReducer
  );

  const exportDB = async () => {
    try {
      let response = "";
      response = await dispatch(backupCurrentDB()).unwrap();
      //   console.log(response?.data);

      window.open(response?.data?.download_url, "_blank");

      //window.location.reload();
      //   navigate(`${process.env.PUBLIC_URL}/billing/list`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <Head title={"Export DB"} />
      <Content>
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
          </Row>

          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <h3 className="justify-center items-center">
              Export DB with Current Data
            </h3>
          </Row>
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <div className="justify-center items-center">
              <SaveButton
                disabled={issubmitting}
                size="md"
                color="primary"
                onClick={() => {
                  exportDB();
                }}
              >
                {issubmitting ? "Exporting" : "Export DB "}
              </SaveButton>
            </div>
          </Row>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default ExportDBDump;

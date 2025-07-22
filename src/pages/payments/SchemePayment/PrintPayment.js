import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { getPaymentInfo } from "../../../redux/thunks/payment";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useReactToPrint } from "react-to-print";
import queryString from 'query-string';
import { company_name } from "../../../redux/configs";
import moment from "moment";
import "./Style.css";
import { useNavigate } from "react-router-dom";
const PrintPayment = () => {
  const location = useLocation();
  const queryParams = useMemo(() => queryString?.parse(location?.search), [location?.search]);
  const componentRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { paymentInfo } = useSelector((state) => state.paymentMasterReducer);

  useEffect(() => {
    dispatch(getPaymentInfo(queryParams.id));
  }, [dispatch, queryParams]);

  const handlePrint = async () => {
    const element = componentRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    navigate(`${process.env.PUBLIC_URL}/payments/schemepayment/list`);
    
  };

  useEffect(() => {
    if (paymentInfo) {
      handlePrint();
    }
  }, [paymentInfo]);

  return (
    <>
      <div style={{ marginTop: "-20px" }}>
        <div ref={componentRef}>
          <div>
            <div className="text-center mt-3">
              <div>
                <section className="receipt container-ticket">
                  <div className="ticket">
                    <div className="head-ticket">
                      <p className="paras">PAYMENT RECEIPT</p>
                      <div className="hr-sm"></div>
                      <p className="bold">Shining dawn</p>
                      <p className="bold">{paymentInfo?.scheme_name}</p>
                    </div>
                    <div className="body-ticket">
                      <div className="produits">
                        <div className="col2">
                          <p>Acc Name</p>
                          <p className="prix">{paymentInfo?.account_name}</p>
                        </div>
                        <div className="col2">
                          <p>Msno</p>
                          <p className="prix">{paymentInfo?.account_number}</p>
                        </div>
                        <div className="col2">
                          <p>Installment</p>
                          <p className="prix">{paymentInfo?.installment}</p>
                        </div>
                        <div className="col2">
                          <p>Receipt Date</p>
                          <p className="prix">{moment(paymentInfo?.entry_date).format("DD-MM-YYYY")}</p>
                        </div>
                        <div className="col2">
                          <p>Receipt No</p>
                          <p className="prix">{paymentInfo?.receipt_no}</p>
                        </div>
                        <div className="col2">
                          <p>Amount INR</p>
                          <p className="prix">
                            {parseInt(paymentInfo?.payment_amount).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div className="col2">
                          <p>Bouns INR</p>
                          <p className="prix">
                            {parseInt(paymentInfo?.discountAmt).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            0
                          </p>
                        </div>
                        <div className="col2">
                          <p>Rate</p>
                          <p className="prix">
                            {parseInt(paymentInfo?.metal_rate).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                          </p>
                        </div>
                        <div className="col2">
                          <p>Gold Weight </p>
                          <p className="prix">{paymentInfo?.metal_weight}</p>
                        </div>
                        <div className="col2">
                          <p>Total Weight</p>
                          <p className="prix">{paymentInfo?.total_paid_weight}</p>
                        </div>
                        <div className="col2">
                          <p>Mobile No</p>
                          <p className="prix">{paymentInfo?.mobile}</p>
                        </div>
                        <div className="col2">
                          <p>Paid Through</p>
                          {paymentInfo?.payment_mode_detail?.map((e, idx) => (
                            <p className="prix" key={idx}>
                              {e.payment_mode}
                            </p>
                          ))}
                        </div>
                        <div className="col2">
                          <p>Collected</p>
                          <p className="prix">{paymentInfo?.created_by}</p>
                        </div>
                      </div>
                    </div>
                    <div className="footer-ticket">
                      <p className="title-footer">THANK YOU VISIT AGAIN</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintPayment;

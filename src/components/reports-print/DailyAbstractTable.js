import React,{forwardRef} from 'react'
import CurrencyDisplay from "../common/moneyFormat/moneyFormat";


const DailyAbstractTable = forwardRef((props, ref) => {
  const {
    columns, 
    dailyAbstractReportList, 
    calculateTotal,
  } = props;
  let total_sales = calculateTotal("tot_amount", dailyAbstractReportList?.sales_data);
  let total_purchase = calculateTotal("tot_amount", dailyAbstractReportList?.purchase_data)
  let total_sales_return = calculateTotal("tot_amount", dailyAbstractReportList?.sales_return)

  return (
    <div>
      <div className="table-responsive dataTables_wrapper" >
        <table className="table-wrapper react_table" ref={ref}>
          <thead>
          <tr>
            <th>DESCRIPTION</th>
            <th colSpan={3}>ISSUE</th>
            <th colSpan={3}>RECEIPT</th>
            <th colSpan={2}>AMOUNT</th>
          </tr>
            <tr>
              {Array.isArray(columns) && columns.map((column, index) => (
                <th key={index} style={{ textAlign: column?.textAlign }}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dailyAbstractReportList?.sales_data?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td colSpan={columns.length} style={{ textAlign: "left" }}>SALES</td>
                
              </tr>
            )}
            {dailyAbstractReportList?.sales_data?.length > 0 &&
              dailyAbstractReportList?.sales_data?.map((item, rowIndex) => (
                <>
                <tr key={`${rowIndex}-1`}>
                  <td  style={{ textAlign: 'left' }}> {item["product_name"]}</td>
                  <td  style={{ textAlign: 'right' }}> {item["pcs"]}</td>
                  <td  style={{ textAlign: 'right' }}> {parseFloat(item["grosswt"]).toFixed(3)}</td>
                  <td  style={{ textAlign: 'right' }}> {parseFloat(item["netwt"]).toFixed(3)}</td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td style={{ textAlign: 'right' }} > <CurrencyDisplay value={item["tot_amount"]} /></td>
                  <td> </td>
                </tr>
                {/* {item["igst"] > 0 &&  ( 
                <tr key={`${rowIndex}-2`}>
                <td  style={{ textAlign: 'left' }}> {item["product_name"] + " IGST"} </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td style={{ textAlign: 'right' }} > <CurrencyDisplay value={item["igst"]} /></td>
                <td> </td>
                
              </tr>)}
              {item["cgst"] > 0 &&  ( 
                <tr key={`${rowIndex}-3`}>
                <td  style={{ textAlign: 'left' }}> {item["product_name"] + " CGST"} </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td style={{ textAlign: 'right' }} > <CurrencyDisplay value={item["cgst"]} /></td>
                <td> </td>
              </tr>)}
              {item["sgst"] > 0 &&  ( 
                <tr key={`${rowIndex}-4`}>
                <td  style={{ textAlign: 'left' }}> {item["product_name"] + " SGST"} </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td style={{ textAlign: 'right' }} > <CurrencyDisplay value={item["sgst"]} /></td>
                <td> </td>
              </tr>)} */}
              
              </>

              ))}
            {dailyAbstractReportList?.sales_data?.length > 0 && (
              <tr style={{ fontWeight: "bold",color: "rgb(0, 128, 0)" }}>
                <td>Total</td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td style={{ textAlign: 'right' }} > <CurrencyDisplay value={total_sales} /></td>
                <td> </td>
              </tr>
            )}
            {dailyAbstractReportList?.sales_return?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td colSpan={columns.length} style={{ textAlign: 'left' }} >SALES RETURN</td>
              </tr>
            )}
            {dailyAbstractReportList?.sales_return?.length > 0 &&
              dailyAbstractReportList?.sales_return?.map((item, rowIndex) => (
                <tr key={`${rowIndex}-1`}>
                  <td  style={{ textAlign: 'left' }}> {item["product_name"]}</td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  
                 
                  <td  style={{ textAlign: 'right' }}> {item["pcs"]}</td>
                  <td  style={{ textAlign: 'right' }}> {parseFloat(item["grosswt"]).toFixed(3)}</td>
                  <td  style={{ textAlign: 'right' }}> {parseFloat(item["netwt"]).toFixed(3)}</td>
                  <td> </td>
                  <td style={{ textAlign: 'right' }} > <CurrencyDisplay value={item["tot_amount"]} /></td>
                 
                </tr>
              ))}

            {dailyAbstractReportList?.sales_return?.length > 0 && (
              <tr style={{ fontWeight: "bold",color: "rgb(0, 128, 0)" }}>
              <td>Total</td>
              <td> </td>
              <td> </td>
              <td> </td>
              <td> </td>
              <td> </td>
              <td> </td>
              <td> </td>
              <td style={{ textAlign: 'right' }} > <CurrencyDisplay value={total_sales_return} /></td>
             
            </tr>
            )}
            {dailyAbstractReportList?.purchase_data?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td colSpan={columns.length} style={{ textAlign: 'left' }} >PURCHASE</td>
              </tr>
            )}
            {dailyAbstractReportList?.purchase_data?.length > 0 &&
              dailyAbstractReportList?.purchase_data?.map((item, rowIndex) => (
                <tr key={`${rowIndex}-1`}>
                  <td  style={{ textAlign: 'left' }}> {item["product_name"]}</td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  
                 
                  <td  style={{ textAlign: 'right' }}> {item["pcs"]}</td>
                  <td  style={{ textAlign: 'right' }}> {parseFloat(item["grosswt"]).toFixed(3)}</td>
                  <td  style={{ textAlign: 'right' }}> {parseFloat(item["netwt"]).toFixed(3)}</td>
                  <td> </td>
                  <td style={{ textAlign: 'right' }} > <CurrencyDisplay value={item["tot_amount"]} /></td>
                  
                </tr>
              ))}
            {dailyAbstractReportList?.purchase_data?.length > 0 && (
              <tr style={{ fontWeight: "bold",color: "rgb(0, 128, 0)" }}>
              <td>Total</td>
              <td> </td>
              <td> </td>
              <td> </td>
              <td> </td>
              <td> </td>
              <td> </td>
              <td> </td>
              <td style={{ textAlign: 'right' }} > <CurrencyDisplay value={total_purchase} /></td>
             
            </tr>
            )}



            {/* {dailyAbstractReportList?.discount_amt > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td>Discount</td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td style={{ textAlign: 'right' }} > <CurrencyDisplay value={dailyAbstractReportList?.discount_amt} /></td>
               
              </tr>
            )} */}


            {dailyAbstractReportList?.sales_summary?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
               
                <td colSpan={columns.length}></td>
              </tr>
            )}
            {dailyAbstractReportList?.sales_summary?.length > 0 &&
              dailyAbstractReportList?.sales_summary?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  <td style={{ textAlign: "left" }}>{item.lable}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  {item.type == 2 ? (
                    <>
                     <td></td>
                     <td style={{ textAlign: "right" }}>{<CurrencyDisplay value={item.value} />}</td>
                    </>
                        
                      ) : (
                        <>
                          <td style={{ textAlign: "right" }}>{<CurrencyDisplay value={item.value} />}</td>
                          <td></td>
                        </>
                      )}
                  
                </tr>
              ))}

                <tr  style={{ fontWeight: "bold",color: "blue" }}>
                  <td style={{ textAlign: "left" }}>TOTAL</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style={{ textAlign: "right" }}>{<CurrencyDisplay value={dailyAbstractReportList?.receipt} />}</td>
                  <td style={{ textAlign: "right" }}>{<CurrencyDisplay value={dailyAbstractReportList?.payment} />}</td>
                </tr>

            {dailyAbstractReportList?.sales_summary?.length > 0 && (
              <tr style={{ fontWeight: "bold",color: "blue" }}>
                <td style={{ textAlign: "left" }}>GRAND TOTAL</td>
                <td></td>
                <td></td>

                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: "right" }}>
                  {<CurrencyDisplay value={dailyAbstractReportList?.total_sale_inward} />}
                </td>
                <td></td>
              </tr>
            )}
              <tr style={{ fontWeight: "bold" }}>
                <td colSpan={columns.length} style={{ textAlign: 'left' }} >COLLECTION DETAILS</td>
              </tr>

            {dailyAbstractReportList?.payment_summary?.length > 0 &&
              dailyAbstractReportList?.payment_summary?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  <td style={{ textAlign: "left" }}>{item.lable + " ( (R) "} <CurrencyDisplay value={item.receipt_amount} /> {" - "+" (P) "} <CurrencyDisplay value={item.payment_amount} />{" )"  } </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style={{ textAlign: "right" }}>{<CurrencyDisplay value={item.value} />}</td>
                  <td></td>
                </tr>
              ))}

            {dailyAbstractReportList?.payment_summary?.length > 0 && (
              <tr style={{ fontWeight: "bold",color: "blue" }}>
                <td style={{ textAlign: "left" }}>TOTAL</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: "right" }}>
                  <CurrencyDisplay value={dailyAbstractReportList?.total_payment} />
                </td>

                <td></td>
              </tr>
            )}
            {dailyAbstractReportList?.discount > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ textAlign: "left" }}>Discount</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: "right" }}>
                  <CurrencyDisplay value={dailyAbstractReportList?.discount} />
                </td>
                
              </tr>
            )}

          {parseFloat(dailyAbstractReportList?.difference) > 0 && (
              <tr style={{ fontWeight: "bold",color: "red" }}>
                <td style={{ textAlign: "left" }}>Difference</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                
                <td style={{ textAlign: "right" }}>
                  <CurrencyDisplay value={dailyAbstractReportList?.difference} />
                </td>
                <td></td>
              </tr>
            )}


                        {dailyAbstractReportList?.misc_sales?.length > 0 && (
              <tr style={{ fontWeight: "bold"}}>
                <td colSpan={columns.length} style={{ textAlign: "left" }}>MISC BILL</td>
                
              </tr>
            )}
            {dailyAbstractReportList?.misc_sales?.length > 0 &&
              dailyAbstractReportList?.misc_sales?.map((item, rowIndex) => (
                <>
                <tr key={`${rowIndex}-1`}>
                  <td  style={{ textAlign: 'left' }}> {item["product_name"]}</td>
                  <td  style={{ textAlign: 'right' }}> {item["pcs"]}</td>
                  <td  style={{ textAlign: 'right' }}> {parseFloat(item["grosswt"]).toFixed(3)}</td>
                  <td  style={{ textAlign: 'right' }}> {parseFloat(item["netwt"]).toFixed(3)}</td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td style={{ textAlign: 'right' }} > <CurrencyDisplay value={item["item_cost"]} /></td>
                  <td> </td>
                </tr>              
              </>

              ))}
            {dailyAbstractReportList?.misc_sales?.length > 0 && (
              <tr style={{ fontWeight: "bold",color: "rgb(0, 128, 0)" }}>
                <td>Total</td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td style={{ textAlign: 'right' }} > <CurrencyDisplay value={calculateTotal("item_cost", dailyAbstractReportList?.misc_sales)} /></td>
                <td> </td>
              </tr>
            )}


            {dailyAbstractReportList?.canceled_bills?.length > 0 && (
              <>
              <tr style={{ fontWeight: "bold"}}>
                <td colSpan={columns.length} style={{ textAlign: "left" }}>CANCELED BILLS</td>
                
              </tr>
                <tr >
                  <td  style={{ textAlign: 'left', fontWeight: 'bold' }}> Inv.No</td>
                  <td  style={{ textAlign: 'left', fontWeight: 'bold' }}>Cus.Name</td>
                  <td  style={{ textAlign: 'left', fontWeight: 'bold' }}> Cus.Mobile</td>
                  <td  style={{ textAlign: 'left', fontWeight: 'bold' }}>Net Amount</td>
                  <td style={{ textAlign: 'left', fontWeight: 'bold' }}> Canceled By</td>
                  <td colSpan={4} style={{ textAlign: 'left', fontWeight: 'bold' }}> Reasons</td>
                </tr>
              </>   
            )}
            {dailyAbstractReportList?.canceled_bills?.length > 0 &&
              dailyAbstractReportList?.canceled_bills?.map((item, rowIndex) => (
                <>
                <tr key={`${rowIndex}-1`}>
                  <td  style={{ textAlign: 'left' }}> {item["inv_no"]?.invoice_no}</td>
                  <td  style={{ textAlign: 'left' }}> {item["customer_name"]}</td>
                  <td  style={{ textAlign: 'left' }}> {(item["customer_mobile"])}</td>
                  <td  style={{ textAlign: 'left' }}><CurrencyDisplay value={item["net_amount"]} /></td>
                  <td  style={{ textAlign: 'left' }}>{item["canceled_by_emp"]}</td>
                  <td  colSpan={4}  style={{ textAlign: 'left' }}>{item["canceled_reason"]}</td>
                  <td> </td>
                </tr>              
              </>

              ))}
          </tbody>

          <tfoot></tfoot>
        </table>
      </div>
    </div>
  );
});

export default DailyAbstractTable
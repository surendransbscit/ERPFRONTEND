import React from "react";
import Barcode from "react-barcode";

const TagPrintTemplateTwo = ({ itemDetails, settings, user }) => {
  return (
    <>
      <div>
        <title>Tag</title>
        <style>
          {`
            @page {
              size: 100mm 15mm;
              margin: 0; /* Remove margin to use full space */
            }
            body {
              margin: 0;
            }
            .printable {
              font-family: "Arial", sans-serif;
              font-size: 8px; /* Smaller font size for compactness */
              overflow: hidden;
            }
            .container {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr; /* Two equal columns */
              column-gap: 5px;
              padding: 2px;
              overflow: hidden;
              align-items: center;
            }
            

            .first {
             
              text-align:center;
            }
            .details {
              text-align:center;
            }
            .details {
              display: flex;
              flex-direction: column;
              gap: 1px; /* Small spacing between lines */
            }
            .details span {
              line-height: 1; /* Compact line height */
              white-space: nowrap;
            }
            @media print {
              .pagebreak {
                page-break-after: always;
              }
            }
          `}
        </style>
      </div>

      <div className="printable" style={{fontWeight:"bold !important",color:"black"}}>
        {itemDetails.map((item, index) => (
          <div className="container" key={index}>
            {/* Left Column */}
            <div className="first">
              <div>{item.product_code}</div>
              <div>{item.supplier_short_code}</div>
              <div>{item.weight_range}</div>
              <div className="barcode">
              <Barcode
                  value={item.tag_code}
                  width={0.6} /* Adjust barcode width */
                  height={10} /* Adjust barcode height */
                  margin={0} /* Remove extra margins */
                  displayValue={false} /* Show text below the barcode */
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="details">
              <span>{item.tag_code}</span>
              {parseFloat(item.tag_gwt) > 0 && (<span>Wt: {item.tag_gwt}</span>) }
              {parseFloat(item.tag_wastage_percentage) > 0 && (<span>Ws: {item.tag_wastage_percentage}%</span>) }
              {parseFloat(item.tag_mc_value) > 0 && (<span>Mc: {item.tag_mc_value}</span>) }
              {(parseFloat(item.tag_sell_rate) > 0 &&  item.fixed_rate_type == 1 ) &&  (<span>Rs: {item.tag_sell_rate}</span>) }
              {(parseFloat(item.tag_sell_rate) > 0 &&   item.fixed_rate_type == 2 ) && (<span>Rs: {item.tag_item_cost}</span>) }

              
              <div className="barcode">
              <Barcode
                  value={item.tag_code}
                  width={0.6} /* Adjust barcode width */
                  height={10} /* Adjust barcode height */
                  margin={0} /* Remove extra margins */
                  displayValue={false} /* Show text below the barcode */
                />
              </div>
            </div>
            <div></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TagPrintTemplateTwo;

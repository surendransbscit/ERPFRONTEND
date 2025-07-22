import React from "react";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import { Badge, Button } from "reactstrap";
import { isUndefined } from "../../components/common/calculations/ErpCalculations";
import { Icon, UserAvatar } from "../../components/Component";

const CombinedMasterTable = ({ columns, data, onDelete, onEdit }) => {
  return (
    <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <table className="table table-bordered" style={{ marginBottom: 0 }}>
      <thead >
          <tr >
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 2 }}>S.NO</th>
            {columns.map((column, index) => (
              <th key={index} style={{ textAlign: column?.textAlign, position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 2 }}>
                {column.header}
              </th>
            ))}
            <th style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 2 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 &&
            data?.map((item, rowIndex) => (
              <tr key={rowIndex}>
                <td>{rowIndex + 1} </td>
                {columns?.map((column, colIndex) => (
                  <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                    {column.isCurrency ? (
                      <CurrencyDisplay value={isUndefined(item[column.accessor])} />
                    ) : column.decimal_places ? (
                      parseFloat(isUndefined(item[column.accessor])).toFixed(column.decimal_places)
                    ) : column.isImage ? (
                      item.image != null ? (
                        <img
                          // onClick={() => handleImagePreview(cell.row.original?.preview_images)}
                          style={{
                            height: "44px",
                            width: "44px",
                            borderRadius: "50%",
                            // cursor: "pointer",
                          }}
                          src={item.image}
                          alt="preview"
                        />
                      ) : (
                        <UserAvatar text={item.image_text} />
                      )
                    ) : column.isBadge ? (
                      <Badge
                        // style={{ cursor: "pointer" }}
                        className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                        color={item[column.accessor] === true ? "success" : "warning"}
                      >
                        {column.badgeText == 1
                          ? item[column.accessor] === true
                            ? "Active"
                            : "Inactive"
                          : column.badgeText == 2
                          ? item[column.accessor] === true
                            ? "Yes"
                            : "No"
                          : item[column.accessor]}
                      </Badge>
                    ) : (
                      item[column.accessor]
                    )}
                  </td>
                ))}
                <td>
                  {onEdit && (
                    <Button
                      color="primary"
                      size="sm"
                      className="btn-icon btn-white btn-dim"
                      onClick={() => {
                        onEdit(rowIndex);
                      }}
                    >
                      <Icon name="edit" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      color="primary"
                      size="sm"
                      className="btn-icon btn-white btn-dim"
                      onClick={() => {
                        onDelete(rowIndex);
                      }}
                    >
                      <Icon name="trash-fill" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
        {/* {isTotalReq && (
          <tfoot>
            <tr style={{ fontWeight: "bold" }}>
              <td>Total</td>
              {columns.map((column, index) => (
                <td key={index} style={{ textAlign: column?.textAlign }}>
                  {column.isTotalReq ? (
                    column.isCurrency ? (
                      <CurrencyDisplay value={calculateTotal(column.accessor)} />
                    ) : (
                      calculateTotal(column.accessor)
                    )
                  ) : (
                    ""
                  )}
                </td>
              ))}
              <td></td> 
            </tr>
          </tfoot>
        )} */}
      </table>
    </div>
  );
};

export default CombinedMasterTable;

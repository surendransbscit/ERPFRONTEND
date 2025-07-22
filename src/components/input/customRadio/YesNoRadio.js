import React from 'react'
import { Col, Row } from '../../Component'
import IsRequired from "../../../components/erp-required/erp-required";

const YesNoRadio = ({ label, id, value, onChange }) => {
  return (
     <Row md={12} className="form-group row g-4">
      <Col md="2">
        <div className="form-group">
          <label className="form-label" htmlFor={id}>
            {label}<IsRequired />
          </label>
        </div>
      </Col>
      <Col md="3">
        <div className="form-group">
          <ul className="custom-control-group g-3 align-center flex-wrap">
            <li>
              <div className="custom-control custom-control-sm custom-radio">
                <input
                  id={`${id}_yes`}
                  type="radio"
                  name={id}
                  value={1}
                  className="custom-control-input"
                  checked={value === 1}
                  onChange={() => onChange(1)}
                />
                <label className="custom-control-label" htmlFor={`${id}_yes`}>
                  Yes
                </label>
              </div>
            </li>
            <li>
              <div className="custom-control custom-control-sm custom-radio">
                <input
                  id={`${id}_no`}
                  type="radio"
                  name={id}
                  value={0}
                  className="custom-control-input"
                  checked={value === 0}
                  onChange={() => onChange(0)}
                />
                <label className="custom-control-label" htmlFor={`${id}_no`}>
                  No
                </label>
              </div>
            </li>
          </ul>
        </div>
      </Col>
    </Row>
  )
}

export default YesNoRadio
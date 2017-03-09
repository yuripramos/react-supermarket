import React from 'react';
import * as search from 'searchtabular';
import PerPage from './PerPage';

const PrimaryControls = ({
  perPage, columns, rows, column, query,
  onPerPage, onSearch, onColumnChange,
  ...props
}) => (
  <div {...props}>
    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
        <div className="input-group main-search">
          <search.Field
            column={column}
            query={query}
            columns={columns}
            rows={rows}
            onChange={onSearch}
            onColumnChange={onColumnChange}
            className="form-control"
            components={{
              props: {
                filter: {
                  placeholder: 'Pesquisar'
                },
              }
            }}


          />
          <span className="input-group-btn">
            <button className="btn btn-default btn-search" type="button"><i className="fa fa-search" aria-hidden="true"></i></button>
          </span>
          
        </div>
      </div>
  </div>
);
PrimaryControls.propTypes = {

  perPage: React.PropTypes.number,
  columns: React.PropTypes.array,
  rows: React.PropTypes.array,
  column: React.PropTypes.string,
  query: React.PropTypes.object,
  onPerPage: React.PropTypes.func,
  onSearch: React.PropTypes.func,
  onColumnChange: React.PropTypes.func
};

export default PrimaryControls;
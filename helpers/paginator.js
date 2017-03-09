import React from 'react';
import Pagify from 'react-pagify';
import segmentize from 'segmentize';

const Paginator = ({ pagination, pages, onSelect }) => (
  <div className="pagination">
    <Pagify.Context
              tags={{

    segment: {
      tag: 'li'
    },
    ellipsis: {
      tag: 'li'
    },
    link: {
      tag: 'a',
      props: {
        href: '#'
      }
    }
  }}
      segments={segmentize({
        page: pagination.page,
        pages,
        beginPages: 3,
        endPages: 3,
        sidePages: 2
      })} onSelect={onSelect}>


      <Pagify.Button page={pagination.page - 1}><i className="fa fa-angle-double-left" aria-hidden="true"></i></Pagify.Button>

      <Pagify.Segment field="beginPages" />

      <Pagify.Ellipsis
        className="ellipsis"
        previousField="beginPages"
        nextField="previousPages"
      />

      <Pagify.Segment field="previousPages" />
      <Pagify.Segment field="centerPage" id="selected" />
      <Pagify.Segment field="nextPages" />

      <Pagify.Ellipsis
        className="ellipsis"
        previousField="nextPages"
        nextField="endPages"
      />

      <Pagify.Segment field="endPages" />

      <Pagify.Button page={pagination.page + 1}><i className="fa fa-angle-double-right" aria-hidden="true"></i></Pagify.Button>
    </Pagify.Context>
  </div>
);
Paginator.propTypes = {
  pagination: React.PropTypes.object,
  pages: React.PropTypes.number,
  onSelect: React.PropTypes.func
};

export default Paginator;
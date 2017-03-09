import React from 'react';
import ReactDOM from 'react-dom';
import { compose } from 'redux';
import Header from "./layout/header";
import {
  cloneDeep, findIndex, orderBy, keys, values, transforms
} from 'lodash';
import * as Table from 'reactabular-table';
import * as search from 'searchtabular';
import * as sort from 'sortabular';
import * as resizable from 'reactabular-resizable';
import * as resolve from 'table-resolver';
import * as edit from 'react-edit';
import uuid from 'uuid';


import {
  Paginator, PrimaryControls, generateRows, paginate 
} from '../helpers';



const app = document.getElementById('app')

const predefinedRows = [
   { "estoque" : 40000,
  "imagem" : null,
  "marca" : "Tio João",
  "quantidade" : 4,
  "produto" : "Arroz parbolizado",
  "valor" : 20000
  }
];
// var oldStorage = JSON.parse(localStorage.getItem('oldRows')) || [];
// console.log(predefinedRows.length);
// console.log(oldStorage[0].quantidade);
// if(oldStorage.length==3 && oldStorage[0].quantidade == "Gol" && oldStorage[1].quantidade == "Fox" && oldStorage[2].quantidade =="Fusca"){
//  var rows = predefinedRows;
// }else{

// }

const schema = {
  type: 'object',
  properties: {
    estoque: {
      type: 'integer'
    },
    imagem: {
      type: 'string'
    },
    marca: {
      type: 'string'
    },
    quantidade: {
      type: 'integer'
    },
    produto: {
      type: 'string'
    },
    valor: {
      type: 'integer'
    }
  },
  required: ['estoque', 'marca']
};


class AllFeaturesTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: predefinedRows,
      schema:schema,
      searchColumn: 'all',
      query: {}, // search query
      sortingColumns: null, 
      columns: this.getColumns(), 
      pagination: { 
        page: 1,
        perPage: 5
      }
    };

    this.onRow = this.onRow.bind(this);
    this.onRowSelected = this.onRowSelected.bind(this);
    this.onColumnChange = this.onColumnChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onPerPage = this.onPerPage.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onToggleColumn = this.onToggleColumn.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }
  getColumns() {
    const editable = edit.edit({
      isEditing: ({ columnIndex, rowData }) => columnIndex === rowData.editing,
      onActivate: ({ columnIndex, rowData }) => {
        const index = findIndex(this.state.rows, { id: rowData.id });
        const rows = cloneDeep(this.state.rows);

        rows[index].editing = columnIndex;

        this.setState({ rows });
      },
      onValue: ({ value, rowData, property }) => {
        const index = findIndex(this.state.rows, { id: rowData.id });
        const rows = cloneDeep(this.state.rows);

        rows[index][property] = value;
        rows[index].editing = false;

        this.setState({ rows });
      }
    });
    const sortable = sort.sort({
      getSortingColumns: () => this.state.sortingColumns || [],
      onSort: selectedColumn => {
        this.setState({
          sortingColumns: sort.byColumns({ // sort.byColumn would work too
            sortingColumns: this.state.sortingColumns,
            selectedColumn
          })
        });
      }
    });
    const sortableHeader = sortHeader(sortable, () => this.state.sortingColumns);
    const resize = resizable.column({
      getWidth: column => column.header.props.style.width,
      onDrag: (width, { columnIndex }) => {
        const columns = this.state.columns;
        const column = columns[columnIndex];

        column.header.props.style = {
          ...column.header.props.style,
          width
        };

        this.setState({ columns });
      }
    });
    //cleaning our app localStorage after 30000000 ms ~= 8h
    // setTimeout(function(){ localStorage.clear(); console.log("localStorage Limpado =)") }, 30000000);


    return [
        {
        cell: {
          formatters: [
            (value, { rowData }) => (
            <div className="checkbox abc-checkbox">
				<input type="checkbox" value=""  id={rowData.id }onClick={() => this.onRemove(rowData.id)} ></input>
    			<label htmlFor={rowData.id }></label>
  			</div>
            )
          ]
        },
        visible: true
      },
      {
        property: 'produto',
        header: {
          label: 'Produto',
          formatters: [
        sortableHeader
          ]
        },
        cell: {
          transforms: [
            editable(edit.input())
          ],
          formatters: [
            search.highlightCell
          ]
        },
        footer: () => 'Aqui você pode mostrar a soma dos valores de uma coluna - opcional',
        visible: true
      },
      {
        property: 'quantidade',
        header: {
          label: 'Quantidade',
          formatters: [
            (v, extra) => resize(sortableHeader(v, extra), extra)
          ]
        },
        cell: {
          transforms: [
            editable(edit.input())
          ],
          formatters: [
            search.highlightCell
          ]
        },
        visible: true
      },
      {
        property: 'marca',
        header: {
          label: 'Marca',
          formatters: [
            sortableHeader
          ]
        },
        cell: {
          transforms: [
            editable(edit.input())
          ]
        },
        visible: true
      },
      {
        property: 'imagem',
        header: {
          label: 'Foto',
          formatters: [
            sortableHeader
            
          ]
        },
        cell: {
      transforms: [editable(edit.input())]

        },
        visible: true
      },
      {
        property: 'estoque',
        header: {
          label: 'Estoque',
          formatters: [
            sortableHeader
          ]
        },
        cell: {
      transforms: [editable(edit.input())]
        },
        visible: true
      },
      {
        property: 'valor',
        header: {
          label: 'Valor(em R$)',
          formatters: [
            sortableHeader
          ]
        },
        cell: {
          transforms: [editable(edit.input({ props: { type: 'number' } }))]
        },
        visible: true
      }
    ];
  }
  render() {
    const {
      columns, rows, pagination, sortingColumns, searchColumn, query
    } = this.state;
    const cols = columns.filter(column => column.visible);
    const paginated = compose(
      paginate(pagination),
      sort.sorter({ columns: cols, sortingColumns, sort: orderBy }),
      search.highlighter({ columns: cols, matches: search.matches, query }),
      search.multipleColumns({ columns: cols, query }),
      resolve.resolve({
        columns: cols,
        method: (extra) => compose(
          resolve.byFunction('cell.resolve')(extra),
          resolve.nested(extra)
        )
      })
    )(rows);

    return (
      <div className="container">
        <Header/>
        <div className="wrapper">
          <div className="row control-bar">
            <div className="col-lg-9 col-md-9 col-sm-9 col-xs-6">
              <button type="button" onClick={this.onAdd} className="btn-success"><i className="fa fa-cart-plus" aria-hidden="true"></i><span>Novo Produto</span></button>
            </div>

              <PrimaryControls
                perPage={pagination.perPage}
                column={searchColumn}
                query={query}
                columns={cols}
                rows={rows}
                onPerPage={this.onPerPage}
                onColumnChange={this.onColumnChange}
                onSearch={this.onSearch}
              />
        </div>
          <Table.Provider
            className="table table-hover"
            columns={cols}
            style={{ overflowX: 'auto' }}
          >
            <Table.Header />

            <Table.Body onRow={this.onRow} rows={paginated.rows} rowKey="id"/>

          </Table.Provider>

          <div className="controls text-center">
            <Paginator
              pagination={pagination}
              pages={paginated.amount}
              onSelect={this.onSelect}
            />
          </div>
        </div>
      </div>
    );
  }
  onRow(row, { rowIndex }) {
    return {
      onClick: () => this.onRowSelected(row)
    };
  }
  onRowSelected(row) {
    console.log('clicked row', row);

  }
  onColumnChange(searchColumn) {
    this.setState({
      searchColumn
    });
  }
  onSearch(query) {
    this.setState({
      query
    });
  }
  onSelect(page) {
    const pages = Math.ceil(
      this.state.rows.length / this.state.pagination.perPage
    );

    this.setState({
      pagination: {
        ...this.state.pagination,
        page: Math.min(Math.max(page, 1), pages)
      }
    });
  }
  onPerPage(value) {
    this.setState({
      pagination: {
        ...this.state.pagination,
        perPage: parseInt(value, 10)
      }
    });
  }
  onRemove(id) {
  	if (confirm('Você tem certeza que deseja deletar essa tupla?')) {
		const rows = cloneDeep(this.state.rows);
	    const idx = findIndex(rows, { id });

	    rows.splice(idx, 1);

	    this.setState({ rows });
    } else {
    // Do nothing!
	}

    // localStorage.setItem('oldRows', JSON.stringify(rows));

  }
  onAdd(e) {
    e.preventDefault();

    const rows = cloneDeep(this.state.rows);

    rows.unshift({
      id: uuid.v4(),
      placa: 'Qual a placa do veiculo?',
      quantidade:'Digite a quantidade desejada para compra',
      marca:'Fabricante',
      foto:'Se houver, insira a url da foto',
      estoque:'Quantidade em estoque?',
      valor:'preco'
    });

    this.setState({ rows });
    // localStorage.setItem('oldRows', JSON.stringify(rows));
  }
  onToggleColumn({ columnIndex }) {
    const columns = cloneDeep(this.state.columns);
    const column = columns[columnIndex];

    column.visible = !column.visible;

    const query = cloneDeep(this.state.query);
    delete query[column.property];

    this.setState({ columns, query });
  }
}

function sortHeader(sortable, getSortingColumns) {
  return (value, { columnIndex }) => {
    const sortingColumns = getSortingColumns() || [];

    return (
      <div style={{ display: 'inline' }}>
        <span className="value">{value}</span>
        {React.createElement(
          'span',
          sortable(
            value,
            {
              columnIndex
            },
            {
              style: { float: 'right' }
            }
          )
        )}
        {sortingColumns[columnIndex] &&
          <span className="sort-order" style={{ marginLeft: '0.5em', float: 'right' }}>
            {sortingColumns[columnIndex].position + 1}
          </span>
        }
      </div>
    );
  };
}



ReactDOM.render( <AllFeaturesTable />, app);
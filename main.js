
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


var React = require ('react');
var ReactDOM = require('react-dom');

var Peice = React.createClass({
  onClickHandler: function() {
    this.props.onClick(this.props.id);
  },
  render: function() {
    var style = {
      backgroundImage: 'url(' + this.props.img + ')', 
      backgroundRepeat: 'no',
      width: this.props.width + 'px', 
      height: this.props.height + 'px', 
      backgroundPosition: '-' + (this.props.finalX * this.props.width) + 'px -' + (this.props.finalY * this.props.height) + 'px'
    };

    if ( this.props.dummy ) {
      style = {
        width: this.props.width + 'px',
        height: this.props.height + 'px'
      };
    }
    
    return (
      <div style={style} onClick={this.onClickHandler} />
    );
  }
});

var Puzzle = React.createClass({
  getInitialState: function() {
    return {cells: [], emptyCell: null, finished: false}
  },
  componentDidMount: function() {

    // generate cell positions
    var finalPositions = [];
    var startPositions = [];
    for ( y = 0; y < 3; y++ ) {
      for ( x = 0; x < 3; x++) {
        finalPositions.push({ x: x, y: y});
        startPositions.push({ x: x, y: y});
      }
    }

    // shuffle the start positions
    startPositions = shuffle(startPositions);

    // generate cell objects
    var cells = [];
    for ( i = 0; i < finalPositions.length; i++) {
      cells.push({
        id: 'cell_' + i,
        finalPosition: finalPositions[i],
        currentPosition: startPositions[i],
        dummy: false
      })
    }

    // dummy cell.
    cells[8].dummy = true;

    this.setState({ cells: cells, emptyCell: cells[8] });

  },
  checkFinished: function() {
    for ( i = 0; i < this.state.cells.length; i++ ) {
      var item = this.state.cells[i];
      if ( item.finalPosition.x != item.currentPosition.x || item.finalPosition.y != item.currentPosition.y ) {
        return false;
      }
    }
    return true;
  },
  adjacentCells: function(peice1, peice2) {

    var xdiff = peice1.currentPosition.x - peice2.currentPosition.x;
    var ydiff = peice1.currentPosition.y - peice2.currentPosition.y;

    return ( xdiff == 0 && ydiff >= -1 && ydiff <= 1 ) || ( ydiff == 0 && xdiff >= -1 && xdiff <= 1 );
  },
  swapPeices: function(peice_id) {

    var cell = this.findCellById(peice_id);
    if ( ! cell ) {
      return
    }

    var emptyCell = this.state.emptyCell;
    if ( ! emptyCell ) {
      debugger;
    }

    // if the empty space is near it, then swap them.
    if ( this.adjacentCells(cell, emptyCell) ) {

      // swap grid positions
      var p = cell.currentPosition;
      cell.currentPosition = emptyCell.currentPosition;
      emptyCell.currentPosition = p;

      this.setState({ emptyCell: emptyCell });
    }

    if ( this.checkFinished() ) {
      this.setState({ finished: true });
    }
  },
  findCellById: function(cell_id) {
    for ( i = 0; i < this.state.cells.length; i++ ) {
      var item = this.state.cells[i];
      if ( item.id == cell_id ) {
        return item;
      }
    }
    return null;
 },
  findCell: function(x, y) {
    for ( i = 0; i < this.state.cells.length; i++ ) {
      var item = this.state.cells[i];
      if ( item.currentPosition.x == x && item.currentPosition.y == y ) {
        return item;
      }
    }
    return null;
  },
  render: function() {

    var peiceWidth = this.props.width / 3;
    var peiceHeight = this.props.height / 3;

    var grid = [0,1,2].map( function(y) {
      return (
        <tr>
          {
            [0,1,2].map( function(x) {
              var cell = this.findCell(x,y);
              if ( cell ) {
              return (
                <td><Peice id={cell.id} img={this.props.img} width={peiceWidth} height={peiceHeight} finalX={cell.finalPosition.x} finalY={cell.finalPosition.y} x={cell.currentPosition.x} y={cell.currentPosition.y} onClick={this.swapPeices} dummy={cell.dummy} /></td>
              );
              }
            }, this)
          }
        </tr>
      );
    }, this);

    var status;
    if ( this.state.finished ) {
      var style = {
        position: 'absolute',
        left: 50 + '%',
        top: 50 + '%'
      };
      status = (
          <div style={style}>Completed</div>
      );
    }

    var table = (
      <div>
        <table>
          <tbody>
            {grid}
          </tbody>
        </table>
        {status ? status : ''}
      </div>
    );

    return table;
  }
});

ReactDOM.render(
    <Puzzle img="WDF_700489.png" width="273" height="297" />,
    document.getElementById('example')
);

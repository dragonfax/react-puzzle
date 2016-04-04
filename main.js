
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
var ReactMotion = require('react-motion');

var Finished = React.createClass({
  render: function() {
    return <div className="finsihed" >Finished</div>
  }
});

var Peice = React.createClass({
  componentWillMount: function() {
    // Avoid initial animation.
    this.setState({ previous: { x: this.props.x, y: this.props.y } });
  },
  onClickHandler: function() {
    this.setState({ previous: { x: this.props.x, y: this.props.y} });
    this.props.onClick(this.props.id);
  },
  interpolateStyle: function(iStyle) {
    var onClickHandler = this.onClickHandler;
    var style = {
      backgroundPosition: '-' + (this.props.finalX * this.props.width) + 'px -' + (this.props.finalY * this.props.height) + 'px',
      left: iStyle.leftX + 'px',
      top: iStyle.topY + 'px'
    };
    return <div style={style} className="peice" onClick={onClickHandler} />;
  },
  render: function() {
    if ( this.props.dummy ) {
      throw "Rendering dummy peice."
    }

    var motionStyle = {
      leftX: ReactMotion.spring( this.props.width * this.props.x ), 
      topY: ReactMotion.spring( this.props.height * this.props.y )
    };

    var defaultStyle = {
      leftX: ( this.props.width * this.state.previous.x ), 
      topY: ( this.props.height * this.state.previous.y) 
    };
 
    return (
      <ReactMotion.Motion defaultStyle={defaultStyle} style={motionStyle}>
        {this.interpolateStyle}
      </ReactMotion.Motion>
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

    var emptyCell = cells.pop();
    emptyCell.dummy = true;

    this.setState({ cells: cells, emptyCell: emptyCell });

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
    var emptyCell = this.state.emptyCell;

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
  render: function() {

    var peiceWidth = this.props.width / 3;
    var peiceHeight = this.props.height / 3;

    var grid = this.state.cells.map( function(cell) {
        return <Peice id={cell.id} width={peiceWidth} height={peiceHeight} finalX={cell.finalPosition.x} finalY={cell.finalPosition.y} x={cell.currentPosition.x} y={cell.currentPosition.y} onClick={this.swapPeices}/>;
    }, this);

    var status = <Finished/>;

    var table = <div className="puzzle"> {grid} {this.state.finished ? status : ''} </div>;

    return table;
  }
});

ReactDOM.render(
    <Puzzle width="273" height="297" />,
    document.getElementById('example')
);

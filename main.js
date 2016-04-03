
var React = require ('react');
var ReactDOM = require('react-dom');

var Peice = React.createClass({
  render: function() {
    var style = {
      backgroundImage: 'url(' + this.props.img + ')', 
      backgroundRepeat: 'no',
      width: this.props.width + 'px', 
      height: this.props.height + 'px', 
      backgroundPosition: '-' + (this.props.x * this.props.width) + 'px -' + (this.props.y * this.props.height) + 'px'
    };
    return (
      <div style={style} />
      );
  }
});

var Puzzle = React.createClass({
  render: function() {

    var peiceWidth = this.props.width / 3;
    var peiceHeight = this.props.height / 3;

    var cells = [];
    for ( y = 0; y < 3; y++ ) {
      for ( x = 0; x < 3; x++) {
        cells.push(
          <td><Peice img={this.props.img} width={peiceWidth} height={peiceHeight} x={x} y={y}/></td>
        );
      }
    }

    return (
      <table>
      <tbody>
        <tr>
          {cells[0]}
          {cells[1]}
          {cells[2]}
        </tr>
        <tr>
          {cells[3]}
          {cells[4]}
          {cells[5]}
        </tr>
        <tr>
          {cells[6]}
          {cells[7]}
          {cells[8]}
        </tr>
        </tbody>
      </table>
    );
  }
});

ReactDOM.render(
    <Puzzle img="WDF_700489.png" width="273" height="297" />,
    document.getElementById('example')
);

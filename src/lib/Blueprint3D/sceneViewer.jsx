import React from 'react';

export default class SceneViewer extends React.Component {
  render() {
    const { hidden } = this.props;

    if (hidden) {
      return (
        // <div className="3d-container-mini" style={{ display: 'inherit', width: '250px', height: '200px', position: 'fixed', bottom: '10px', left: '70px', zIndex: '1000' }} >
        <div className="3d-container-mini" style={{ display: 'inherit', width: '250px', height: '200px', position: 'absolute', bottom: '112px', left: '15px', zIndex: '1000' }} >
          <div style={{ width: '250px', height: '200px' }} ref={ref => typeof this.props.onDomLoaded === 'function' && this.props.onDomLoaded(ref)}></div>
        </div>
      )
    } else {
      return (
        <div className="3d-container" style={{ display: 'inherit', width: '100%', height: '100%' }} >
          <div id="canvas3D" style={{ width: '100%', height: '100%' }} ref={ref => typeof this.props.onDomLoaded === 'function' && this.props.onDomLoaded(ref)}></div>
        </div>
      )
    }
  }
}
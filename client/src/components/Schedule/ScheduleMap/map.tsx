import React, { Fragment, PureComponent } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import Geocoder from 'react-mapbox-gl-geocoder';
import { Container, Col, Row, Button } from 'reactstrap';
import mapStyles from './map.module.scss';

interface IMapbox {
  className?: string;
  viewport: {
    latitude: any;
    longitude: any;
    zoom: number;
  };
  tempMarker: any;
  markers: Array<string>;
  showPopup: boolean;
}

const mapStyle = {
  width: '100%',
  height: 600,
};

const mapboxApiKey = 'pk.eyJ1Ijoic3lrcHluIiwiYSI6ImNrYXYwY3dmZjBnaXkyeW85cHVtdGpscDcifQ.B3dSl78hadCTrpKcPc06kQ';

class MapView extends PureComponent<{}, IMapbox> {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 53.9,
        longitude: 27.56667,
        zoom: 10,
      },
      tempMarker: null,
      markers: [],
      showPopup: true,
    };
  }

  clickHandlerForPopup() {
    this.state.showPopup ? this.setState({ showPopup: false }) : this.setState({ showPopup: true });
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState(
        (state) =>
          ({
            ...state,
            viewport: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              zoom: 10,
            },
          } as IMapbox),
      );
    });
  }

  customMarker = ({ marker }) => {
    let { showPopup } = this.state;
    return (
      <Fragment>
        <Marker longitude={marker.longitude} latitude={marker.latitude}>
          <div>
            <span>
              <img
                src="https://image.flaticon.com/icons/png/512/8/8168.png"
                className={[mapStyles.mapIcon].filter(Boolean).join(' ')}
              ></img>
            </span>
          </div>
        </Marker>
        {showPopup ? (
          <Popup
            latitude={marker.latitude}
            longitude={marker.longitude}
            dynamicPosition={false}
            closeButton={false}
            tipSize={5}
            anchor="top"
          >
            <div>{marker.name}</div>
          </Popup>
        ) : null}
      </Fragment>
    );
  };

  onSelected = (viewport, item) => {
    this.setState({
      viewport,
      tempMarker: {
        name: item.place_name,
        longitude: item.center[0],
        latitude: item.center[1],
      },
    });
  };

  add = () => {
    let { tempMarker } = this.state;

    this.setState((prevState) => ({
      markers: [...prevState.markers, tempMarker],
      tempMarker: null,
    }));
  };

  render() {
    const { viewport, tempMarker, markers } = this.state;
    return (
      <Container fluid={true}>
        <Row>
          <Col>
            <h2>Event Map</h2>
          </Col>
        </Row>
        <Row className="py-4">
          <Col xs={2}>
            <Geocoder
              mapboxApiAccessToken={mapboxApiKey}
              onSelected={this.onSelected}
              viewport={viewport}
              hideOnSelect={true}
              value=""
            />
          </Col>
          <Col>
            <Button color="primary" onClick={this.add}>
              Add New Mark
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <ReactMapGL
              mapboxApiAccessToken={mapboxApiKey}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              {...viewport}
              {...mapStyle}
              onViewportChange={(viewport) => this.setState({ viewport })}
            >
              {tempMarker && (
                <Marker longitude={tempMarker.longitude} latitude={tempMarker.latitude}>
                  <div className="marker temporary-marker"></div>
                </Marker>
              )}
              {this.state.markers.map((marker) => {
                console.log(marker);
                return (
                  // <Fragment>
                  //   <CustomMarker key={`marker-${index}`} index={index} marker={marker} />
                  // </Fragment>
                  <Fragment>{this.customMarker({ marker })}</Fragment>
                );
              })}
            </ReactMapGL>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default MapView;

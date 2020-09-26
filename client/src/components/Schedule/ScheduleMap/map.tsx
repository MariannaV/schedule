import React from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import Geocoder from 'react-mapbox-gl-geocoder';
import { Button } from 'antd';
import mapStyles from './map.module.scss';

export interface IPlace {
  name: string;
  longitude: number;
  latitude: number;
}

interface IMapView {
  onChange?: (value: Array<IPlace>) => void;
  isReadOnly?: boolean;
  markers?: Array<IPlace>;
}

interface IMapbox {
  className?: string;
  viewport: {
    latitude: any;
    longitude: any;
    zoom: number;
  };
  tempMarker: any;
  markers: Array<IPlace>;
  showPopup: boolean;
}

const mapStyle = {
  width: '100%',
  height: 600,
};

const mapboxApiKey = 'pk.eyJ1Ijoic3lrcHluIiwiYSI6ImNrYXYwY3dmZjBnaXkyeW85cHVtdGpscDcifQ.B3dSl78hadCTrpKcPc06kQ';

class MapView extends React.PureComponent<IMapView, IMapbox> {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...(props.markers?.length
          ? {
              latitude: props.markers[0].latitude,
              longitude: props.markers[0].longitude,
            }
          : {
              latitude: 53.9,
              longitude: 27.56667,
            }),
        zoom: 10,
      },
      tempMarker: null,
      markers: props.markers ?? Array.prototype,
      showPopup: true,
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) =>
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
      ),
    );
  }

  customMarker = ({ marker }) => (
    <>
      <Marker longitude={marker.longitude} latitude={marker.latitude}>
        <img src="https://image.flaticon.com/icons/png/512/8/8168.png" className={mapStyles.mapIcon} alt="marker" />
      </Marker>
      {this.state.showPopup && (
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
      )}
    </>
  );

  onSelected = (viewport, item) =>
    this.setState({
      viewport,
      tempMarker: {
        name: item.place_name,
        longitude: item.center[0],
        latitude: item.center[1],
      },
    });

  add = () => {
    const { tempMarker } = this.state;
    this.setState(
      (prevState) => ({ markers: [...prevState.markers, tempMarker], tempMarker: null }),
      () => this.props.onChange?.(this.state.markers),
    );
  };

  render() {
    const { isReadOnly } = this.props,
      { viewport, tempMarker } = this.state;

    return (
      <section>
        {!isReadOnly && (
          <header className={mapStyles.header_main}>
            <Geocoder
              mapboxApiAccessToken={mapboxApiKey}
              onSelected={this.onSelected}
              viewport={viewport}
              hideOnSelect={true}
              value=""
              className={mapStyles.react_geocoder}
            />
            <div className={mapStyles.buttonStyle}>
              <Button color="primary" onClick={this.add} children="Add New Mark" />
            </div>
          </header>
        )}

        <ReactMapGL
          mapboxApiAccessToken={mapboxApiKey}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          {...viewport}
          {...mapStyle}
          onViewportChange={(viewport) => this.setState({ viewport })}
        >
          {tempMarker && (
            <Marker longitude={tempMarker.longitude} latitude={tempMarker.latitude}>
              <div className="marker temporary-marker" />
            </Marker>
          )}
          {this.state.markers.map((marker) => this.customMarker({ marker }))}
        </ReactMapGL>
      </section>
    );
  }
}

export { MapView };

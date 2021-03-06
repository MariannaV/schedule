import * as React from 'react';
import App from 'next/app';
import Head from 'next/head';

import 'antd/dist/antd.css';
import '../styles/main.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

class RsSchoolApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <title>App / The Rolling Scopes School</title>
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
}

export default RsSchoolApp;

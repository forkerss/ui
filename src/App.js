import React from 'react';
import { Layout } from "antd";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "antd/dist/antd.css";

import "./globals";
import './assets/index.css';
import Header from "./components/Header/Header";
import ContentMain from "./components/MainContent/MainContent";
import Footer from "./components/Footer/Footer";


function AppLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <ContentMain />
      <Footer />
    </Layout>
  );
}

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route component={AppLayout} />
        </Switch>
      </Router>
    );
  }
};

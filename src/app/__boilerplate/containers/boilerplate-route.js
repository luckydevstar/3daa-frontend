import React from 'react';
import common from 'app/common';
import Header from '../components/boilerplate-header';
import Nav from '../components/boilerplate-nav';
import { connect } from 'react-redux';
import { Creators } from '../actions';
import { bindActionCreators } from 'redux';

const { components: { Footer } } = common;

class BoilerplateRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      example: 'state'
    };
  }

  render() {
    return (
      <div className="workbooks-route-container">
        <Header />
        <Nav />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ exampleReducer }) => ({ ...exampleReducer });

const { exampleAction } = Creators;

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      exampleAction
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(BoilerplateRoute);

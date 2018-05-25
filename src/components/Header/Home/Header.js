import React, { Component } from 'react';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/fontawesome-free-solid'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'

class Header extends Component {
    constructor(props) {
      super(props)
    }

render(){
const { properties } = this.props
return (
    <div className={"app-header"}>
      <div className="upper-header">
        <div className="container">
          <h6 className="mx-5 px-1 mb-0">Agid + Team Digitale</h6>
        </div>
      </div>
      <div className="main-header container">
        <div className="h-100 bg-primary row">
          <div className="col-md-2 col-lg-1 col-sm-2 col-xs col-3 pt-2 h-auto">
            <Link to={'/'}>
              <img src='./img/DAF_pittogramma_FU.svg' alt="" className="logo-pub"/>
            </Link>
          </div>
          <div className="col-md col-lg col-sm col-xs col pt-2 h-auto">
            <div className="row mx-0">
              <Link className="text-white" to={'/'}>
                <h2 className="mr-4 mb-0">{/* props.styleProps.headerSiglaTool */}<b>DAF {properties.headerSiglaTool}</b></h2>
              </Link>
              <span className="badge badge-pill mt-2 h-100" style={{backgroundColor: 'rgba(0,0,0,0.2)', height: 'max-content'}}>versione alpha 1.0</span>
            </div>
            <p className="d-sm-down-none">{/* props.styleProps.headerDescTool */}{"Data & Analytics Framework"} <b>{properties.headerDescTool}</b></p>
          </div>
        </div>
      </div>
      </div>
    )
  }
}

Header.propTypes = {
  properties: PropTypes.object,
}

function mapStateToProps(state) {
const { properties } = state.propertiesReducer['prop'] || {}

return { properties }
}

export default connect(mapStateToProps)(Header);
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, HashRouter, Redirect, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import Full from '../Full/'
import Home from '../Home/'
import PropTypes from 'prop-types'
import { loginAction, addUserOrganization, isValidToken, receiveLogin, getApplicationCookie, fetchProperties } from './../../actions.js'
import { serviceurl } from '../../config/serviceurl.js'
import { setCookie } from '../../utility'
import ReduxToastr from 'react-redux-toastr'
import Public from '../Public/';

const history = createBrowserHistory();

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}

function PrivateRouteAdmin({ component: Component, authed, role, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => (authed === true && role==='daf_admins')
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/private/home', state: { from: props.location } }} />}
    />
  )
}

function PrivateRouteEditor({ component: Component, authed, role, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => (authed === true && (role === 'daf_editors' || role === 'daf_admins'))
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/private/home', state: { from: props.location } }} />}
    />
  )
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/home' />}
    />
  )
}

class App extends Component {
  state = {
    loading: true,
  }
  componentDidMount() {
    const { dispatch } = this.props
    var domain = window.location.host
    var split = domain.split('.')
    dispatch(fetchProperties(split[0]))
    .then(json => {
      var html = document.getElementsByTagName('html')[0];
      switch(json.properties.theme){
        case "1":
          html.style.setProperty("--primary", "#4975A6");
          html.style.setProperty("--lightblue", "#5B83AF");
          this.setState({
            loading: false
          })
          break;
        default:
          html.style.setProperty("--primary", "#0066CC");
          html.style.setProperty("--lightblue", "#1A75D1");
          this.setState({
            loading: false
          })
          break;
      }
    })
  /*     if (this.props.loggedUser && this.props.loggedUser.mail) {
      this.setState({
        authed: true,
        loading: false
      })
    } else {
      if (localStorage.getItem('username') && localStorage.getItem('token') &&
        localStorage.getItem('username') !== 'null' && localStorage.getItem('token') !== 'null') {
        dispatch(isValidToken(localStorage.getItem('token')))
        .then(ok => {
          if (ok) {
                dispatch(getApplicationCookie('superset'))
                .then(json => {
                  if (json) {
                    setCookie(json)
                  }
                })
                dispatch(getApplicationCookie('metabase'))
                .then(json => {
                  if (json) {
                    setCookie(json)
                  }
                })
                dispatch(getApplicationCookie('jupyter'))
                .then(json => {
                  if (json) {
                    setCookie(json)
                  }
                }) */
                /* dispatch(getApplicationCookie('grafana'))
                .then(json => {
                  if (json) {
                    setCookie(json)
                  }
                }) */
                /* dispatch(loginAction())
                  .then(json => {
                      dispatch(receiveLogin(json)) */
                      /* dispatch(addUserOrganization(json.uid)) */
                      /* this.setState({
                          authed: true,
                          loading: false
                        })
                })
              } else {
                this.setState({
                  authed: false,
                  loading: false
              })
              this.props.history.push('/login')
              }
            })
            .catch((error) => {
              this.setState({
                authed: false,
                loading: false
              })
            })
          } else {
            this.setState({
              authed: false,
              loading: false
            })
          }
        }*/
      } 
      
  componentWillUnmount() {
    this.removeListener()
  }
  render() {
    return this.state.loading === true ? <h1 className="text-center fixed-middle"><i className="fas fa-circle-notch fa-spin mr-2" />Caricamento</h1> : (
      <div>
        <HashRouter history={history}>
          <Switch>
            <Route path='/' exact component={Public} />
            <Route path='/home' exact component={Public} />
            <Route path='/missione' exact component={Public} />
            <Route path='/lineeguida' exact component={Public} />
            <Route path='/partecipa' exact component={Public} />
            <Route path='/datapplication' exact component={Public} />
            <Route path='/userstory/list' exact component={Public} />
            <Route path='/team' exact component={Public} />            
            <Route path='/notizie' exact component={Public} />
            <Route path='//notizie/:id' exact component={Public} />
            <Route path='/storie' exact component={Public} />
            <Route path='/private' exact component={Home} />
            <Route path="/login" component={Home} />
            <Route path="/register" component={Home} />
            <Route path="/confirmregistration" component={Home} />
            <Route path="/requestreset" component={Home} />
            <Route path="/resetpwd" component={Home} />
            <Route path="/private/home" name="Home" component={Full} />
            <Route path="/private/prova" name="Home" component={Full} />
            <Route path="/private/dashboard" name="Dashboard" component={Full} />
            <Route path="/private/widget" name="Widget" component={Full} />
            <Route path="/private/ingestionwizzard" name="Ingestion" component={Full} />
            <Route path="/private/ontologies" name="Ontologies" component={Full} />
            <Route path="/private/vocabulary" name="Vocabulary" component={Full} />
            <Route exact path="/private/dataset" name="Dataset" component={Full} />
            <Route exact path="/private/dataset_old" name="Dataset" component={Full} />
            {<Route exact path="/private/search" name="Search" component={Full} />}
            <Route exact path="/private/dataset/:id" name="Dataset Detail" component={Full} />
            <Route path="/private/dashboard/manager" name="Dash" component={Full} />
            <Route path="/private/dashboard/list" name="Dash" component={Full} />
            <Route path="/private/user_story" name="Storie" component={Full} />
            <Route path="/private/profile" name="Profile" component={Full} />
            <Route path="/private/crea" name="Crea" component={Full} />
            <Route path="/private/settings" name="Settings" component={Full} />
            <Route path="/private/organizations" name="Organizations" component={Full} />
            <Route path="/private/users" name="Users" component={Full} />
          </Switch>
        </HashRouter>
        <ReduxToastr
          timeOut={6000}
          newestOnTop={true}
          preventDuplicates
          position="top-right"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar/>
      </div>

    );
  }
}

App.propTypes = {
  loggedUser: PropTypes.object,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { loggedUser, authed } = state.userReducer['obj'] || {}
  return { loggedUser, authed }
}

export default connect(mapStateToProps)(App)

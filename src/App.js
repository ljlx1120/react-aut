import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 1000);
  },
  signOut(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 1000);
  }
}

const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

class LogIn extends Component {

  state = {
    redirectToReferrer: false
  }

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({
        redirectToReferrer: true
      });
    });
  }

  render() {

    const { redirectToReferrer } = this.state;

    const { from } = this.props.location.state || { from: {pathname: '/'} }

    if (redirectToReferrer) {
      return (
        <Redirect to={from} />
      );
    }

    return (
      <div>
        <p>You must log in to view {from.pathname}</p>
        <button onClick={this.login}>LOGIN</button>
      </div>
    );
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated ? <Component {...props} /> : <Redirect to={{
      pathname: '/login',
      state: { from: props.location }
    }} />
  )} />
)

const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated
    ? <p>Welcome! <button onClick={() => {
      fakeAuth.signOut(() => history.push('/'))
    }}>LOGOUT</button></p>
    : <p>You're not logged in!</p>
));

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <AuthButton />
          <ul>
            <li><Link to='/public'>Public page</Link></li>
            <li><Link to='/protected'>Protected page</Link></li>
          </ul>

          <Route path='/public' exact component={Public} />
          <Route path='/login' exact component={LogIn} />
          <PrivateRoute path='/protected' exact component={Protected} />
        </div>
      </Router>
    );
  }
}

export default App;

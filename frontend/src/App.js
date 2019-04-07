import React, {Component} from 'react';
import './App.css';
import BarWithDrawer from './Components/BarWithDrawer';
import {Route} from 'react-router-dom';
import PdfView from './Components/Pages/PdfView';
import PdfsList from './Components/Pages/PdfsList';

const routes = [
  {
    path: '/',
    exact: true,
    appbarText: () => 'Wybierz Stronę',
    main: PdfsList
  },
  {
    path: '/paper/:id',
    appbarText: ({match}) => match.params.id,
    main: PdfView
  }
];

class App extends Component {
  render() {
    return (
      <div>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            render={(props) => <BarWithDrawer pageTitle={route.appbarText(props)}/>}
          />
        ))}
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.main}
          />
        ))}
      </div>
    );
  }
}

export default App;

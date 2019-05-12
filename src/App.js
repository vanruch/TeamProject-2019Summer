import React, {useContext} from 'react';
import './App.css';
import BarWithDrawer from './Components/BarWithDrawer';
import {Route} from 'react-router-dom';
import PdfView from './Components/Pages/PdfView';
import PdfsList from './Components/Pages/PdfsList';
import {ServiceContext} from './Services/SeviceContext';
import PageTitleComponent from './Components/PageTitleComponent';


function App() {
  const {publicationsService} = useContext(ServiceContext);

  const routes = [
    {
      path: '/',
      exact: true,
      appbarText: () => () => 'Wybierz Publikację',
      main: PdfsList
    },
    {
      path: '/paper/:id/:page',
      appbarText: ({match}) => async () => {
        const publication = await publicationsService.getPublication(match.params.id);
        return <PageTitleComponent publication={publication} match={match}/>;
      },
      main: PdfView
    }
  ];

  return (
    <div>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          render={(props) => <BarWithDrawer pageTitleLoader={route.appbarText(props)}/>}
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

export default App;

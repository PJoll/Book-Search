import React from 'react';
import { BrowserRouter as Router,  Route } from 'react-router-dom';
import {ApolloProvider} from '@apollo/react-hooks';
import ApolloClient from 'appolo-boost';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

const apolloClient = new ApolloClient({
  request: operation => {
    const token = localStorage.getItem('id_token');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer${token}` : ''
      }
    });
  },
  uri: '/graphql'
});


function App() {
  return (
    <ApolloProvider client = {client}>
      <Router>
      <>
        <Navbar />
        <Switch>
        
          <Route 
            path='/' 
            component={SearchBooks } 
          />
          <Route 
            path='/saved' 
            component={SavedBooks } 
          />
          <Route 
            render={()=><h1 className='display-2'>Wrong page!</h1>}
          />
        </Switch>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;

import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchSuccessRecords from './components/FetchSuccessRecords';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
	<Route path='/counter' component={Counter} />
	<Route path='/fetchsuccessrecords/:startDateIndex?' component={FetchSuccessRecords} />
</Layout>;

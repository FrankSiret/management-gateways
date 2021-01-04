import React from 'react'
import { Provider } from 'react-redux';

import { Container } from 'reactstrap';

import store from './store';

import AppNavbar from './components/AppNavbar';
import GatewayList from './components/GatewayList';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
	return (
		<Provider store={store}>
			<div className='App'>
				<AppNavbar />
				<Container>
					<GatewayList />
				</Container>
			</div>
		</Provider>
	);
}

export default App;

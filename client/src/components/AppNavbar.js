import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Container
} from 'reactstrap';

const AppNavbar = () => {

    return (
        <div>
            <Navbar color='dark' dark expand='sm' className='mb-5'>
                <Container>
                    <NavbarBrand href='/'>Gateway Management</NavbarBrand>
                </Container>
            </Navbar>
        </div>
    )
}

export default AppNavbar

//import {BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom' // 5.0x -- Switch ¬¬
import  {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

// componets
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Container from './components/layouts/Container';
import Message from './components/layouts/Message';

// pages
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';
import Home from './components/pages/Home';

// context
import {UserProvider} from './context/UserContext'

function App() {
    return (
        <BrowserRouter>
            <UserProvider>
                <Navbar/>
                    <Message/>
                    <Container>
                        {/* 6.0x */}
                        <Routes> 
                            <Route path='/' element={<Home/>}/> 
                            <Route path='/login' element={<Login/>}/>
                            <Route path='/register' element={<Register/>}/> 
                            <Route path='/about' element={<Navigate to='/'/>}/> 
                        </Routes>
                    </Container>
                <Footer/>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;

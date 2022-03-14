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
import Profile from './components/pages/User/Profile';
import AddPet from './components/pages/Pet/AddPet'
import MyPets from './components/pages/Pet/MyPets'
import EditPet from './components/pages/Pet/EditPet'
import PetDetails from './components/pages/Pet/PetDetails'
import MyAdoptions from './components/pages/Pet/MyAdoptions'
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
                            <Route path='/user/profile' element={<Profile/>}/> 
                            <Route path='/pet/add' element={<AddPet/>}/> 
                            <Route path='/pet/edit/:id' element={<EditPet/>}/> 
                            <Route path='/pet/mypets' element={<MyPets/>}/> 
                            <Route path='/pet/myadoptions' element={<MyAdoptions/>}/> 
                            <Route path='/pet/:id' element={<PetDetails/>}/> 
                            <Route path='/about' element={<Navigate to='/'/>}/> 
                        </Routes>
                    </Container>
                <Footer/>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;

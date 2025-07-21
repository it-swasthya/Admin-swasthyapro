import  { useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import SwitchTabs from './SwitchButton';
import { useDispatch } from 'react-redux';
import { changeNavValue } from '../Redux/reducer';

const BookTestForUser = () => {
  const dispatch = useDispatch()
  const location = useLocation();

  const { user, tests = [], packages = [] } = location.state || {};
useEffect(()=>{
 dispatch(changeNavValue("Book a test for "+ user.fullName))
},[])
  return (
   
    <>
    <SwitchTabs userData={user}/>
    </>
  );
};

export default BookTestForUser;

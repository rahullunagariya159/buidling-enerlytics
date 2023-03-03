import React, { useContext, useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';

import { AccountContext } from './Account';
import { Auth } from 'aws-amplify';

const Status = () => {
  const [status, setStatus] = useState(false);
  const { getSession, logout } = useContext(AccountContext);

  useEffect(() => {
    getSession()
      .then((session) => {
        // console.log('Session Success : ', session);
        setStatus(true);
        ReactSession.set("is_logged_in", 'true');
      })
      .catch((err) => {
        // console.log('Session Failure : ', err);
        setStatus(false);
        // ReactSession.set("is_logged_in", false);
      });

    // Auth.currentSession()
    //   .then(data => {
    //     console.log('Social Session Success : ', data);
    //     let idToken = data.getIdToken();
    //     let email = idToken.payload.email;
    //     setStatus(true);
    //     ReactSession.set("is_logged_in", 'true');
    //   })
    //   .catch(err => {
    //     console.log('Social Session Failure: ', err);
    //   });

  }, [status]);

  return '';
  // return (
  //   <div className='sessionStatus'>
  //     {status ? (
  //       <div>
  //         {' '}
  //         You are logged in.
  //         <button onClick={logout}>Logout</button>
  //       </div>
  //     ) : (
  //       'Please Login !'
  //     )}
  //   </div>
  // );
};

export default Status;

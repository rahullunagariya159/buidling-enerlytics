import React, { useEffect, useState, useRef } from 'react';
import { ReactSession } from 'react-client-session';

import { useNavigate, useSearchParams } from "react-router-dom";
import { set3dJSONData, get3dJSONData } from './Services/UserService';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import { Auth } from 'aws-amplify';
import LeftSidebar from './LeftSidebar';
import BuildingApp from '../BuildingApp';

function BEModal() {
  const threeDRef = useRef();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [b3Data, setB3Data] = useState(null);
  const [btnClicked, setBtnClicked] = useState(false);
  const [projectStatus, setProjectStatus] = useState(true);
  const projectName = searchParams.get('name') ? searchParams.get('name') : '';
  const isGuestUser = searchParams.get('skip') || false;
  const projectData = ReactSession.get("bp3dJson");
  const [userID, setUserId] = useState('');

  const handleNextClick = () => {
    setBtnClicked(true);
    let canvasElm = document.querySelector('#canvas3D canvas');
    let image = canvasElm.toDataURL('image/jpeg');

    threeDRef.current.handleSaveJson();

    if (!b3Data && projectData && projectData !== 'null') {
      setB3Data(projectData);
    }

    if ((b3Data) || (projectData && projectData !== 'null')) {
      const payload = {
        "projectId": ReactSession.get('project_id'),
        "userId": userID,
        "data": projectData,
        "name": "Basic",
        "image": image
      };
      set3dJSONData(payload)
        .then(response => {
          if (response.error) {
            toast.error(response.error);
          } else {
            console.log(response);
            if (isGuestUser) {
              setTimeout(navigate({ pathname: '/building-material', search: '?name=' + projectName + '&&skip=true', state: b3Data }), 2000);
            } else {
              setTimeout(navigate({ pathname: '/building-material', search: '?name=' + projectName, state: b3Data }), 2000);
            }
          }
        });
    }
  }

  const handleGet3dJSONData = (ID) => {
    const payload = {
      "projectId": ReactSession.get('project_id'),
      "userId": ID
    };

    get3dJSONData(payload)
      .then(response => {
        if (response.error) {
          toast.error(response.error);
        } else {
          // data comes here..
          // console.log(response);
          if (response.data && response.data.length) {
            setB3Data(response.data[0].data);
            ReactSession.set("bp3dJson", response.data[0].data);
            setTimeout(setProjectStatus(true), 1000);
          }
        }
      });
  }

  const handleCallback = (childData) => {
    if (childData) {
      setB3Data(childData);
      setProjectStatus(true);
    }
  }

  const returnToModelFullScreen = () => {

    threeDRef.current.handleSaveJson();

    if (!b3Data && projectData && projectData !== 'null') {
      setB3Data(projectData);
    }

    if (isGuestUser) {
      setTimeout(navigate({ pathname: '/be-model', search: '?name=' + projectName + '&&skip=true', state: b3Data }), 2000);
    } else {
      setTimeout(navigate({ pathname: '/be-model', search: '?name=' + projectName, state: b3Data }), 2000);
    }
  }

  useEffect(() => {

    let IDVal;
    if (isGuestUser) {
      IDVal = ReactSession.get('guest_user_id');
      setUserId(IDVal);
    } else {
      IDVal = (ReactSession.get('building_user') && ReactSession.get('building_user') !== 'null') ? ReactSession.get('building_user') : ReactSession.get('building_social_user');
      setUserId(IDVal);
    }

    setProjectStatus((projectData && projectData !== 'null' && projectData.length) || false);
    handleGet3dJSONData(IDVal);

    Auth.currentSession()
      .then(data => {
        ReactSession.set("is_logged_in", 'true');
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="main-parant-11">
        <section className="sec-1">
          <div className="container-be BEmodal-container">
            <div className="row">
              <div className="col-lg-3 left-side-bar-container">
                <LeftSidebar module="BE" />
              </div>
              <div className="col-lg-9 no-padding relative">
                {/* //BE-Modal here */}
                <a className="edit-model-btn clickable" onClick={returnToModelFullScreen}>
                  {/* <img src="assets/img/Home-Page/homeFinal/edit.svg" alt="" />ENTER DRAWING MODE */}
                  <img src="assets/img/BeModel/layout_21@2x.png" alt="Submit and Exit Drawing Mode" className='clickable' />
                </a>
                <div className='be-model-containter be-min'>
                  <BuildingApp parentCallback={handleCallback} hideLeftToolBar="true" loadCalled={projectStatus} ref={threeDRef} />
                </div>
                {/* <div className='image-canvas'>
                  <img src={canvasImage}></img>
                </div> */}
                <div className="modal-next-container container-min">
                  {!btnClicked &&
                    (
                      <a className="btn next-btnes" onClick={handleNextClick}>Proceed</a>
                    )
                  }
                  {btnClicked &&
                    (
                      <a className="btn next-btnes btn-disabled"><i class="fa fa-spinner fa-spin"></i> Please Wait ...</a>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BEModal;

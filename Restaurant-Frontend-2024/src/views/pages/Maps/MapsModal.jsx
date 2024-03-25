import Modal from 'react-bootstrap/Modal';
import React from 'react'
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import GoogleMaps from './GoogleMaps';

export default function MapsModal(props) {
    const navigate = useNavigate()
  const url = window.location.origin + '/map';

  const handleSave = () => {
    localStorage.setItem('lati', localStorage.latitude)
    localStorage.setItem('longi', localStorage.longitude)
    localStorage.removeItem('latitude')
    localStorage.removeItem('longitude')
    navigate('/Restaurant',  {state:  'coordinates' })
  }

  return (
    <div >
        <Modal
        id="custom-modal-container" 
          show={props.show}
          onHide={props.close}
          backdrop="static"
        //   fullscreen={true}
          size="xl"
        //   height="100%"
        >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Select Location
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="custom-modal-container">
            <iframe width="100%" height="100%" src={url} />
            {/* <GoogleMaps /> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.close} >
            Close
          </Button>
          <Button variant="success" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

import { QRCodeSVG } from 'qrcode.react';

function PhotoUploadQR() {  
  return (
    <div style={{ textAlign: 'center', padding: '0.8rem' }}>
      <QRCodeSVG 
        value={`http://${process.env.REACT_APP_LOCAL_IP}:${process.env.REACT_APP_FE_PORT}/upload`}
        size={100}
        level="H"
      />
    </div>
  );
}

export default PhotoUploadQR;
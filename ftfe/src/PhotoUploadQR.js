import { QRCodeSVG } from 'qrcode.react';

function PhotoUploadQR() {  
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <QRCodeSVG 
        value={`http://${process.env.REACT_APP_LOCAL_IP}:${process.env.REACT_APP_FE_PORT}/upload`}
        size={200}
        level="H"
      />
    </div>
  );
}

export default PhotoUploadQR;
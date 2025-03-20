import { QRCodeSVG } from 'qrcode.react';

function PhotoUploadQR() {  
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <QRCodeSVG 
        value={`${window.location.origin}/upload`}
        size={200}
        level="H"
      />
    </div>
  );
}

export default PhotoUploadQR;
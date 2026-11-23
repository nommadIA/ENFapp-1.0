import QRCode from 'qrcode';

declare global {
  interface Window {
    ENF_QR?: typeof QRCode;
  }
}

window.ENF_QR = QRCode;

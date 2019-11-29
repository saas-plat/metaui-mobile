let isMobile = false;
if ((/android/i).test(navigator.userAgent) || (/iphone|ipad/i).test(navigator.userAgent)) {
  const meta = document.querySelector('meta[name="viewport"]')||{};
  const content = meta.content;
  if (!(/initial-scale=1,/g.test(content))) {
    isMobile = true;
  }
}
export const DPR = isMobile ? (window.devicePixelRatio || 1) : 1;

export const topx = (num = '') => {
  if (typeof num === "number") {
    return (num * DPR) + 'px';
  } else
  if (num.indexOf('%')) {
    return num;
  } else {
    const n = parseFloat(num);
    if (n) {
      return (n * DPR) + 'px';
    } else {
      return num;
    }
  }
}

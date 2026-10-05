/* Screen corners are measured in the original 1672 × 941 photographs.
   Project the complete interface into the glass; never transform it independently
   from the photograph when the scene zooms or the viewport changes. */
(() => {
  const screens = [
    { selector: '.phone-ui', plane: '.cockpit-plane', width: 328, height: 608,
      corners: [[744.5, 246], [905, 246], [909, 548], [740, 548]] },
    { selector: '.helmet-phone', plane: '.helmet-plane', width: 220, height: 330,
      corners: [[759.5, 666.5], [864, 666.5], [870, 831], [750, 831]] }
  ];

  function projection(corners, width, height, scaleX, scaleY) {
    const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]] = corners;
    const dx1=x1-x2, dx2=x3-x2, dx3=x0-x1+x2-x3;
    const dy1=y1-y2, dy2=y3-y2, dy3=y0-y1+y2-y3;
    const determinant=dx1*dy2-dx2*dy1;
    const g=(dx3*dy2-dx2*dy3)/determinant;
    const h=(dx1*dy3-dx3*dy1)/determinant;
    const a=x1-x0+g*x1, b=x3-x0+h*x3;
    const d=y1-y0+g*y1, e=y3-y0+h*y3;
    return `matrix3d(${[
      a*scaleX/width, d*scaleY/width, 0, g/width,
      b*scaleX/height, e*scaleY/height, 0, h/height,
      0, 0, 1, 0, x0*scaleX, y0*scaleY, 0, 1
    ].join(',')})`;
  }

  screens.forEach(({selector,plane,width,height,corners}) => {
    const screen = document.querySelector(selector);
    const photo = document.querySelector(plane);
    if (!screen || !photo) return;
    const fit = () => {
      screen.style.transform = projection(corners,width,height,
        photo.clientWidth/1672,photo.clientHeight/941);
      screen.dataset.fitted = 'true';
    };
    new ResizeObserver(fit).observe(photo);
    fit();
  });
})();

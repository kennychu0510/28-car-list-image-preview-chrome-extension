(function () {
  'use strict';
  const domain1 = 'https://dj1jdjkadk.28car.com';
  const domain2 = 'https://dj1jklak2e.28car.com';

  if (window.location.origin === 'https://www.28car.com') {
    // randomly redirect to page 1 or 2
    const random = Math.random();
    if (random > 0.5) {
      window.location.replace(domain1);
    } else {
      window.location.replace(domain2);
    }
  }

  const currentDomain = window.location.origin.includes('dj1jdjkadk') ? domain1 : domain2;

  function CarListingQueryHelper(index) {
    return {
      name: `#rw_${index} > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(1)`,
      engineType: `#rw_${index} > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2) > font`,
      seatCapacity: `#rw_${index} > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(3)`,
      fuelTankSize: `#rw_${index} > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(4)`,
      transmissionType: `#rw_${index} > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(5)`,
      releaseYear: `#rw_${index} > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(6)`,
      pricingDetails: `#rw_${index} > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(7)`,
      ownerContact: `#rw_${index} > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > font:nth-child(2) > b`,
      isSold: `#rw_${index} > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(10)`,
      lastUpdate: `#rw_${index} > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > font > font`,
      detailLink: `#rw_${index} > table > tbody > tr > td:nth-child(1)`,
      idRow: `#rw_${index}`,
      lastCol: `#rw_${index} > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2)`,
    };
  }

  function getIdFromOnClickFunction(onClickFunction) {
    if (!onClickFunction) return '';
    return onClickFunction.split(',')[1].trim() ?? '';
  }

  function getCarDetailUrl(id) {
    return `${currentDomain}/sell_dsp.php?h_vid=${id}&h_vw=y`;
  }

  console.log('28 car image preview script running');

  window.addEventListener('message', function (event) {
    if (typeof event.data !== 'string') return;
    //console.log('FROM iFrame', event.data);
  });

  const carList = document.querySelectorAll('[id^="rw_"]');
  for (let i = 0; i < carList.length; i++) {
    const queryHelper = CarListingQueryHelper(i);
    const name = document.querySelector(queryHelper.name).textContent;
    const onClickFunction = document.querySelector(queryHelper.detailLink).getAttribute('onclick');
    const carId = getIdFromOnClickFunction(onClickFunction);
    const carDetailUrl = getCarDetailUrl(carId);
    const lastCol = document.querySelector(queryHelper.lastCol);
    // console.log([i, name, carDetailUrl]);
    const div = document.createElement('div');
    div.style.width = '200px';
    div.style.height = '150px';
    const iframe = document.createElement('iframe');
    iframe.src = carDetailUrl;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.overflow = 'hidden';

    div.appendChild(iframe);
    iframe.onload = function (event) {
      const loadingOverlay = iframe.contentDocument.createElement('div');
      loadingOverlay.style.position = 'absolute';
      loadingOverlay.style.width = '100dvw';
      loadingOverlay.style.height = '100vh';
      loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      loadingOverlay.style.top = '0';
      loadingOverlay.style.left = '0';
      loadingOverlay.style.right = '0';
      loadingOverlay.style.bottom = '0';
      loadingOverlay.style.color = 'white';
      loadingOverlay.style.display = 'flex';
      loadingOverlay.style.justifyContent = 'center';
      loadingOverlay.style.alignItems = 'center';
      loadingOverlay.style.zIndex = '1000';
      const textContent = iframe.contentDocument.createElement('div');
      textContent.textContent = 'Loading...';
      textContent.style.color = 'white';
      iframe.contentDocument.body.append(loadingOverlay);
      loadingOverlay.append(textContent);
      window.parent.postMessage('Hello from iFrame ' + i, '*');
      const anchor = iframe.contentDocument.querySelector(`a[href^="javascript:openPic(\'sell\', ${carId},"]`);
      if (anchor) {
        const firstImageSrc = anchor.querySelector('img').getAttribute('src');
        const image = iframe.contentDocument.createElement('img');
        image.src = firstImageSrc;
        image.style.width = '100%';
        image.style.height = 'auto';
        iframe.contentDocument.body.replaceWith(image);
      } else {
        setTimeout(() => {
          const anchor = iframe.contentDocument.querySelector(`a[href^="javascript:openPic(\'sell\', ${carId},"]`);
          if (anchor) {
            const firstImageSrc = anchor.querySelector('img').getAttribute('src');
            const image = iframe.contentDocument.createElement('img');
            image.src = firstImageSrc;
            image.style.width = '100%';
            image.style.height = 'auto';
            iframe.contentDocument.body.replaceWith(image);
          } else {
            const span = iframe.contentDocument.createElement('span');
            span.textContent = 'Failed to load image';
            iframe.contentDocument.body.replaceWith(span);
          }
        }, 1000);
      }
      loadingOverlay.remove();
    };
    lastCol.replaceWith(div);
  }
})();

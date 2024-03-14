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

  console.log('28 car extension running');

  window.addEventListener('message', function (event) {
    if (typeof event.data !== 'string') return;
    console.log('FROM iFrame', event.data);
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'car-image') {
        const imageList = data.images;
        const image = document.createElement('img');
        image.id = 'car-image-' + data.index;
        let imageIndex = 0;
        image.addEventListener('click', (event) => {
          event.stopPropagation();
          imageIndex++;
          if (imageIndex >= imageList.length) imageIndex = 0;
          document.querySelector('#car-image-' + data.index).src = imageList[imageIndex];
        });
        image.src = imageList[0];
        image.style.width = '100%';
        image.style.height = 'auto';
        document.querySelector('#car-image-iframe-' + data.index).replaceWith(image);
        document.querySelector('#car-image-placeholder-' + data.index).remove();
      }
    } catch (error) {}
  });

  const carList = document.querySelectorAll('[id^="rw_"]');
  for (let i = 0; i < carList.length; i++) {
    const queryHelper = CarListingQueryHelper(i);
    const onClickFunction = document.querySelector(queryHelper.detailLink).getAttribute('onclick');
    const carId = getIdFromOnClickFunction(onClickFunction);
    const carDetailUrl = getCarDetailUrl(carId);
    const lastCol = document.querySelector(queryHelper.lastCol);

    const div = document.createElement('div');
    div.style.width = '200px';
    div.style.height = '150px';
    div.style.marginBottom = '5px';
    div.style.border = '1px solid grey';
    const divText = document.createElement('div');
    divText.id = 'car-image-placeholder-' + i;
    divText.classList.add('loading');
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.appendChild(divText);

    const onDoneLoading = () => {
      divText.remove();
      iframe.style.zIndex = 'unset';
      iframe.style.position = 'unset';
    };

    const updateDivText = (text) => {
      divText.textContent = text;
    };

    const iframe = document.createElement('iframe');
    iframe.id = 'car-image-iframe-' + i;
    iframe.src = carDetailUrl;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.overflow = 'hidden';
    iframe.style.zIndex = '-1';
    iframe.style.position = 'absolute';

    div.appendChild(iframe);
    iframe.onload = function (event) {
      window.top.postMessage('Hello from iFrame ' + i, '*');
      const anchors = iframe.contentDocument.querySelectorAll(`a[href^="javascript:openPic(\'sell\', ${carId},"]`);
      if (anchors) {
        const imageSrcList = [];
        for (let anchor of anchors) {
          imageSrcList.push(anchor.querySelector('img').getAttribute('src').replace('_s.jpg', '_b.jpg'));
        }
        window.top.postMessage(
          JSON.stringify({
            index: i,
            images: imageSrcList,
            type: 'car-image',
          }),
          '*'
        );
      } else {
        updateDivText('No image found');
      }
    };
    lastCol.replaceWith(div);
  }
})();
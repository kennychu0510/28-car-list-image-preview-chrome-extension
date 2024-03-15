(async function () {
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
      brand: `#rw_${index} > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(1) > b > font`,
    };
  }

  function getIdFromOnClickFunction(onClickFunction) {
    if (!onClickFunction) return '';
    return onClickFunction.split(',')[1].trim() ?? '';
  }

  function getCarDetailUrl(id) {
    return `${currentDomain}/sell_dsp.php?h_vid=${id}&h_vw=y`;
  }

  const carLogoMap = {
    本田: 'honda.png',
    愛快: 'alfa_romeo.png',
    阿斯頓馬丁: 'aston_martin.png',
    寶馬: 'bmw.png',
    奧迪: 'audi.png',
    賓利: 'bentley.png',
    寶馬: 'bmw.png',
    比亞迪: 'byd.png',
    先進: 'citroen.png',
    大發: 'daihatsu.png',
    東風: 'dong_feng.png',
    法拉利: 'ferrari.png',
    快意: 'fiat.png',
    福田: 'ford.png',
    日野: 'hino.png',
    現代: 'hyundai.png',
    INFINITI: 'infiniti.png',
    五十鈴: 'isuzu.png',
    歐霸: 'subaru.png',
    江淮: 'jac.png',
    積架: 'jaguar.png',
    JEEP: 'jeep.png',
    起亞: 'kia.png',
    凌志: 'lexus.png',
    林寶堅尼: 'lamborghini.png',
    越野路華: 'landrover.png',
    蓮花: 'lotus.png',
    猛獅: 'man.png',
    瑪莎拉蒂: 'maserati.png',
    萬事得: 'mazda.png',
    MAXUS: 'maxus.png',
    麥拿倫: 'mclaren.png',
    平治: 'benz.png',
    MG: 'mg.png',
    迷你: 'mini.png',
    三菱: 'mitsubishi.png',
    日產: 'nissan.png',
    歐寶: 'opel.png',
    標緻: 'peugeot.png',
    保時捷: 'porsche.png',
    雷諾: 'renault.png',
    勞斯萊斯: 'rolls_royce.png',
    路華: 'landrover.png',
    紳寶: 'saab.png',
    SCANIA: 'scania.png',
    中國重汽: 'cnhtc.png',
    SMART: 'smart.png',
    雙龍: 'ssangyong.png',
    富士: 'subaru.png',
    鈴木: 'suzuki.png',
    特斯拉: 'tesla.png',
    豐田: 'toyota.png',
    大實力: 'ud.png',
    福特: 'volkswagen.png',
    富豪: 'volvo.png',
  };

  function getLogo(name) {
    const icon = document.createElement('img');
    const src = chrome.runtime.getURL(`logo/${name}`);
    icon.src = src;
    icon.style.width = '30px';
    icon.style.marginRight = '5px';
    icon.style.marginLeft = '5px';
    icon.style.marginBottom = '-5px';
    icon.style.maxHeight = '30px';
    icon.style.objectFit = 'contain';
    return icon;
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
    const nameElm = document.querySelector(queryHelper.brand);
    const key = carLogoMap[nameElm.textContent.trim()];
    if (key) {
      const icon = getLogo(key);
      nameElm.prepend(icon);
    }

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

    setTimeout(() => {
      div.appendChild(iframe);
    }, i * 100);

    iframe.onload = function (event) {
      const anchors = iframe.contentDocument.querySelectorAll(`a[href^="javascript:openPic(\'sell\', ${carId},"]`);
      if (anchors) {
        const imageSrcList = [];
        for (let anchor of anchors) {
          imageSrcList.push(anchor.querySelector('img')?.getAttribute('src')?.replace(/_s\.jpg|_m\.jpg/g, '_b.jpg'));
        }
        if (imageSrcList.length > 0) {
          window.top.postMessage(
            JSON.stringify({
              index: i,
              images: imageSrcList,
              type: 'car-image',
            }),
            '*'
          );
        }
      } else {
        updateDivText('No image found');
      }
    };
    lastCol.replaceWith(div);
  }
})();

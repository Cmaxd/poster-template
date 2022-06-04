const handleDownload = (url: string, name: string) => {
  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, image.width, image.height);
      const url = canvas.toDataURL('image/jpeg');
      const a = document.createElement('a');
      const event = new MouseEvent('click');
      a.download = name;
      a.href = url;
      a.dispatchEvent(event);
      resolve(true);
    };
    image.onerror = () => {
      reject();
    };
    image.src = url;
  });
  return promise;
};

export default handleDownload;

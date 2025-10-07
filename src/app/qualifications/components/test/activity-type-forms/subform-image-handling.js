const handleImageUpload = (i, callback) => {
  const input = document.querySelector(`.image-upload-${i}`);
  const file = input.files[0];
  if (!file) {
    return;
  }
  if (!file.type.match(/image.*/)) {
    window.alert(
      'The file you are trying to upload is not an image. Please try again.'
    );
    return;
  }
  const img = document.createElement('img');
  img.src = window.URL.createObjectURL(file);
  img.onload = () => {
    const MAX_WIDTH = 80;
    const MAX_HEIGHT = 80;
    let width = img.width;
    let height = img.height;
    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else if (height > MAX_HEIGHT) {
      width *= MAX_HEIGHT / height;
      height = MAX_HEIGHT;
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    const dataUrl = canvas.toDataURL();
    callback(dataUrl);
  };
};

export default handleImageUpload;

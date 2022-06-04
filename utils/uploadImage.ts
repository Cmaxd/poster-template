import TTUploader from 'tt-uploader';
import { CommonServiceId } from '../constants/service';

async function uploadImage({ onProgress, onSuccess, onError, file }) {
  const uploader = new TTUploader({
    userId: 'haibao',
    // 上传日志以 AppId 维度区分，可替换成自已的 AppId
    appId: 123456,
    imageConfig: {
      serviceId: CommonServiceId,
    },
  });

  uploader.on('complete', info => {
    onSuccess((info as any)?.uploadResult);
  });

  uploader.on('error', info => {
    onError(info);
  });

  uploader.on('progress', info => {
    onProgress((info as any).percent);
  });

  const res = await fetch('/api/GetStsToken');
  if (res.ok) {
    const stsToken = await res.json();
    const fileKey = uploader.addImageFile({
      file,
      stsToken,
    });
    uploader.start(fileKey);
  } else {
    const error = await res.json();
    console.error(error);
  }
}

export default uploadImage;

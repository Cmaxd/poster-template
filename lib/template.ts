import { imagex } from '@volcengine/openapi';

import { AccessKeyId, SecretKey, StyleIdList } from '../constants/service';

const imagexService = imagex.defaultService;
imagexService.setAccessKeyId(AccessKeyId);
imagexService.setSecretKey(SecretKey);

const GetImageStyleDetail = imagexService.createUrlEncodeAPI('GetImageStyleDetail', {
  method: 'GET',
  contentType: 'urlencode',
});

export const getStyleIds = async () => {
  try {
    // 可以将样式ID列表放在服务端，便于快速更改模板
    return StyleIdList;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getStyleDetail = async () => {
  const templateIds = await getStyleIds();
  try {
    const result = (
      await Promise.all(
        templateIds.map(id =>
          GetImageStyleDetail({
            StyleId: id,
          })
        )
      )
    ).map(res => res?.Result);
    return result;
  } catch (e) {
    return [];
  }
};

import { imagex } from '@volcengine/openapi';
import { AccessKeyId, SecretKey } from '../../constants/service';

const imagexService = imagex.defaultService;
imagexService.setAccessKeyId(AccessKeyId);
imagexService.setSecretKey(SecretKey);

const GetImageStyleResult = imagexService.createUrlEncodeAPI('GetImageStyleResult', {
  method: 'POST',
  contentType: 'json',
  queryKeys: ['Action', 'Version', 'ServiceId']
});

export default async (req, res) => {
  const options = req.body ?? {};

  try {
    const result = await GetImageStyleResult(options);
    res.status(200).json(result?.Result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

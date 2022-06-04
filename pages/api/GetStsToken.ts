import { imagex } from '@volcengine/openapi';
import { AccessKeyId, SecretKey, CommonServiceId } from '../../constants/service';

const imagexService = imagex.defaultService;
imagexService.setAccessKeyId(AccessKeyId);
imagexService.setSecretKey(SecretKey);

export default async (_, res) => {
  const token = imagexService.GetUploadAuth({
    serviceIds: [CommonServiceId], // 仅允许上传到指定的服务ID，若无此限制，传递空数组即可
    expire: 5 * 60 * 1000, // 临时密钥过期时间（单位为毫秒），默认为1小时
  });
  res.status(200).json(token);
};

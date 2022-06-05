## 海报生成平台

注意：请先开通 [veImageX](https://t.zijieimg.com/Y1gyba7/) 

### 配置

打开 ./constants/service.ts 文件，设置以下字段

```
// 样式所属的 ServiceId
export const CommonServiceId = '';

// 服务下绑定的域名
export const CommonDomain = '';

// 服务下的模板，创建一个获取原图的模板即可，服务下边默认会有一个模板
export const CommonTemplate = 'tplv-xxx';

// 样式ID列表
export const StyleIdList = [''];

// AK/SK，用于访问 OpenAPI
export const AccessKeyId = '';
export const SecretKey = '';

```

### 安装依赖

```
npm install
```

### 开发调试

```
npm run dev
```

### 部署

```
npm start
```
import { useRef, useEffect, useState, useCallback } from 'react';
import Head from 'next/head'
import styles from '../styles/main.module.css'
import { getStyleDetail } from '../lib/template'
import { Divider, Form, Grid, Upload, Modal, Input, Button, Message, Radio } from '@arco-design/web-react'
import Image from 'next/image'
import { CommonDomain, CommonTemplate } from '../constants/service'
import downloadImage from '../utils/downloadImage'
import uploadImage from '../utils/uploadImage'
import "@arco-design/web-react/dist/css/arco.css";

const blurDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABQ0lEQVQ4jYWUUXLEIAxDn7wcpAfoKXr/E3WyVj9sAjtNJkwyEDCSjHD08/3l4zgAIwUKEQok9Qs2gAGwXSP3dwiAMIYAEASIAoioHirwqQ03MoBMKQohRTG2Eny1fbVwGhKKvFJRVIqSHvWoCcZOJWiABm4hspcyjHalHTO8S5ZPEKmDTxBv27a+Ccc6WCBM5nE6AmAltsGfSaoluxWO07FmqOW8OI2rubVjCNU4eipUmFGuKRMCnHfHXomPcmYqcrkQQioFjlrq23ApNCZQCXQFn44FkMu9u3vUBOO/4AaWsQusvm+AKjvGKqZW0LcbZp0tsDsQgOF8N6PALwy8fxOFGK8XzqRDVtze9/z4QNZcmss1dtvxmZ/W3bYJSU/1CDLuopq/l8Ve81HOr8DLlv3idrXIvVVOKRIP57kXreazUIA/pG2OC5DvTi8AAAAASUVORK5CYII=';

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
};

const FormItem = Form.Item;
const { Row, Col } = Grid;

export default function Home({ styleList }) {
  const [imageUrl, setImageUrl] = useState('');
  const [currentStyle, setCurrentStyle] = useState(styleList?.[0]?.Style);
  const [getUrlLoading, setGetUrlLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    setImageUrl('');
    getImageUrl({
      ServiceId: currentStyle.service,
      StyleId: currentStyle.id,
      Params: currentStyle?.elements?.reduce((res, current) => {
        res[current.id] = current.content;
        return res;
      }, {}),
    });
    (formRef.current as any).setFieldsValue(getInitialValues());
  }, [currentStyle])

  const getImageUrl = async (options) => {
    setGetUrlLoading(true);
    try {
      const res = await fetch('/api/GetImageStyleResult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(options)
      })
      if (res.ok) {
        const result = await res.json();
        setImageUrl(`${CommonDomain}/${result.ResUri}~${CommonTemplate}.jpeg`);
      } else {
        const error = await res.json();
        const message = error?.ResponseMetadata?.Error?.Message;
        message && Message.error(message);
      }
    } finally {
      setGetUrlLoading(false);
    }
  }

  const handlePreview = () => {
    if (formRef.current) {
      (formRef.current as any).validate((errors, values) => {
        if (errors) return;
        const formatValues = Object.keys(values).reduce((res, key) => {
          if (Array.isArray(values[key])) {
            if (values[key].length === 0) {
              res[key] = undefined;
            } else {
              res[key] = values[key][0]?.response?.Uri;
            }
          } else {
            res[key] = values[key];
          }
          return res;
        }, {});
        getImageUrl({
          ServiceId: currentStyle.service,
          StyleId: currentStyle.id,
          Params: formatValues,
        });
      });
    }
  }

  const handleDownload = async () => {
    setDownloadLoading(true);
    try {
      await downloadImage(imageUrl, `${currentStyle.name}.jpeg`);
    } finally {
      setDownloadLoading(false);
    }
  }

  const getInitialValues = useCallback(
    () => {
      return (currentStyle?.elements ?? []).reduce((res, item) => {
        if (item.type !== 'image') {
          res[item.id] = item.content;
        }
        return res;
      }, {});
    },
    [currentStyle],
  );

  const getFormItem = useCallback(() => {
    return (currentStyle?.elements ?? []).map(item => {
      switch (item.type) {
        case 'image':
          return <FormItem
            key={item.id}
            label={item.name}
            field={item.id}
            triggerPropName='fileList'
          >
            <Upload
              listType='picture-card'
              multiple={false}
              name={item.id}
              accept="image/*"
              limit={1}
              customRequest={uploadImage}
              onPreview={(file) => {
                Modal.info({
                  title: item.name,
                  content: (
                    <div style={{ width: 400, height: 300 }}>
                      <Image
                        src={file.url || URL.createObjectURL(file.originFile)}
                        layout='fill'
                        objectFit='contain'
                        placeholder='blur'
                        blurDataURL={blurDataUrl}
                        unoptimized={true}
                      />
                    </div>
                  )
                })
              }}
            />
          </FormItem>
        case 'text':
          return <FormItem
            key={item.id}
            label={item.name}
            field={item.id}
          >
            <Input.TextArea
              autoSize={true}
            />
          </FormItem>
        case 'qrcode':
          return <FormItem
            key={item.id}
            label={item.name}
            field={item.id}
          >
            <Input placeholder='请输入链接' />
          </FormItem>
        default: return null;
      }
    })
  }, [currentStyle])

  return (
    <div>
      <Head>
        <title>促销海报生成平台</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.title}>
          促销海报
        </div>
        <main className={styles.main}>
          <Row className={styles.row} gutter={100}>
            <Col span={14} className={styles.col}>
              <Row style={{ marginBottom: 15 }}>
                <Col span={7} style={{ textAlign: 'end', paddingRight: 16, color: 'rgb(78,89,105)' }}>模板类型:</Col>
                <Col span={17}>
                  <Radio.Group
                    name='radio'
                    value={currentStyle.id}
                    onChange={v => {
                      (formRef.current as any).resetFields();
                      setCurrentStyle(styleList.find(item => item.Style.id === v)?.Style);
                    }}
                  >
                    {styleList.map(item => <Radio key={item?.Style?.id} value={item?.Style?.id}>{item?.Style?.name}</Radio>)}
                  </Radio.Group>
                </Col>
              </Row>
              <Form
                ref={formRef}
                colon
                {...formItemLayout}
                initialValues={getInitialValues()}
                scrollToFirstError
              >
                {getFormItem()}
              </Form>
              <div style={{ textAlign: 'end' }}>
                <Button loadingFixedWidth loading={downloadLoading} disabled={getUrlLoading} type='primary' onClick={handleDownload}>下载海报</Button>
                <Button loadingFixedWidth loading={getUrlLoading} type='primary' style={{ marginLeft: 20 }} onClick={() => handlePreview()}>点击预览</Button>
              </div>
            </Col>
            <Col span={10} className={styles.col}>
              {
                imageUrl && <Image
                  src={imageUrl}
                  layout='responsive'
                  width={currentStyle?.width}
                  height={currentStyle?.height}
                  placeholder='blur'
                  blurDataURL={blurDataUrl}
                  unoptimized={true}
                />
              }
            </Col>
          </Row>
        </main>
        <footer className={styles.footer}>
          <Divider orientation='center'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 10 }}>Powered By</span>
              <a href='https://t.zijieimg.com/Y1gH3gU/' target='_blank'>
                veImageX
              </a>
              <a href='https://t.zijieimg.com/Y1gghms/' target='_blank' style={{ marginLeft: 10, fontSize: 0 }}>
                <span style={{ display: 'flex' }}>
                  <Image
                    src='/favicon.ico'
                    width={28}
                    height={28}
                    layout='fixed'
                    unoptimized={true}
                  />
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }} >创意魔方</span>
                </span>
              </a>
            </div>
          </Divider>
        </footer>
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const styleList = await getStyleDetail();
  return {
    props: {
      styleList
    }
  }
}

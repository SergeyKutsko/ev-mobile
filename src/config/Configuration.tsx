import { EndpointCloud } from '../types/Tenant';

export default class Configuration {
  public static readonly SERVER_URL_PREFIX = 'http://';
  public static readonly URL_PREFIX = 'http://';
  public static readonly AWS_REST_ENDPOINT_PROD = `${Configuration.SERVER_URL_PREFIX}10.0.2.2:81`;
  public static readonly AWS_REST_ENDPOINT_QA = 'http://10.0.2.2:81';

  public static readonly CAPTCHA_SITE_KEY = '6Ld4VPwpAAAAADeVXxlYjRqTg57dCwQZ5oyxALkC';
  public static readonly DEFAULT_ENDPOINT_CLOUD_ID = 'aws';
  public static readonly ENDPOINT_CLOUDS: EndpointCloud[] = [
    { id: Configuration.DEFAULT_ENDPOINT_CLOUD_ID, name: 'Amazon Web Service', endpoint: Configuration.AWS_REST_ENDPOINT_PROD }
  ];

  public static isServerLocalePreferred = true;

  public static DEV_ENDPOINT_CLOUDS = [
    {
      id: '10.0.2.2:81',
      name: 'android-local:81',
      endpoint: 'http://10.0.2.2:81'
    }
  ];

  public static readonly DEVELOPMENT_ENDPOINT_CLOUDS: EndpointCloud[] = [
    ...Configuration.ENDPOINT_CLOUDS,
    ...Configuration.DEV_ENDPOINT_CLOUDS
  ];

  public static getEndpoints(): EndpointCloud[] {
    if (__DEV__) {
      return Configuration.DEVELOPMENT_ENDPOINT_CLOUDS;
    } else {
      return Configuration.ENDPOINT_CLOUDS;
    }
  }
}

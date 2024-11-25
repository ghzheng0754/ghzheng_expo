/*
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

class PushNotificationService {
  constructor() {
    this.token = null;
  }

  // 初始化通知服务
  async init() {
    await this.requestPermission();
    await this.getFCMToken();
    this.listenForNotifications();
    this.listenForBackgroundMessages();
  }

  // 请求通知权限
  async requestPermission() {
    try {
      const authStatus = await messaging().requestPermission();
      const isAuthorized =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (isAuthorized) {
        console.log('Notification permission granted.');
      } else {
        console.warn('Notification permission denied.');
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  }

  // 获取 FCM 令牌
  async getFCMToken() {
    try {
      const token = await messaging().getToken();
      console.log('Token:', token);
      if (token) {
        this.token = token;
        console.log('FCM Token:', token);
        // 可将 token 上传到服务器
      } else {
        console.warn('No FCM Token received.');
      }
    } catch (error) {
      console.error('Error retrieving FCM Token:', error);
    }
  }

  // 监听前台通知
  listenForNotifications() {
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification received:', remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title || 'New Notification',
        remoteMessage.notification?.body || 'You have received a new message.'
      );
    });
  }

  // 监听后台消息（在 index.js 中设置处理器）
  listenForBackgroundMessages() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background notification received:', remoteMessage);
      // 在此处理后台消息逻辑
    });
  }

  // 获取当前 FCM 令牌
  getToken() {
    return this.token;
  }
}

const pushNotificationService = new PushNotificationService();
export default pushNotificationService;
*/
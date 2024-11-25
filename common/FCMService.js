import messaging from "@react-native-firebase/messaging";
import {Alert, PermissionsAndroid, Platform } from "react-native";

class FCMService {

  constructor() {
    this.token = null;
  }

  // 请求通知权限（针对 Android 13+ 显式请求通知权限）
  async requestNotificationPermission(){
  if (Platform.OS === "android" && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: "通知权限请求",
          message: "应用需要获取通知权限以接收推送通知。",
          buttonNeutral: "稍后询问",
          buttonNegative: "拒绝",
          buttonPositive: "同意",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("通知权限已授予");
        return true;
      } else {
        console.warn("通知权限被拒绝");
        Alert.alert(
          "通知权限被拒绝",
          "请到系统设置中手动开启通知权限。"
        );
        return false;
      }
    } catch (error) {
      console.error("请求通知权限时出错:", error);
      Alert.alert("请求通知权限失败", error.message || "未知错误");
      return false;
    }
  }
  else 
  {//ios 

    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("IOS通知权限已授予");
        return true;
      } else {
        console.warn("通知权限被拒绝");
        Alert.alert(
          "通知权限被拒绝",
          "请到系统设置中手动开启通知权限。"
        );
        return false;
      }
  }
  catch (error) {
    console.error("IOS请求通知权限时出错:", error);
    Alert.alert("请求通知权限失败", error.message || "未知错误");
    return false;
  }

  }

  };


  async setupFCM() {
    try {
      // 请求通知权限
      console.log("请求通知权限");
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return;

      if (hasPermission)
      {
        console.log("通知权限已授权");

        // 获取 FCM Token
        const token = await messaging().getToken();
        console.log("FCM Token:", token);
        this.token = token;

        // 监听前台消息
        messaging().onMessage(async (remoteMessage) => {
          console.log("收到前台消息:", remoteMessage);
          /*Alert.alert(
            remoteMessage.notification?.title || "新消息",
            remoteMessage.notification?.body || "点击查看详情"
          );*/

          if (remoteMessage.data) {
            console.log("接收到数据消息:", remoteMessage.data);
            Alert.alert("数据消息:", JSON.stringify(remoteMessage.data));
          } else {
            console.log("接收到通知消息:", remoteMessage.notification);
            Alert.alert("数据消息2:", remoteMessage.notification);
          }

        });

        // 后台消息
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
          console.log("收到后台消息:", remoteMessage);
        });

        // 用户点击通知
        messaging().onNotificationOpenedApp((remoteMessage) => {
          console.log("用户点击后台通知:", remoteMessage);
        });

        // 处理初始通知
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
          console.log("初始通知:", initialNotification);
        }
      } 
      else {
        console.warn("通知权限被拒绝");
      }
    } catch (error) {
      console.error("设置 FCM 时出错:", error);
      Alert.alert("通知设置失败", error.message || "未知错误");
    }
  };

  async currentToken() {
    return this.token;
  }

}

export default FCMService;


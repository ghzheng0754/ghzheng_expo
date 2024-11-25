import React, { useEffect, useState, useRef } from "react";
import { View, Text, Alert, PermissionsAndroid, Platform,TextInput,StyleSheet,Linking,StatusBar} from "react-native";
import { afeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WebView } from 'react-native-webview';
import useWebviewHandler from './common/useWebviewHandler'; // 引入自定义 Hook

//import messaging from "@react-native-firebase/messaging";
//import {setupFCM,currentToken} from "./common/FCMService";

const App = () => {
  const [fcmToken, setFcmToken] = useState("");
  //const fcmService = new FCMService();

  const {
    cookies,
    deviceModel,
    webViewRef,
    uuid,
    handleNavigationStateChange,
    handleMessage,
    handleShouldStartLoadWithRequest,
  } = useWebviewHandler(); // 使用自定义 Hook

  useEffect(() => {
    //fcmService.setupFCM();
    //setFcmToken(fcmService.setupFCM());

  }, []);


return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}/>
      <View style={styles.container}>
      <WebView
        ref={webViewRef} // 绑定 ref
        source={{ uri: "http://demo.handlebook.com.hk/BtoC/#!/template/newsList.php"}} // 替换为你的网页        
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onNavigationStateChange={handleNavigationStateChange}
        onMessage={handleMessage} // 处理来自 WebView 的消息
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        injectedJavaScript={`
          (function() {
            document.cookie = 'deviceModel=${uuid}'; // 将设备型号作为 cookie 设置
            document.cookie = 'UUID=${uuid}';			      
          })();
        `}
      />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
});
export default App;

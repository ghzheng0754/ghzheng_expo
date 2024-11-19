import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text ,Linking} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';

const App = () => {
  const [cookies, setCookies] = useState('');
  const deviceModel = Device.modelName; // 获取设备型号
  const webViewRef = useRef(null); // 创建 ref 用于 WebView

  useEffect(() => {
    const loadCookies = async () => {
      try {
        const storedCookies = await AsyncStorage.getItem('webviewCookies');
        if (storedCookies) {
          setCookies(storedCookies);
        }
      } catch (error) {
        console.error('Failed to load cookies:', error);
      }
    };

    loadCookies();
  }, []);

  const handleShouldStartLoadWithRequest = (event) => {
    // 检查链接是否有 target="_blank" 属性或是外部链接
    if (event.url.startsWith('http') && (event.url.includes('target=_blank'))) {
      // 打开外部链接
      Linking.openURL(event.url);
      return false; // 阻止 WebView 加载这个链接
    }
    return true; // 允许 WebView 加载其他链接
  };

  const handleNavigationStateChange = (navState) => {
    // 读取 WebView 的 cookie
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        (function() {
          window.ReactNativeWebView.postMessage(document.cookie);
        })();
      `);
    }
  };

  const handleMessage = (event) => {
    const cookiesFromWebView = event.nativeEvent.data;
    AsyncStorage.setItem('webviewCookies', cookiesFromWebView);
    setCookies(cookiesFromWebView);
  };

  return (
    <View style={styles.container}>
      <Text>Device Model: {deviceModel}</Text>
      <Text>WebView Cookies: {cookies}</Text>
      <WebView
        ref={webViewRef} // 绑定 ref
        source={{ uri: 'http://192.168.137.1:8083/test_php/test.html' }} // 替换为你的网页
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onNavigationStateChange={handleNavigationStateChange}
        onMessage={handleMessage} // 处理来自 WebView 的消息
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        injectedJavaScript={`
          (function() {
            document.cookie = 'deviceModel=${deviceModel}'; // 将设备型号作为 cookie 设置
			      document.getElementById('MName').value=getCookie('deviceModel');
            //alert(getCookie('deviceModel'));
          })();
        `}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default App;
import { useState, useEffect, useRef,Linking } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';

const useWebviewHandler = () => {
  const [cookies, setCookies] = useState('');
  const deviceModel = Device.modelName;
  const webViewRef = useRef(null);
  const uuid = Device.osBuildId;
  //const [uuid, setUuid] = useState('');

  console.log("useWebviewHandler-1");
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

  const handleNavigationStateChange = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        (function() {
          const currentCookies = document.cookie;
          window.ReactNativeWebView.postMessage(currentCookies);
        })();
      `);
    }
  };

  const handleMessage = async (event) => {
    const cookiesFromWebView = event.nativeEvent.data;
    try {
      await AsyncStorage.setItem('webviewCookies', cookiesFromWebView);
      setCookies(cookiesFromWebView);
    } catch (error) {
      console.error('Failed to save cookies:', error);
    }
  };

  const handleShouldStartLoadWithRequest = (event) => {
    // 检查链接是否有 target="_blank" 属性或是外部链接
    if (event.url.startsWith('http') && (event.url.includes('target=_blank'))) {
      // 打开外部链接
      Linking.openURL(event.url);
      return false; // 阻止 WebView 加载这个链接
    }
    return true; // 允许 WebView 加载其他链接
  };

  return {
    cookies,
    deviceModel,
    webViewRef,
    uuid,
    handleNavigationStateChange,
    handleMessage,
    handleShouldStartLoadWithRequest,
  };
};

export default useWebviewHandler;
// storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// 保存数据到 AsyncStorage
export const saveData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        console.log('数据已保存:', key);
    } catch (error) {
        console.error('保存数据时出错:', error);
    }
};

// 从 AsyncStorage 读取数据
export const loadData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (error) {
        console.error('读取数据时出错:', error);
    }
    return null; // 如果没有找到数据，返回 null
};
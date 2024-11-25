// config.js
import * as FileSystem from 'expo-file-system';

export const createDefaultConfig = async () => {
    const configFilePath = FileSystem.documentDirectory + 'config.json';

    // 检查配置文件是否存在
    const fileInfo = await FileSystem.getInfoAsync(configFilePath);
    
    if (!fileInfo.exists) {
        console.warn('配置文件不存在，正在创建默认配置文件...');
        
        const defaultConfig = {
            webUrl: "https://www.handlebook.com.hk/demo/gh/test.html" // 默认值
        };

        // 写入默认配置文件
        await FileSystem.writeAsStringAsync(configFilePath, JSON.stringify(defaultConfig));
        console.log('默认配置文件已创建。');
    }
    
    return configFilePath;
};

// 读取配置文件的公共函数
export const readConfigFile = async (filePath) => {
    try {
        // 检查文件是否存在
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists) {
            console.warn(`配置文件不存在: ${filePath}`);
            return null; // 文件不存在，返回 null
        }

        // 读取文件内容
        const fileContent = await FileSystem.readAsStringAsync(filePath);
        
        // 解析 JSON
        const config = JSON.parse(fileContent);
        return config; // 返回解析后的配置对象
    } catch (error) {
        console.error('读取配置文件失败:', error);
        return null; // 如果读取失败，返回 null
    }
};

// 根据键获取指定配置的内容
export const getConfigValue = async (filePath, key) => {
    try {
        const jsonString = await FileSystem.readAsStringAsync(filePath);
        const config = JSON.parse(jsonString);
        return config[key] || null; // 返回指定键的值，如果不存在则返回 null
    } catch (error) {
        console.error('读取配置文件时出错:', error);
        return null; // 返回 null 以处理错误情况
    }
};
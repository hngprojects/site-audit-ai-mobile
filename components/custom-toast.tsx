import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface ToastProps {
    type: 'success' | 'error' | 'warning';
    text1?: string;
    text2?: string;
}

const CustomToast = ({ type, text1, text2 }: ToastProps) => {
    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return {
                    borderColor: '#4CAF50',
                    backgroundColor: '#F1F8F4',
                    iconColor: '#4CAF50',
                    iconName: 'check-circle' as const,
                };
            case 'error':
                return {
                    borderColor: '#F44336',
                    backgroundColor: '#FFEBEE',
                    iconColor: '#F44336',
                    iconName: 'alert-triangle' as const,
                };
            case 'warning':
                return {
                    borderColor: '#FF9800',
                    backgroundColor: '#FFF3E0',
                    iconColor: '#FF9800',
                    iconName: 'alert-circle' as const,
                };
            default:
                return {
                    borderColor: '#4CAF50',
                    backgroundColor: '#F1F8F4',
                    iconColor: '#4CAF50',
                    iconName: 'check-circle' as const,
                };
        }
    };

    const config = getToastConfig();

    return (
        <View
            style={{
                height: 60,
                width: '90%',
                backgroundColor: config.backgroundColor,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: config.borderColor,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
            }}
        >
            <Feather name={config.iconName} size={24} color={config.iconColor} />
            <View style={{ marginLeft: 12, flex: 1 }}>
                {text1 && (
                    <Text
                        style={{
                            fontSize: 14,
                            fontFamily: 'RethinkSans-SemiBold',
                            color: '#1c1c1c',
                            marginBottom: text2 ? 2 : 0,
                        }}
                    >
                        {text1}
                    </Text>
                )}
                {text2 && (
                    <Text
                        style={{
                            fontSize: 13,
                            fontFamily: 'RethinkSans-Regular',
                            color: '#6B7280',
                        }}
                    >
                        {text2}
                    </Text>
                )}
            </View>
        </View>
    );
};

const toastConfig = {
    success: ({ text1, text2 }: { text1?: string; text2?: string }) => (
        <CustomToast type="success" text1={text1} text2={text2} />
    ),
    error: ({ text1, text2 }: { text1?: string; text2?: string }) => (
        <CustomToast type="error" text1={text1} text2={text2} />
    ),
    warning: ({ text1, text2 }: { text1?: string; text2?: string }) => (
        <CustomToast type="warning" text1={text1} text2={text2} />
    ),
};

export { toastConfig };


import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface ToastType {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface BeautifulToastProps {
  toast: ToastType;
  onHide: () => void;
}

const { width, height } = Dimensions.get('window');

const BeautifulToast: React.FC<BeautifulToastProps> = ({ toast, onHide }) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const getToastConfig = (type: ToastType['type']) => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10B981',
          icon: 'check-circle',
          iconColor: '#fff',
        };
      case 'error':
        return {
          backgroundColor: '#EF4444',
          icon: 'x-circle',
          iconColor: '#fff',
        };
      case 'warning':
        return {
          backgroundColor: '#F59E0B',
          icon: 'alert-triangle',
          iconColor: '#fff',
        };
      case 'info':
        return {
          backgroundColor: '#3B82F6',
          icon: 'info',
          iconColor: '#fff',
        };
      default:
        return {
          backgroundColor: '#6B7280',
          icon: 'info',
          iconColor: '#fff',
        };
    }
  };

  const config = getToastConfig(toast.type);

  useEffect(() => {
    // Slide up animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide after duration
    const timer = setTimeout(() => {
      hideToast();
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, []);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          backgroundColor: config.backgroundColor,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.toastContent}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Feather name={config.icon as any} size={24} color={config.iconColor} />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{toast.title}</Text>
          {toast.message && (
            <Text style={styles.message}>{toast.message}</Text>
          )}
        </View>

        {/* Close Button */}
        <View style={styles.closeContainer}>
          <Feather name="x" size={20} color="#fff" onPress={hideToast} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  closeContainer: {
    marginLeft: 12,
    padding: 4,
  },
});

export default BeautifulToast;

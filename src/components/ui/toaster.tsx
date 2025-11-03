import React from 'react';
import { Box, Text, VStack, HStack, IconButton } from '@chakra-ui/react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  id?: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ title, description, type, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color="#10B981" />;
      case 'error':
        return <AlertCircle size={20} color="#EF4444" />;
      case 'warning':
        return <AlertCircle size={20} color="#F59E0B" />;
      case 'info':
        return <Info size={20} color="#3B82F6" />;
      default:
        return <Info size={20} color="#6B7280" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'green.50';
      case 'error':
        return 'red.50';
      case 'warning':
        return 'yellow.50';
      case 'info':
        return 'blue.50';
      default:
        return 'gray.50';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'green.200';
      case 'error':
        return 'red.200';
      case 'warning':
        return 'yellow.200';
      case 'info':
        return 'blue.200';
      default:
        return 'gray.200';
    }
  };

  return (
    <Box
      bg={getBgColor()}
      border="1px solid"
      borderColor={getBorderColor()}
      borderRadius="lg"
      p={4}
      shadow="md"
      minW="300px"
      maxW="500px"
    >
      <HStack gap={3} align="start">
        {getIcon()}
        <VStack align="start" gap={1} flex="1">
          <Text fontWeight="600" color="gray.900" fontSize="sm">
            {title}
          </Text>
          {description && (
            <Text fontSize="sm" color="gray.700">
              {description}
            </Text>
          )}
        </VStack>
        {onClose && (
          <IconButton
            aria-label="Close toast"
            size="sm"
            variant="ghost"
            onClick={onClose}
            borderRadius="full"
          >
            <X size={16} />
          </IconButton>
        )}
      </HStack>
    </Box>
  );
};

class Toaster {
  private toasts: ToastProps[] = [];
  private listeners: ((toasts: ToastProps[]) => void)[] = [];

  create(toast: ToastProps) {
    const id = Date.now().toString();
    const toastWithId = { ...toast, id };
    this.toasts.push(toastWithId);
    this.notify();

    
    setTimeout(() => {
      this.remove(id);
    }, 5000);
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  subscribe(listener: (toasts: ToastProps[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.toasts));
  }
}

export const toaster = new Toaster();

interface ToasterContainerProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
}

export const ToasterContainer: React.FC<ToasterContainerProps> = ({ toasts, onRemove }) => {
  return (
    <VStack
      position="fixed"
      top={4}
      right={4}
      zIndex={9999}
      gap={3}
      align="end"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          type={toast.type}
          onClose={() => onRemove(toast.id!)}
        />
      ))}
    </VStack>
  );
};
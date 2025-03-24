import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';

interface BackButtonProps {
  color?: string;
  size?: number;
}

export const BackButton: React.FC<BackButtonProps> = ({ color = 'black', size = 24 }) => {
    const navigation = useNavigation();

    return (
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
        <Ionicons name="arrow-back" size={size} color={color} />
      </TouchableOpacity>
    );
    
};

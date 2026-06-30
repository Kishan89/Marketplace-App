import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { Loader } from '../../shared/components/Loader';

export const RootNavigator: React.FC = () => {
  const { token } = useAppSelector(state => state.auth);
  const isAuthenticated = !!token;

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

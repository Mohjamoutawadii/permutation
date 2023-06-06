import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Statistics from './Acceuil';
import Login from './Inscription';
import AboutUs from './AboutPage';
import AuthenticationPage from './Connexion';
import Profil from './Profil';
import Rechercher from './Recherche';
import Combinaison from './Combinaison';

const Tab = createMaterialTopTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}
          tabBarPosition="top"
          style={styles.tabNavigator}
        >
          <Tab.Screen name="Accueil" component={Statistics} />

          {isLoggedIn ? (
            <>
              <Tab.Screen name="Profil" component={Profil} />
              <Tab.Screen name="Rechercher" component={Rechercher} />
              <Tab.Screen name="Combinaison" component={Combinaison} />
            </>
          ) : (
            <>
              <Tab.Screen name="Inscription" component={Login} />
              <Tab.Screen
                name="Connexion"
                options={{
                  tabBarLabel: 'Connexion',
                }}
              >
                {() => (
                  <AuthenticationPage onLogin={() => setIsLoggedIn(true)} />
                )}
              </Tab.Screen>
            </>
          )}

          <Tab.Screen name="A propos de nous" component={AboutUs} />
        </Tab.Navigator>

        <View style={styles.footer}>
          <Text style={styles.footerText}>&copy; 2023. Tous droits réservés. Développé par Pr. Mohamed LACHGAR</Text>
          <Text style={styles.footerText}>+212 708 193 797 - lachgar.m@ucd.ac.ma</Text>
        </View>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabNavigator: {
    flex: 1,
  },
  footer: {
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
});

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, Text } from 'react-native';
import axios from 'axios';

const Connexion = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleEmailChange = (value) => {
        setEmail(value);
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.get('https://tiny-worm-nightgown.cyclic.app/professeurs');

            const users = response.data;

            const user = users.find((user) => user.email === email);

            if (user) {
                setAuthenticated(true);
                onLogin();
                console.log('Authentication successful');
            } else {
                setAuthenticated(false);
                console.log('Authentication failed');
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error occurred during authentication:', error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Adresse Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={handleEmailChange}
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry
                placeholderTextColor="#888"
                value={password}
                onChangeText={handlePasswordChange}
            />
            <Button title="Se connecter" onPress={handleLogin} />
            {authenticated && <Text style={styles.successText}>Authentification réussie</Text>}
            <Modal visible={showModal} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Authentification échouée. Veuillez réessayer.</Text>
                        <Button title="Fermer" onPress={handleModalClose} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 2,
        marginBottom: 20,
        paddingHorizontal: 20,
        fontSize: 16,
        borderRadius: 25,
        backgroundColor: 'white',
        color: '#333',
    },
    successText: {
        color: 'green',
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
});

export default Connexion;

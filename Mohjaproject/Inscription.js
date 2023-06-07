import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const Inscription = () => {
    const [formValues, setFormValues] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        password: '',
        grade: '',
        etablissement: '',
        specialite: '',
        villeActuelle: '',
        villesDesirees: '',
    });
    const [professeurs, setProfesseurs] = useState([]);
    const [grades, setGrades] = useState([]);
    const [specialites, setSpecialites] = useState([]);
    const [villes, setVilles] = useState([]);

    const handleChange = (name, value) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    useEffect(() => {
        axios
            .get('https://tiny-worm-nightgown.cyclic.app/professeurs')
            .then((response) => {
                setProfesseurs(response.data);
                const uniqueGrades = [...new Set(response.data.map((prof) => prof.grade))];
                const uniqueSpecialites = [...new Set(response.data.map((prof) => prof.specialite))];
                const uniqueVilles = [...new Set(response.data.map((prof) => prof.villeFaculteActuelle))];
                setGrades(uniqueGrades);
                setSpecialites(uniqueSpecialites);
                setVilles(uniqueVilles);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des données des professeurs:', error);
            });
    }, []);

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        // Handle form submission logic here
        console.log(formValues);
    };

    const validateForm = () => {
        const {
            nom,
            prenom,
            telephone,
            email,
            password,
            grade,
            etablissement,
            specialite,
            villeActuelle,
            villesDesirees,
        } = formValues;

        if (
            !nom ||
            !prenom ||
            !telephone ||
            !email ||
            !password ||
            !grade ||
            !etablissement ||
            !specialite ||
            !villeActuelle ||
            !villesDesirees
        ) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return false;
        }

        return true;
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Icon name="user" size={20} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nom"
                        value={formValues.nom}
                        onChangeText={(value) => handleChange('nom', value)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="user" size={20} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Prénom"
                        value={formValues.prenom}
                        onChangeText={(value) => handleChange('prenom', value)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="phone" size={20} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Téléphone"
                        value={formValues.telephone}
                        onChangeText={(value) => handleChange('telephone', value)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="envelope" size={20} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={formValues.email}
                        onChangeText={(value) => handleChange('email', value)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        secureTextEntry
                        value={formValues.password}
                        onChangeText={(value) => handleChange('password', value)}
                    />
                </View>
                <Text style={styles.label}>Grade:</Text>
                <Picker
                    style={styles.select}
                    selectedValue={formValues.grade}
                    onValueChange={(value) => handleChange('grade', value)}
                    mode="dropdown"
                >
                    <Picker.Item label="Sélectionner le grade" value="" />
                    {grades.map((grade) => (
                        <Picker.Item key={grade} label={grade} value={grade} />
                    ))}
                </Picker>
                <TextInput
                    style={styles.input}
                    placeholder="Etablissement (abréviation)"
                    value={formValues.etablissement}
                    onChangeText={(value) => handleChange('etablissement', value)}
                />

                <Text style={styles.label}>Spécialité:</Text>
                <Picker
                    style={styles.select}
                    selectedValue={formValues.specialite}
                    onValueChange={(value) => handleChange('specialite', value)}
                    mode="dropdown"
                >
                    <Picker.Item label="Sélectionner une spécialité" value="" />
                    {specialites.map((specialite) => (
                        <Picker.Item key={specialite} label={specialite} value={specialite} />
                    ))}
                </Picker>

                <Text style={styles.label}>Ville Actuelle:</Text>
                <Picker
                    style={styles.select}
                    selectedValue={formValues.villeActuelle}
                    onValueChange={(value) => handleChange('villeActuelle', value)}
                    mode="dropdown"
                >
                    <Picker.Item label="Sélectionner une ville" value="" />
                    {villes.map((ville) => (
                        <Picker.Item key={ville} label={ville} value={ville} />
                    ))}
                </Picker>


                <Text style={styles.label}>Villes Désirées:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="choisir une ou plusieurs villes et separer les par point virgule"
                    value={formValues.villesDesirees}
                    onChangeText={(value) => handleChange('villesDesirees', value)}
                />

                <View style={styles.container}>
                    <Button title="Valider" onPress={handleSubmit} />
                </View>


            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        marginTop: 20,
    },
    inputContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 40,
    },
    icon: {
        position: 'absolute',
        left: 10,
        top: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    select: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
});

export default Inscription;

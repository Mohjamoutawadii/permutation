import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

const Profil = () => {
    const [professeur, setProfesseur] = useState(null);
    const [professeurs, setProfesseurs] = useState([]);
    const [grades, setGrades] = useState([]);
    const [villes, setVilles] = useState([]);
    const [specialites, setSpecialites] = useState([]);
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

    useEffect(() => {
        axios
            .get('https://tiny-worm-nightgown.cyclic.app/professeurs')
            .then(response => {
                const professeurLachgar = response.data.find(prof => prof.nom === 'LACHGAR');
                setProfesseur(professeurLachgar);
                setFormValues({
                    nom: professeurLachgar.nom,
                    prenom: professeurLachgar.prenom,
                    telephone: professeurLachgar.tel,
                    email: professeurLachgar.email,
                    grade: professeurLachgar.grade,
                    etablissement: professeurLachgar.faculteActuelle,
                    specialite: professeurLachgar.specialite,
                    villeActuelle: professeurLachgar.villeFaculteActuelle,
                    villesDesirees: professeurLachgar.villesDesirees,
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données du professeur:', error);
            });
    }, []);

    useEffect(() => {
        axios
            .get('https://tiny-worm-nightgown.cyclic.app/professeurs')
            .then(response => {
                const uniqueGrades = [...new Set(response.data.map(prof => prof.grade))];
                const uniqueVilles = [...new Set(response.data.map(prof => prof.villeFaculteActuelle))];
                const uniqueSpecialites = [...new Set(response.data.map(prof => prof.specialite))];
                setProfesseurs(response.data);
                setGrades(uniqueGrades);
                setVilles(uniqueVilles);
                setSpecialites(uniqueSpecialites);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données des professeurs:', error);
            });
    }, []);

    const handleChange = (field, value) => {
        setFormValues(prevValues => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const handleSave = () => {
        // Implement save logic here
        console.log('Form values:', formValues);
    };

    const handleDeleteAccount = () => {
        // Implement delete account logic here
        console.log('Delete account');
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                {professeur ? (
                    <>
                        <Text style={styles.title}>Profil</Text>
                        <Text style={styles.label}>Nom:</Text>
                        <TextInput
                            style={styles.input}
                            value={formValues.nom}
                            onChangeText={value => handleChange('nom', value)}
                        />

                        <Text style={styles.label}>Prénom:</Text>
                        <TextInput
                            style={styles.input}
                            value={formValues.prenom}
                            onChangeText={value => handleChange('prenom', value)}
                        />

                        <Text style={styles.label}>Téléphone:</Text>
                        <TextInput
                            style={styles.input}
                            value={formValues.telephone}
                            onChangeText={value => handleChange('telephone', value)}
                        />

                        <Text style={styles.label}>Email:</Text>
                        <TextInput
                            style={styles.input}
                            value={formValues.email}
                            onChangeText={value => handleChange('email', value)}
                        />

                        <Text style={styles.label}>Grade:</Text>
                        <Picker
                            style={styles.select}
                            selectedValue={formValues.grade}
                            onValueChange={value => handleChange('grade', value)}
                            mode="dropdown"
                        >
                            <Picker.Item label="Sélectionner le grade" value="" />
                            {grades.map(grade => (
                                <Picker.Item key={grade} label={grade} value={grade} />
                            ))}
                        </Picker>

                        <TextInput
                            style={styles.input}
                            placeholder="Etablissement (abréviation)"
                            value={formValues.etablissement}
                            onChangeText={value => handleChange('etablissement', value)}
                        />

                        <Text style={styles.label}>Spécialité:</Text>
                        <Picker
                            style={styles.select}
                            selectedValue={formValues.specialite}
                            onValueChange={value => handleChange('specialite', value)}
                            mode="dropdown"
                        >
                            <Picker.Item label="Sélectionner une spécialité" value="" />
                            {specialites.map(specialite => (
                                <Picker.Item key={specialite} label={specialite} value={specialite} />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Ville Actuelle:</Text>
                        <Picker
                            style={styles.select}
                            selectedValue={formValues.villeActuelle}
                            onValueChange={value => handleChange('villeActuelle', value)}
                            mode="dropdown"
                        >
                            <Picker.Item label="Sélectionner une ville" value="" />
                            {villes.map(ville => (
                                <Picker.Item key={ville} label={ville} value={ville} />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Villes Désirées:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Séparer les villes par un point virgule"
                            value={formValues.villesDesirees}
                            onChangeText={value => handleChange('villesDesirees', value)}
                        />

                        <View style={styles.buttonContainer}>
                            <Button title="Enregistrer" onPress={handleSave} />
                            <Button title="Supprimer le compte" onPress={handleDeleteAccount} color="red" />
                        </View>
                    </>
                ) : (
                    <Text>Chargement...</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginTop: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    select: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 10,
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
    },
});

export default Profil;


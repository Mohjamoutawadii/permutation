import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
    Button,
    Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Recherche = () => {
    const [professeurs, setProfesseurs] = useState([]);
    const [originalProfesseurs, setOriginalProfesseurs] = useState([]);
    const [selectedprof, setSelectedprof] = useState('');
    const [specialite, setSpecialite] = useState('');
    const [villeActuelle, setVilleActuelle] = useState('');
    const [villeDesiree, setVilleDesiree] = useState('');

    const baseURL = 'https://troubled-red-garb.cyclic.app/professeurs';

    useEffect(() => {
        axios
            .get(baseURL)
            .then(response => {
                setProfesseurs(response.data);
                setOriginalProfesseurs(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données des professeurs:', error);
            });
    }, []);

    const handleSpecialiteChange = value => {
        setSpecialite(value);
    };

    const handleSubmit = () => {
        let filteredProfesseurs = originalProfesseurs;

        if (specialite !== '') {
            filteredProfesseurs = originalProfesseurs.filter(prof =>
                prof.specialite.toLowerCase().includes(specialite.toLowerCase())
            );
        }

        if (villeActuelle !== '') {
            filteredProfesseurs = filteredProfesseurs.filter(
                prof => prof.villeFaculteActuelle === villeActuelle
            );
        }

        if (villeDesiree !== '') {
            filteredProfesseurs = filteredProfesseurs.filter(prof => prof.villeDesiree === villeDesiree);
        }

        setProfesseurs(filteredProfesseurs);
    };

    const handleReset = () => {
        setProfesseurs(originalProfesseurs);
        setSelectedprof('');
        setSpecialite('');
        setVilleActuelle('');
        setVilleDesiree('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recherche de Professeurs</Text>
            <Text style={styles.label}>Spécialité</Text>
            <Picker
                style={styles.select}
                selectedValue={specialite}
                onValueChange={handleSpecialiteChange}
                mode="dropdown"
            >
                <Picker.Item label="Sélectionner une spécialité" value="" />
                {Array.from(new Set(originalProfesseurs.map(prof => prof.specialite))).map(specialite => (
                    <Picker.Item key={specialite} label={specialite} value={specialite} />
                ))}
            </Picker>

            <Text style={styles.label}>Ville Actuelle</Text>
            <Picker
                style={styles.select}
                selectedValue={villeActuelle}
                onValueChange={value => setVilleActuelle(value)}
                mode="dropdown"
            >
                <Picker.Item label="Sélectionner votre Ville Actuelle" value="" />
                {Array.from(new Set(originalProfesseurs.map(prof => prof.villeFaculteActuelle))).map(
                    ville => (
                        <Picker.Item key={ville} label={ville} value={ville} />
                    )
                )}
            </Picker>

            <Text style={styles.label}>Ville Désirée</Text>
            <Picker
                style={styles.select}
                selectedValue={villeDesiree}
                onValueChange={value => setVilleDesiree(value)}
                mode="dropdown"
            >
                <Picker.Item label="Sélectionner votre Ville Désirée" value="" />
                {Array.from(new Set(originalProfesseurs.map(prof => prof.villeDesiree))).map(ville => (
                    <Picker.Item key={ville} label={ville} value={ville} />
                ))}
            </Picker>

            <View style={styles.buttonContainer}>
                <Button title="Rechercher" onPress={handleSubmit} />
                <Button title="Réinitialiser" onPress={handleReset} />
            </View>

            <ScrollView style={styles.results}>
                {professeurs.map(prof => (
                    <TouchableOpacity key={prof._id} style={styles.profCard}>
                        <Text style={styles.profName}>{`${prof.nom} (${prof.email} | ${prof.tel
                            } | ${prof.grade}) - ${prof.specialite} - (${prof.faculteActuelle} | ${prof.villeFaculteActuelle
                            }) ---> ${prof.villeDesiree}`}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
        color: '#333', // Couleur du texte sélectionné
    },
    results: {
        marginTop: 20,
    },
    profCard: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    profName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    profSpecialite: {
        fontSize: 14,
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
});

export default Recherche;

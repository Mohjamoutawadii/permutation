import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';


const Combinaison = () => {
    const [professeurs, setProfesseurs] = useState([]);
    const [specialites, setSpecialites] = useState([]);
    const [selectedSpecialite, setSelectedSpecialite] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [combinations, setCombinations] = useState([]);

    const baseURL = 'https://troubled-red-garb.cyclic.app';

    useEffect(() => {
        axios
            .get(`${baseURL}/professeurs`)
            .then(response => {
                setProfesseurs(response.data);
                setSpecialites(getUniqueSpecialites(response.data));
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données des professeurs:', error);
            });
    }, []);

    const getUniqueSpecialites = (data) => {
        const uniqueSpecialites = new Set();
        data.forEach(prof => uniqueSpecialites.add(prof.specialite));
        return Array.from(uniqueSpecialites);
    };

    const handleSubmit = () => {
        const filteredProfesseurs = professeurs.filter(prof => prof.specialite === selectedSpecialite);
        const generatedCombinations = generateCombinations(filteredProfesseurs);
        setCombinations(generatedCombinations);
        setShowResults(true);
    };

    const generateCombinations = (arr) => {
        const combinations = [];
        const len = arr.length;

        for (let i = 0; i < len - 1; i++) {
            for (let j = i + 1; j < len; j++) {
                const citiesDesiredByFirstProfessor = arr[i].villeDesiree.split(';');
                const citiesDesiredBySecondProfessor = arr[j].villeDesiree.split(';');

                const matchFound =
                    citiesDesiredByFirstProfessor.includes(arr[j].villeFaculteActuelle) &&
                    citiesDesiredBySecondProfessor.includes(arr[i].villeFaculteActuelle);

                if (matchFound) {
                    const combination = `${arr[i].nom} (${arr[i].villeFaculteActuelle}) (${arr[i].grade}) -> ${arr[j].nom} (${arr[j].villeFaculteActuelle}) (${arr[j].grade})`;
                    combinations.push(combination);
                }
            }
        }

        return combinations;
    };

    const handleReset = () => {
        setSelectedSpecialite('');
        setShowResults(false);
        setCombinations([]);
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Recherche de Combinaisons possibles
                </Text>

                <Text style={styles.label}>Spécialité</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={selectedSpecialite}
                    onValueChange={(itemValue) => setSelectedSpecialite(itemValue)}
                >
                    <Picker.Item label="Sélectionnez une spécialité" value="" />
                    {specialites.map((specialite, index) => (
                        <Picker.Item key={index} label={specialite} value={specialite} />
                    ))}
                </Picker>

                <View style={styles.buttonContainer}>
                    <Button title="Rechercher" onPress={handleSubmit} />
                    <Button title="Réinitialiser" onPress={handleReset} />
                </View>

                {showResults && combinations.length > 0 && (
                    <ScrollView style={styles.results}>
                        {combinations.map((combination, index) => (
                            <Text key={index} style={styles.combinationText}>
                                {combination}
                            </Text>
                        ))}
                    </ScrollView>
                )}

                {showResults && combinations.length === 0 && (
                    <Text style={styles.noResults}>Aucune combinaison possible pour cette spécialité</Text>
                )}
            </View>
        </ScrollView>
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
    picker: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    results: {
        marginTop: 20,
    },
    combinationText: {
        fontSize: 16,
        marginBottom: 10,
    },
    noResults: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Combinaison;

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const Acceuil = () => {
    const [statistics, setStatistics] = useState(null);
    const [professorsCount, setProfessorsCount] = useState(null);
    const [cityData, setCityData] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://tiny-worm-nightgown.cyclic.app/professeurs');
            const data = await response.json();
            setStatistics(data);
            setProfessorsCount(data.length);

            const cities = {};
            data.forEach((professor) => {
                if (cities[professor.villeDesiree]) {
                    cities[professor.villeDesiree] += 1;
                } else {
                    cities[professor.villeDesiree] = 1;
                }
            });
            setCityData(cities);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    if (!statistics || !cityData) {
        return <Text>Loading...</Text>;
    }

    const getColorByIndex = (index) => {
        const colors = [
            '#FF6E6E',
            '#FF976E',
            '#FFC46E',
            '#FFEE6E',
            '#EEFF6E',
            '#C4FF6E',
            '#96FF6E',
            '#6EFF6E',
            '#6EFF9B',
            '#6EFFC4',
            '#6EFFEE',
            '#6EEFFF',
            '#6EC4FF',
            '#6E96FF',
            '#6E6EFF',
        ];

        return colors[index % colors.length];
    };

    const renderGradeStatistics = () => {
        const grades = {};
        statistics.forEach((professor) => {
            if (grades[professor.grade]) {
                grades[professor.grade] += 1;
            } else {
                grades[professor.grade] = 1;
            }
        });

        const gradeData = Object.keys(grades).map((grade) => {
            const percentage = (grades[grade] / statistics.length) * 100;
            return {
                name: `${grade} (${percentage.toFixed(2)}%)`,
                population: grades[grade],
                color: getColorByIndex(grades[grade]),
                legendFontColor: 'black',
                legendFontSize: 12,
            };
        });

        return (
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Professeurs Par Grade</Text>
                <PieChart
                    data={gradeData}
                    width={Dimensions.get('window').width - 40}
                    height={200}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(255, 110, 110, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
            </View>
        );
    };

    const renderCityStatistics = () => {
        const sortedCities = Object.entries(cityData).sort((a, b) => b[1] - a[1]);
        const top10Cities = sortedCities.slice(0, 10);

        const cityChartData = top10Cities.map(([city, count], index) => {
            return {
                name: `${city} (${count})`,
                population: count,
                color: getColorByIndex(index),
                legendFontColor: 'black',
                legendFontSize: 12,
            };
        });

        return (
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Les Villes les plus demandees (Top 10)</Text>
                <PieChart
                    data={cityChartData}
                    width={Dimensions.get('window').width - 40}
                    height={200}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(255, 110, 110, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
            </View>
        );
    };
    const renderSpecialityStatistics = () => {
        const specialities = {};
        statistics.forEach((professor) => {
            if (specialities[professor.specialite]) {
                specialities[professor.specialite] += 1;
            } else {
                specialities[professor.specialite] = 1;
            }
        });

        // Sort specialities by population in descending order
        const sortedSpecialities = Object.entries(specialities).sort((a, b) => b[1] - a[1]);

        // Get the top 10 specialities
        const top10Specialities = sortedSpecialities.slice(0, 10);

        const specialityData = top10Specialities.map(([speciality, population]) => {
            const percentage = (population / statistics.length) * 100;
            return {
                name: `${speciality} (${percentage.toFixed(2)}%)`,
                population: population,
                color: getColorByIndex(population),
                legendFontColor: 'black',
                legendFontSize: 12,
            };
        });


        return (
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Professeurs par specialite</Text>
                <PieChart
                    data={specialityData}
                    width={385}
                    height={200}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
            </View>
        );
    };

    return (
        <View style={styles.frame}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Statistiques Générales</Text>
                <Text style={styles.text}>Nombre de professeurs: {professorsCount}</Text>
                {renderGradeStatistics()}
                {renderCityStatistics()}
                {renderSpecialityStatistics()}

            </ScrollView>
        </View>
    );

};

const styles = StyleSheet.create({
    frame: {
        flex: 1,
        margin: 10,
        padding: 10,
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
    text: {
        color: 'black',
    },
    chartContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
});

export default Acceuil;

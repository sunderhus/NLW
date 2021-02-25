import React, { useCallback, useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { Feather as Icon } from '@expo/vector-icons'
import { Container, Main, Logo, Title, Description, Footer, Select, FooterButton, FooterButtonIcon, FooterButtonText } from './styles'
import axios from 'axios';
interface IBGEUFResponse {
    sigla: string;
    nome: string;
}
interface IBGECityResponse {
    nome: string;
}

export const Home: React.FC = () => {
    const navigation = useNavigation();
    const [ufs, setUfs] = useState<IBGEUFResponse[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUF, setSelectedUf] = useState<string>('0');
    const [selectedCity, setSelectedCity] = useState<string>('');

    const handleNavigateToPoints = useCallback(() => {
        navigation.navigate('Points', {
            uf: selectedUF,
            city: selectedCity,
        });
    }, [selectedUF, selectedCity])

    useEffect(() => {
        const loadLocations = async () => {
            const response = await axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados', {
                params: {
                    'OrderBy': 'Nome'
                }
            });

            const ufInitials = response.data.map(uf => ({
                sigla: uf.sigla,
                nome: uf.nome
            }));

            setUfs(ufInitials);

        }
        loadLocations();
    }, [])

    useEffect(() => {
        const loadCities = async () => {
            if (selectedUF !== '0') {
                const response = await axios
                    .get<IBGECityResponse[]>
                    (`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`);

                const cityNames = response.data.map(city => city.nome);

                setCities(cityNames)
                setSelectedCity(cityNames[0])
            }
        }
        loadCities();
    }, [selectedUF])


    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Container
                source={require('../../assets/home-background.png')}
                imageStyle={{ width: 274, height: 318 }}
            >
                <Main>
                    <Logo source={require('../../assets/logo.png')} />
                    <View>
                        <Title>Seu Marketplace de coleta de resíduos</Title>
                        <Description>
                            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
                        </Description>
                    </View>
                </Main>

                <Footer>
                    <Select
                        selectedValue={selectedUF}
                        onValueChange={(itemValue) => setSelectedUf(itemValue)}>
                        {ufs.map(({ nome, sigla }) => (
                            <Select.Item key={sigla} label={`${nome} - ${sigla}`} value={sigla} />
                        ))}
                    </Select>
                    <Select
                        selectedValue={selectedCity}
                        onValueChange={(itemValue) => setSelectedCity(itemValue)}>
                        {cities.map(city => (
                            <Select.Item key={city} label={city} value={city} />
                        ))}
                    </Select>
                    <FooterButton onPress={handleNavigateToPoints}>
                        <FooterButtonText>Entrar</FooterButtonText>
                        <FooterButtonIcon>
                            <Icon name="arrow-right" color="#fff" size={24} />
                        </FooterButtonIcon>

                    </FooterButton>
                </Footer>
            </Container>
        </KeyboardAvoidingView>
    )
}


export default Home;
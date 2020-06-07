import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { Feather as Icon } from '@expo/vector-icons'
import { Container, Main, Logo, Title, Description, Footer, Input, FooterButton, FooterButtonIcon, FooterButtonText } from './styles'


export const Home: React.FC = () => {
    const navigation = useNavigation();
    const [uf, setUf] = useState('');
    const [city, setCity] = useState('');

    const handleNavigateToPoints = useCallback(() => {
        navigation.navigate('Points', {
            city,
            uf
        });
    }, [])

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
                    <Input
                        autoCapitalize="characters"
                        autoCorrect={false}
                        style={{ marginTop: 100 }}
                        placeholder="Digite a UF"
                        maxLength={2}
                        value={uf}
                        onChangeText={text => setUf(text)}

                    />
                    <Input
                        placeholder="Digite a cidade"
                        value={city}
                        autoCorrect={false}
                        autoCapitalize="words"
                        onChangeText={text => setCity(text)}
                    />

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
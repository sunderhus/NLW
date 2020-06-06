import React from 'react';
import { Image } from 'react-native';
import { Container, Main, Logo, Title, Description, Footer } from './styles'



export const Home: React.FC = () => {
    return (
        <Container
            source={require('../../assets/home-background.png')}
            imageStyle={{ width: 274, height: 318 }}
        >
            <Main>
                <Logo source={require('../../assets/logo.png')} />
                <Title>Seu Marketplace de coleta de resíduos</Title>
                <Description>
                    Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
                </Description>
            </Main>

            <Footer>

            </Footer>
        </Container>

    )
}


export default Home;
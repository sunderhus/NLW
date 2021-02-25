import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Alert, Linking } from 'react-native';
import { AppLoading } from 'expo'
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import * as MailComposer from 'expo-mail-composer';
import Constants from 'expo-constants';
import api from '../../services/api';

import { ContainerGoBack, GoBackText, Container, PointImage, PointItems, PointName, Adress, AddressTitle, AddressContent, Footer, FooterButton, FooterText } from './styles';

interface RouteParams {
    point_id: number
}

interface Data {
    point: {
        id: number;
        image: string;
        image_url: string;
        name: string;
        email: string;
        whatsapp: string;
        city: string;
        uf: string;
    },
    items: {
        title: string;
    }[]
}

const Detail: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [data, setData] = useState<Data>({} as Data);
    const routeParams = route.params as RouteParams

    const handleNavigateBack = useCallback(() => {
        navigation.navigate("Points");
    }, [])




    const handleComposeMail = useCallback(async () => {
        const result = await MailComposer.composeAsync({
            subject: 'Interesse na coleta de resíduos',
            recipients: [String(data.point.email)],
        })

        result.status === "sent" && Alert.alert('♻ Tudo certo!', 'E-mail enviado com sucesso.');

    }, [MailComposer, data])

    const handleWhatsapp = useCallback(async () => {
        const url = `whatsapp://send?phone=${String(data.point.whatsapp)}&text=Gostaria de saber mais sobre a coleta de resíduos.♻ `

        const canOpenUrl = await Linking.canOpenURL(url)

        if (canOpenUrl) {
            Linking.openURL(url)
        } else {
            Alert.alert('♻ Ops...', 'Parece que algo deu errado ao tentar abrir o Whatsapp deste estabelecimento.')
        }

    }, [Linking, Alert, data])


    useEffect(() => {
        api.get(`points/${routeParams.point_id}`).then(response => {
            setData(response.data as Data);
        })
    }, [routeParams, api])



    if (!data.point) {
        return <AppLoading />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container>
                <ContainerGoBack onPress={handleNavigateBack}>
                    <Icon
                        name="arrow-left"
                        size={20}
                        color="#34cb79"
                    />
                    <GoBackText>Voltar</GoBackText>
                </ContainerGoBack>
                <PointImage
                    style={{
                        resizeMode: 'cover'
                    }}
                    source={{ uri: data.point.image_url }}
                />
                <PointName>{data.point.name}</PointName>
                <PointItems>{data.items.map(item => item.title).join(', ')}</PointItems>
                <Adress>
                    <AddressTitle>Endereço</AddressTitle>
                    <AddressContent>{data.point.city}, {data.point.uf}</AddressContent>
                </Adress>

            </Container>
            <Footer style={{
                borderTopWidth: StyleSheet.hairlineWidth,
            }}>
                <FooterButton onPress={handleWhatsapp}>
                    <FontAwesome name="whatsapp" size={20} color="#FFF" />
                    <FooterText>Whatsapp</FooterText>

                </FooterButton>
                <FooterButton onPress={handleComposeMail}>
                    <Icon name="mail" size={20} color="#FFF" />
                    <FooterText>E-mail</FooterText>

                </FooterButton>

            </Footer>
        </SafeAreaView>
    )
}


export default Detail;
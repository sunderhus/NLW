import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { SvgUri } from 'react-native-svg'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Location from 'expo-location'
import api from '../../services/api'

import { ContainerGoBack, GoBackText, Container, Title, Description, MapContainer, MapMarker, MapMarkerContainer, MapMarkerImage, MapMarkerTitle, Map, ItemContainer, Item, ItemTitle, } from './styles';

interface Item {
    id: number;
    title: string;
    image_uri: string;
}
interface Point {
    id: number;
    image: string;
    name: string;
    lat: number;
    lng: number;
}

interface Params {
    uf: string;
    city: string;
}
const Points: React.FC = () => {

    const [points, setPoints] = useState<Point[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const navigation = useNavigation();
    const route = useRoute();
    const routeParams = route.params as Params;

    const handleSelectItem = useCallback((id: number) => {
        if (selectedItems.includes(id)) {
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }

    }, [selectedItems])


    const handleNavigateBack = useCallback(() => {
        navigation.navigate("Home");
    }, [])

    const handleNavigateToDetail = useCallback((id) => {
        navigation.navigate("Detail", { point_id: id });
    }, [])


    useEffect(() => {
        api.get('points', {
            params: {
                city: routeParams.city,
                uf: routeParams.uf,
                items: selectedItems
            }
        }).then(response => {
            setPoints(response.data)
        })
    }, [selectedItems])

    useEffect(() => {
        const loadPosition = async () => {
            const { status } = await Location.requestPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Opss...', 'Prescisamos da sua permissão para obter a localização.');
                return;
            }

            const location = await Location.getCurrentPositionAsync();
            const { latitude, longitude } = location.coords;

            setInitialPosition([latitude, longitude]);

        }

        loadPosition();

    }, [])


    useEffect(() => {
        const getItems = async () => {
            const response = await api.get<Item[]>('items');
            setItems(response.data);
        }
        getItems();


    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container style={{ paddingTop: 20 }} >
                <ContainerGoBack onPress={handleNavigateBack}>
                    <Icon
                        name="arrow-left"
                        size={20}
                        color="#34cb79"
                    />
                    <GoBackText>Voltar</GoBackText>
                </ContainerGoBack>

                <Title>Bem-vindo.</Title>
                <Description>Encontre no mapa um ponto de coleta.</Description>

                <MapContainer>
                    {initialPosition[0] !== 0 && (
                        <Map
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                latitudeDelta: 0.014,
                                longitudeDelta: 0.014,
                            }} >
                            {points.map(point => (
                                <MapMarker key={String(point.id)}
                                    onPress={() => handleNavigateToDetail(point.id)}
                                    coordinate={{
                                        latitude: point.lat,
                                        longitude: point.lng,
                                    }}
                                >
                                    <MapMarkerContainer>
                                        <MapMarkerImage
                                            style={{
                                                resizeMode: 'cover'
                                            }}
                                            source={{ uri: point.image }} />
                                        <MapMarkerTitle>{point.name}</MapMarkerTitle>
                                    </MapMarkerContainer>
                                </MapMarker>
                            ))}

                        </Map>
                    )}
                </MapContainer>
            </Container>
            <ItemContainer>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 20
                    }}>

                    {items.map(({ id, image_uri, title }) => (
                        <Item
                            key={String(id)}
                            onPress={() => handleSelectItem(id)}
                            activeOpacity={0.6}
                            isSelected={selectedItems.includes(id)}
                        >
                            <SvgUri width={42} height={42} uri={image_uri} />
                            <ItemTitle>
                                {title}
                            </ItemTitle>
                        </Item>
                    ))}


                </ScrollView>
            </ItemContainer>
        </SafeAreaView>

    )
}


export default Points;
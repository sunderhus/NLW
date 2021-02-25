import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import React, {
  ChangeEvent,
  FormEvent, useCallback, useEffect,
  useState
} from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import Dropzone from '../../components/Dropzone';
import api from '../../services/api';
import { Container, ItemsGrid } from './styles';




interface ItemsProps {
  id: number;
  image_uri: string;
  title: string;
}

interface IBGEUFResponse {
  sigla: string;
}
interface IBGECityResponse {
  nome: string;
}
interface FormProps {
  name: string;
  email: string;
  whatsapp: string;
}

const CreatePoint: React.FC = () => {
  const [formData, setFormData] = useState<FormProps>({
    name: '',
    email: '',
    whatsapp: '',
  });
  const [items, setItems] = useState<ItemsProps[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  const handleSelectItem = useCallback((id: number) => {
    if (selectedItems.includes(id)) {
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }

  }, [selectedItems])

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      setFormData({ ...formData, [name]: value });
    },
    [formData]
  );

  const handleSelectUf = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const uf = event.target.value;
      setSelectedUf(uf);
    },
    []
  );

  const handleSelectedCity = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const city = event.target.value;
      setSelectedCity(city);
    },
    []
  );

  const handleMapClick = useCallback((event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;

    setSelectedPosition([lat, lng]);
  }, []);

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [lat, lng] = selectedPosition
    const items = selectedItems

    const data = new FormData();


    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('lat', String(lat));
    data.append('lng', String(lng));
    data.append('items', items.join(','));

    if (selectedFile) {
      data.append('image', selectedFile)
    }

    await api.post('points', data);

    alert('Ponto de coleta criado com sucesso.');

    history.push('/');


  }, [formData, history, selectedCity, selectedItems, selectedPosition, selectedUf, selectedFile])


  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      const response = await api.get('/items');

      setItems(response.data);
    };

    loadItems();
  }, []);

  useEffect(() => {
    const loadLocations = async () => {
      const response = await axios.get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      );

      const  ufs = response.data as IBGEUFResponse[];
      const ufInitials = ufs.map((uf) => uf.sigla);

      setUfs(ufInitials);
    };
    loadLocations();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (selectedUf !== '0') {
        const response = await axios.get<IBGECityResponse[]>(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
        );
          const cities = response.data as IBGECityResponse[];
        const cityNames = cities.map((city)=> city.nome);

        setCities(cityNames);
      }
    };
    loadCities();
  }, [selectedUf]);

  return (
    <Container>
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>

      <form autoComplete="off" onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> Ponto de coleta</h1>
        <Dropzone onFileUploaded={setSelectedFile} />
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="name"
              id="name"
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                onChange={handleInputChange}
                type="email"
                name="email"
                id="email"
              />
            </div>

            <div className="field">
              <label htmlFor="name">Whatsapp</label>
              <input
                onChange={handleInputChange}
                type="text"
                name="whatsapp"
                id="whatsapp"
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectUf}
              >
                <option value="0"> Selecione o UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {' '}
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="cidade">Cidade</label>
              <select
                name="cidade"
                id="cidade"
                value={selectedCity}
                onChange={handleSelectedCity}
              >
                <option value="0"> Selecione a cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ItemsGrid>
            {items.map(({ id, title, image_uri }) => (
              <li
                className={selectedItems.includes(id) ? 'selected' : ''}
                key={id}
                onClick={() => handleSelectItem(id)}
              >
                <img src={image_uri} alt={title} />
                <span>{title}</span>
              </li>
            ))}
          </ItemsGrid>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </Container>
  );
};

export default CreatePoint;

import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';


import logo from '../../assets/logo.svg'

import { Container, ItemsGrid } from './styles'
const CreatePoint: React.FC = () => {
  return (
    <Container>
      <header>
        <img src={logo} alt='Ecoleta' />

        <Link to='/'>
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>

      <form autoComplete="off">
        <h1>Cadastro do <br /> Ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" />
            </div>

            <div className="field">
              <label htmlFor="name">Whatsapp</label>
              <input type="tel" name="whatsapp" id="whatsapp" />
            </div>
          </div>

        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf">
                <option value="0"> Selecione o UF</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="cidade">Cidade</label>
              <select name="cidade" id="cidade">
                <option value="0"> Selecione a cidade</option>
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
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="teste" />
              <span>Óleo de cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="teste" />
              <span>Óleo de cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="teste" />
              <span>Óleo de cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="teste" />
              <span>Óleo de cozinha</span>
            </li>
            <li className="selected">
              <img src="http://localhost:3333/uploads/oleo.svg" alt="teste" />
              <span>Óleo de cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="teste" />
              <span>Óleo de cozinha</span>
            </li>
          </ItemsGrid>
        </fieldset>

        <button type="submit">
          Cadastrar ponto de coleta
        </button>

      </form>
    </Container>
  );

}

export default CreatePoint;

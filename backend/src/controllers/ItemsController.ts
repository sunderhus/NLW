import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {
  async show(request: Request, response: Response) {
    const itemID = request.params['id'];

    const item = await knex('items').where('id', itemID).first();

    if (!item) {
      return response.status(400).json({ message: 'Point not found' });
    }

    const serializedItem = {
      ...item,
      image_uri: `http://192.168.0.18:3333/uploads/${item.image}`,
    };

    return response.json(serializedItem);
  }

  async index(request: Request, response: Response) {
    const items = await knex('items').select('*');
    const serializedItems = items.map(({ id, title, image }) => ({
      id,
      title,
      image_uri: `http://192.168.0.18:3333/uploads/${image}`,
    }));

    return response.json(serializedItems);
  }

  async create(request: Request, response: Response) {
    return response.status(400).json({ message: 'Not implemented.' });
  }
}

export default ItemsController;

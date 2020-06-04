import { Request, Response } from 'express';
import knex from '../database/connection';
interface PointItemsProps {
  item_id: number;
  point_id: number;
}

class PointsController {
  async index(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'Point not found' });
    }
    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({ point, items });
  }

  async list(request: Request, response: Response) {
    const { uf, city, items } = request.query;

    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'point_items.point_id', '=', 'points.id')
      .whereIn('point_items.item_id', parsedItems)
      .where('uf', String(uf))
      .where('city', String(city))
      .distinct()
      .select('points.*');

    if (!points.length) {
      return response.status(400).json({ message: `Points not found` });
    }

    return response.json(points);
  }

  async create(request: Request, response: Response) {
    const { name, email, whatsapp, lat, lng, city, uf, items } = request.body;

    const trx = await knex.transaction();

    const point = {
      image:
        'https://images.unsplash.com/photo-1553546895-531931aa1aa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      lat,
      lng,
      city,
      uf,
    };

    const [pointId] = await trx('points').insert(point);

    const pointItems: PointItemsProps[] = items.map((item: number) => ({
      item_id: item,
      point_id: pointId,
    }));

    await trx('point_items').insert(pointItems);

    trx.commit();

    response.json({
      id: pointId,
      ...point,
    });
  }
}

export default PointsController;

import { Request, Response } from 'express';
import knex from '../database/connection';
interface PointItemsProps {
  item_id: number;
  point_id: number;
}

class PointsController {
  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'Point not found' });
    }
    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.0.18:3333/uploads/${point.image}`,
    };

    return response.json({ point: serializedPoint, items });
  }

  async index(request: Request, response: Response) {
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


      const serializedPoints = points.map((point) => ({
        ...point,
        image_url: `http://192.168.0.18:3333/uploads/${point.image}`,
      }));


    return response.json(serializedPoints);
  }

  async create(request: Request, response: Response) {
    const { name, email, whatsapp, lat, lng, city, uf, items, image} = request.body;

    const trx = await knex.transaction();

    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      lat:Number(lat),
      lng:Number(lng),
      city,
      uf,
    };

    const [pointId] = await trx('points').insert(point);

    const pointItems: PointItemsProps[] = items
    .split(',')
    .map((item:string)=> Number(item.trim()))
    .map((item: number) => ({
      item_id: item,
      point_id: pointId,
    }));

    await trx('point_items').insert(pointItems);

    trx.commit();

    response.json({
      id: pointId,
      ...point
    });
  }
}

export default PointsController;

import { Router } from 'express';
import ItemsController from '../controllers/ItemsController';

const itemsRouter = Router();
const itemsController = new ItemsController();

itemsRouter.get('/:id', itemsController.index);
itemsRouter.get('/', itemsController.list);
itemsRouter.post('/', itemsController.create);

export default itemsRouter;

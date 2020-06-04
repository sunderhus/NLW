import { Router } from 'express';
import PointsController from '../controllers/PointsController';

const pointsRouter = Router();
const pointsController = new PointsController();

pointsRouter.get('/:id', pointsController.index);
pointsRouter.get('/', pointsController.list);
pointsRouter.post('/', pointsController.create);

export default pointsRouter;

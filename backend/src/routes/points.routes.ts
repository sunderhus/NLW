import { Router } from 'express';
import PointsController from '../controllers/PointsController';

const pointsRouter = Router();
const pointsController = new PointsController();

pointsRouter.get('/:id', pointsController.show);
pointsRouter.get('/', pointsController.index);
pointsRouter.post('/', pointsController.create);

export default pointsRouter;

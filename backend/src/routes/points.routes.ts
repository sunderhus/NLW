import { Router } from 'express';
import PointsController from '../controllers/PointsController';
import multer from 'multer';
import multerConfig  from '../config/index'

const pointsRouter = Router();

const upload = multer(multerConfig);

const pointsController = new PointsController();

pointsRouter.get('/:id', pointsController.show);
pointsRouter.get('/', pointsController.index);
pointsRouter.post('/',upload.single('image'), pointsController.create);

export default pointsRouter;

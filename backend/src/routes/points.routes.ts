import { Router } from 'express';
import {celebrate, Joi} from 'celebrate';
import PointsController from '../controllers/PointsController';

import multer from 'multer';

import multerConfig  from '../config/index'

const pointsRouter = Router();

const upload = multer(multerConfig);

const pointsController = new PointsController();

pointsRouter.get('/:id', pointsController.show);
pointsRouter.get('/', pointsController.index);
pointsRouter.post(
  '/',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required(),
      whatsapp: Joi.number().required(),
      lat: Joi.number().required(),
      lng:Joi.number().required(),
      city:Joi.string().required(),
      uf:Joi.string().max(2).min(2).required(),
      items: Joi.string().required(),
    })
  },{
    abortEarly:false,
  }),
  pointsController.create);

export default pointsRouter;

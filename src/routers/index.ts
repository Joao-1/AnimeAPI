import { Router } from 'express';
import StreamingAnime from '../controllers/streamingController';
import Animes from '../controllers/animesController';
import Tags from '../controllers/tagsController';
import Episodes from '../controllers/episodesController';
import validator from '../middlewares/SchemaValidator';
import validateOneFile from '../middlewares/FileVelidator';

const routes = Router();

const streamingAnime = new StreamingAnime();
const animes = new Animes();
const episodes = new Episodes();
const tags = new Tags();

// tags
routes.post('/tags', tags.create);

// animes
routes.post('/animes', validateOneFile('image', 'image/png'), validator, animes.create);
routes.get('/animes', animes.read);
routes.put('/animes/:id', animes.upload);
routes.delete('/animes/:id', animes.delete);

// episodes
routes.post('/:anime/episodes', validateOneFile('episode', 'video/mp4'), episodes.create);

// streaming
routes.get('/watch/:anime/:episode', streamingAnime.create);

routes.use(async (req, res, next) => {
    res.status(404).send({ error: 'Page not found' });
});

export default routes;

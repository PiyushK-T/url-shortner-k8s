import urlsRoutes from './urls.js';
import userRoutes from './userRoutes.js';

const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use('/', urlsRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ Error: "Page Not found" });
  });
};

export default constructorMethod;

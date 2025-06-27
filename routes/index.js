import urlsRoutes from './urls.js';

const constructorMethod = (app) => {
  app.use('/', urlsRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ Error: "Page Not found" });
  });
};

export default constructorMethod;

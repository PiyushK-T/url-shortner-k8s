import urlsRoutes from './urls.js';
import userRoutes from './userRoutes.js';
import dashboardRoutes from './dashboard.js';

const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use('/', dashboardRoutes);
  app.use('/', urlsRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ Error: "Page Not found" });
  });
};

export default constructorMethod;

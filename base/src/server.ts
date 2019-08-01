import app from './internal/app';
import routes from './internal/routes';
import appContext from './context/app';

let appCtx: appContext = new appContext();
app.set('context', appCtx);

/**
 * Primary app routes.
 */
app.use('/', routes);

/**
 *  * Start Express server.
 */
const server = async () => {
  app.listen(app.get('port'), app.get('host'), () => {
    console.log(
      '  App is running at http://%s:%d in %s mode',
      app.get('host'),
      app.get('port'),
      app.get('env')
    );
    console.warn('  Press CTRL-C to stop\n');
  });
}

export default server();

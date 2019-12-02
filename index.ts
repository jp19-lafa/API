// ====================================================== //
// =================== Startup Server =================== //
// ====================================================== //

// Register Module Aliases (in package.json)
require('module-alias/register');

import { App } from '@app';

const app = new App();

app.listen();
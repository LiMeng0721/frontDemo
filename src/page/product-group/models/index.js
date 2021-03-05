import lugiax from '@lugia/lugiax';
import sync from '../controller/sync';
import async from '../controller/async.js';
import productGroupSetVo from './productGroupSetVo.js';

export default lugiax.register({
    model: 'productGroupSetVo',
    state: {
      ...productGroupSetVo,
    },
    mutations: {
      async: async,
      sync: sync
    }
  });;
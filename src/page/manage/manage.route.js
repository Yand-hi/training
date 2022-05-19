import {routerHelperProvider} from '../../router';
import {sliceRoute} from "./slice/slice.route";
import {entryRoute} from "./entry/entry.route";
import {shareRoute} from "./share/share.route";
import {roleRoute} from "./role/role.route";
import {catalogueRoute} from "./catalogue/catalogue.route";
import {statisticsRoute} from "./statistics/statistics.route";
import {messageRoute} from "./message/message.route";
import {logRoute} from './log/log.route';
import {systemRoute} from './system/system.route';
import {uploadRoute} from "./upload/upload.route";
import {trainingRoute} from "./training/training.route";
import {scannerRoute} from "./scanner/scanner.route";
import {fileRoute} from "./file/file.route";
import {readingRoute} from "./reading/reading.route";
import {labelRoute} from "./label/label.route";
import {cleaningRoute} from "./cleaning/cleaning.route";

export const manageRoute = [
         {
           path: "/manage",
           component: () => import(/* webpackChunkName: "manage" */ "./manage"),
           name: "manage",
           beforeEnter: (to, from, next) => {
             next();
           },
           redirect: "/scanner/expand",
           children: [
             ...scannerRoute,
             ...fileRoute,
             ...cleaningRoute,
             ...catalogueRoute,
             ...labelRoute,
             ...readingRoute,
            //  ...sliceRoute,
            //  ...entryRoute,
            //  ...shareRoute,
            //  ...roleRoute,
             ...trainingRoute,
             ...statisticsRoute,
            //  ...messageRoute,
            //  ...logRoute,
             ...systemRoute,
            //  ...uploadRoute,
           ]
         }
       ];

routerHelperProvider.configureRoutes(manageRoute);

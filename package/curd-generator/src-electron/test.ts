import {Generator} from "app/src-electron/app/Generator";

const generator = new Generator({
  json_file_path: "/Volumes/Project/003_Stread/nest-quasar-curd/package/data/test.json",
  backend_path: "/Volumes/Project/003_Stread/nest-quasar-curd/example/nest/src/curd",
  frontend_path: "/Volumes/Project/003_Stread/nest-quasar-curd/example/quasar/src/curd"
});
generator.start();
generator.writeToFile();

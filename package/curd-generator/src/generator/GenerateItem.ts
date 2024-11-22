import {EntityDefine} from "../constant";
import {GenerateClass} from "./lib/GenerateClass";
import {GenerateControllerService} from "./lib/GenerateControllerService";
import {GenerateVueHome} from "./lib/GenerateVueHome";
import {GenerateVueForm} from "./lib/GenerateVueForm";
import {GenerateInterface} from "./lib/GenerateInterface";
import {GenerateVueData} from "./lib/GenerateVueData";

export class GenerateItem {
    G_Class: GenerateClass = new GenerateClass(this);
    G_ControllerService: GenerateControllerService = new GenerateControllerService(this);
    G_VueHome: GenerateVueHome = new GenerateVueHome(this);
    G_VueForm: GenerateVueForm = new GenerateVueForm(this);
    G_Interface: GenerateInterface = new GenerateInterface(this);
    G_VueData: GenerateVueData = new GenerateVueData(this);

    constructor
    (
        public readonly config: EntityDefine,
        public readonly output_backend_target: string,
        public readonly output_frontend_target: string,
    ) {
    }

    start() {
        this.G_Class.start();
        this.G_ControllerService.start();
        this.G_VueHome.start();
        this.G_VueForm.start();
        this.G_Interface.start();
        this.G_VueData.start();
    }
}
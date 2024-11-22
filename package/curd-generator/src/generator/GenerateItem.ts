import {EntityDefine} from "../link/index";
import {GenerateEntity} from "./lib/GenerateEntity";
import {GenerateControllerService} from "./lib/GenerateControllerService";
import {GenerateVueHome} from "./lib/GenerateVueHome";
import {GenerateVueForm} from "./lib/GenerateVueForm";
import {GenerateInterface} from "./lib/GenerateInterface";
import {GenerateVueData} from "./lib/GenerateVueData";

export class GenerateItem {
    public readonly config: EntityDefine
    public readonly output_backend_target: string
    public readonly output_frontend_target: string

    G_Entity: GenerateEntity = new GenerateEntity(this);
    G_ControllerService: GenerateControllerService = new GenerateControllerService(this);
    G_VueHome: GenerateVueHome = new GenerateVueHome(this);
    G_VueForm: GenerateVueForm = new GenerateVueForm(this);
    G_Interface: GenerateInterface = new GenerateInterface(this);
    G_VueData: GenerateVueData = new GenerateVueData(this);

    constructor(
        config: EntityDefine,
        output_backend_target: string,
        output_frontend_target: string,
    ) {
        this.config = config;
        this.output_backend_target = output_backend_target;
        this.output_frontend_target = output_frontend_target;
    }

    start() {
        this.G_Entity.start();
        this.G_ControllerService.start();
        this.G_VueHome.start();
        this.G_VueForm.start();
        this.G_Interface.start();
        this.G_VueData.start();
    }
}
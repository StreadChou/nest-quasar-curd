import TdView from "./TdView.vue";
import FormView from "./FormView.vue";
import {AbstractTypeHandler} from "../AbstractTypeHandler";

export class TypeDefault extends AbstractTypeHandler {


    td_component() {
        return TdView;
    }

    form_component() {
        return FormView;
    }

}
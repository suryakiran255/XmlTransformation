import { resourceLimits } from "worker_threads";
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class XmlTransformComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    /**
     * Empty constructor.
     */
    outputs: IOutputs = {
        OutputXML: undefined
    }
    notifyOutputChanged: () => void;

    constructor() {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        // Add control initialization code
        this.notifyOutputChanged = notifyOutputChanged;
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
        console.debug("TransformXML:updateview");

        const functionName: string = (context.parameters.functionName.raw as string);

        if (functionName == "XmlTransformFromXslt") {
            if (context.parameters.InputXML && context.parameters.InputXslt) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(context.parameters.InputXML.raw as string, "text/xml");

                const xsltDoc = parser.parseFromString(context.parameters.InputXslt.raw as string, "text/xml");

                if (document.implementation) {
                    const xsltProcessor = new XSLTProcessor();
                    xsltProcessor.importStylesheet(xsltDoc);
                    const resultDocument = xsltProcessor.transformToDocument(xmlDoc);

                    const serializer = new XMLSerializer();
                    this.outputs.OutputXML = serializer.serializeToString(resultDocument);
                }
            }
        }
        this.notifyOutputChanged();
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        console.debug("Transform XML:getOutputs")
        return this.outputs;
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
